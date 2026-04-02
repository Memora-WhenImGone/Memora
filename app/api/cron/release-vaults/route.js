import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import ContactSession from "@/dataBase/ContactSession";
import User from "@/dataBase/User";
import { sendEmail } from "@/utils/mail";
import {
  generateVaultDEK,
  wrapEncryptionKey,
  unwrapEncryptionKey,
  generateContactKeyPair,
  generateFingerprint,
  encryptDEKForContact,
} from "@/utils/crypto";

connectToDatabase();

const CONTACT_PORTAL_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.APP_BASE_URL ||
  "https://mymemora.online";

const CONTACT_TOKEN_TTL_DAYS = Number(process.env.CONTACT_TOKEN_TTL_DAYS || 10);
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const CONTACT_TOKEN_TTL_MS = CONTACT_TOKEN_TTL_DAYS * MS_PER_DAY;

export async function POST(request) {


  const secretHeader = request.headers.get("x-cron-secret");

  if (!process.env.CRON_SECRET || secretHeader !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await releaseInactiveVaultsAndNotifyContacts();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to release vaults via cron:", error);
    return NextResponse.json({ message: "Failed to release vaults" }, { status: 500 });
  }
}

async function releaseInactiveVaultsAndNotifyContacts() {
  const inactiveVaultPipeline = [
    {
      $match: {
        status: "active",
        "trigger.inactivityDays": { $gt: 0 },
      },
    },
    {
      $addFields: {
        cutoff: {
          $dateSubtract: {
            startDate: "$$NOW",
            unit: "day",
            amount: "$trigger.inactivityDays",
          },
        },
      },
    },
    {
      $match: {
        $expr: { $lte: ["$lastActiveAt", "$cutoff"] },
      },
    },
  ];

  const inactiveVaultCandidates = await Vault.aggregate(inactiveVaultPipeline);


  const releaseSummary = [];
  let releasedCount = 0;

  for (const candidate of inactiveVaultCandidates) {
    const vaultDocument = await Vault.findById(candidate._id);

    if (!vaultDocument) continue;

    try {
      const vaultReleaseResult = await releaseSingleVault(vaultDocument);

      releaseSummary.push({
        vaultId: String(vaultDocument._id),
        contactsNotified: vaultReleaseResult.notified,
        errors: vaultReleaseResult.errors,
      });

      releasedCount += 1;
    } catch (err) {
      console.error(`Failed to release vault ${vaultDocument._id}:`, err);

      releaseSummary.push({
        vaultId: String(vaultDocument._id),
        contactsNotified: 0,
        errors: [err.message || String(err)],
      });
    }
  }

  const warningResult = await notifyVaultOwnersAboutInactivity();

  return {
    checked: inactiveVaultCandidates.length,
    released: releasedCount,
    summary: releaseSummary,
    warnings: warningResult,
  };
}

async function notifyVaultOwnersAboutInactivity() {
  const warningPipeline = [
    {
      $match: {
        status: "active",
        "trigger.inactivityDays": { $gt: 0 },
        "trigger.warningDays": { $gt: 0 },
      },
    },
    {
      $addFields: {
        warningCutoff: {
          $dateSubtract: {
            startDate: "$$NOW",
            unit: "day",
            amount: "$trigger.warningDays",
          },
        },
      },
    },
    {
      $match: {
        $expr: { $lte: ["$lastActiveAt", "$warningCutoff"] },
      },
    },
  ];

  const warningCandidates = await Vault.aggregate(warningPipeline);
  const warningSummary = [];
  let warningsSent = 0;

  for (const candidate of warningCandidates) {
    const vaultDocument = await Vault.findById(candidate._id);

    if (!vaultDocument) {
      warningSummary.push({
        vaultId: String(candidate._id),
        sent: false,
        reason: "vault not found",
      });
      continue;
    }

    try {
      const warningResult = await maybeSendVaultWarning(vaultDocument);
      if (warningResult.sent) {
        warningsSent += 1;
      }

      warningSummary.push({
        vaultId: String(vaultDocument._id),
        sent: warningResult.sent || false,
        milestone: warningResult.milestone ?? null,
        daysRemaining: warningResult.daysRemaining ?? null,
        reason: warningResult.sent ? null : warningResult.reason || null,
      });
    } catch (err) {
      warningSummary.push({
        vaultId: String(vaultDocument._id),
        sent: false,
        reason: err.message || String(err),
      });
    }
  }

  return {
    checked: warningCandidates.length,
    warned: warningsSent,
    summary: warningSummary,
  };
}

async function maybeSendVaultWarning(vaultDocument) {
  if (!vaultDocument || vaultDocument.status !== "active") {
    return { sent: false, reason: "vault not active" };
  }

  const triggerDays = Number(vaultDocument?.trigger?.inactivityDays) || 0;
  const warningDays = Number(vaultDocument?.trigger?.warningDays) || 0;

  if (triggerDays <= 0) {
    return { sent: false, reason: "invalid trigger days" };
  }

  if (warningDays <= 0) {
    return { sent: false, reason: "warnings is not set" };
  }

  if (warningDays >= triggerDays) {
    return { sent: false, reason: "Warning days overlapping" };
  }

  const maxWarnings = Math.floor((triggerDays - 1) / warningDays);

  if (maxWarnings <= 0) {
    return { sent: false, reason: "no warnings allowed" };
  }

  const inactivityDays = calculateInactivityDays(vaultDocument.lastActiveAt);
  if (inactivityDays <= 0) {
    return { sent: false, reason: "vault recently active" };
  }

  if (inactivityDays >= triggerDays) {
    return { sent: false, reason: "Done" };
  }

  const milestone = Math.floor(inactivityDays / warningDays);
  if (milestone <= 0) {
    return { sent: false, reason: "warning interval not reached" };
  }

  if (milestone > maxWarnings) {
    return { sent: false, reason: "no more warning slots" };
  }

  const warningsSent = Array.isArray(vaultDocument.warningsSent)
    ? vaultDocument.warningsSent
    : [];
  if (warningsSent.includes(milestone)) {
    return { sent: false, reason: "warning already sent for milestone" };
  }

  const owner = await User.findById(vaultDocument.owner).lean();
  if (!owner?.email) {
    return { sent: false, reason: "missing owner email" };
  }

  const daysRemaining = Math.max(triggerDays - inactivityDays, 0);

  const warningEmail = buildVaultWarningEmail({
    ownerName: owner.fullname,
    vaultName: vaultDocument.name,
    inactivityDays,
    triggerDays,
    warningDays,
    daysRemaining,
  });

  await sendEmail(
    owner.email,
    "Memora vault inactivity warning",
    warningEmail
  );

  const uniqueMilestones = new Set(warningsSent);
  uniqueMilestones.add(milestone);

  vaultDocument.warningsSent = Array.from(uniqueMilestones).sort(
    (a, b) => a - b
  );
  vaultDocument.lastWarningSentAt = new Date();
  await vaultDocument.save();

  return { sent: true, milestone, daysRemaining };
}

function calculateInactivityDays(lastActiveAt) {
  if (!lastActiveAt) return 0;

  const lastActiveTime = new Date(lastActiveAt).getTime();
  if (Number.isNaN(lastActiveTime)) {
    return 0;
  }

  const diff = Date.now() - lastActiveTime;
  if (diff <= 0) {
    return 0;
  }

  return Math.floor(diff / MS_PER_DAY);
}

function buildVaultWarningEmail({
  ownerName,
  vaultName,
  inactivityDays,
  triggerDays,
  warningDays,
  daysRemaining,
}) {
  const friendlyName = vaultName || "your Memora vault";
  const remainingText =
    daysRemaining <= 0
      ? "less than 1 day"
      : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;
  const warningText = `${warningDays} day${warningDays === 1 ? "" : "s"}`;

  return `Hello ${ownerName || "there"},

We have not seen any activity in "${friendlyName}" for ${inactivityDays} days. Once it reaches ${triggerDays} days of inactivity, your vault will automatically be released to the trusted contacts you selected.

You still have ${remainingText} before that release happens. Signing into your Memora dashboard or performing any action will immediately reset the inactivity timer.

We'll continue to remind you every ${warningText} until you become active again or the vault is released.

- Team My Memora`;
}

async function releaseSingleVault(vaultDocument) {
  const contactErrors = [];
  const contactsEligibleForRelease = await getContactsWithAssignedItems(
    vaultDocument
  );

  const vaultDEKBytes = await ensureVaultDataEncryptionKey(vaultDocument);

  for (const contact of contactsEligibleForRelease) {
    try {
      const { privateKeyB64 } = await prepareContactAccess(
        vaultDocument,
        contact,
        vaultDEKBytes
      );

      const session = await createOrUpdateContactSession(
        vaultDocument._id,
        contact._id
      );

      await sendContactAccessEmail(
        contact,
        session,
        privateKeyB64,
        vaultDocument.name || "Memora Vault"
      );
    } catch (err) {
      console.error(
        `Failed to process contact ${contact.email} for vault ${vaultDocument._id}:`,
        err
      );

      contactErrors.push(err.message || String(err));
    }
  }

  vaultDocument.status = "released";
  vaultDocument.releasedAt = new Date();
  await vaultDocument.save();

  return {
    notified: contactsEligibleForRelease.length - contactErrors.length,
    errors: contactErrors,
  };
}

async function getContactsWithAssignedItems(vaultDocument) {
  const assignedContactIds = await VaultItem.distinct("assignedTo", {
    vault: vaultDocument._id,
    deletedAt: { $exists: false },
  });

  const assignedContactIdSet = new Set(
    assignedContactIds.map((id) => String(id))
  );

  return (vaultDocument.contacts || []).filter(
    (contact) => contact?.email && assignedContactIdSet.has(String(contact?._id))
  );
}

async function ensureVaultDataEncryptionKey(vaultDocument) {
  if (vaultDocument.dekWrapped) {
    return unwrapEncryptionKey(vaultDocument.dekWrapped);
  }

  const generatedDEK = await generateVaultDEK();
  const wrappedDEK = await wrapEncryptionKey(generatedDEK);

  vaultDocument.dekWrapped = wrappedDEK;
  vaultDocument.dekAlg = "secretbox";
  vaultDocument.dekVersion = 1;
  vaultDocument.dekCreatedAt = new Date();

  return generatedDEK;
}

async function prepareContactAccess(vaultDocument, contact, vaultDEKBytes) {
  const now = new Date();
  let privateKeyB64 = null;

  if (!contact.publicKey || contact.status !== "verified") {
    const keyPair = await generateContactKeyPair();

    contact.publicKey = keyPair.publicKeyB64;
    contact.keyFingerprint = await generateFingerprint(keyPair.publicKeyB64);
    contact.keyVersion = (contact.keyVersion || 0) + 1;
    contact.keyStatus = "active";
    contact.lastKeySentAt = now;

    if (!contact.invitedAt) {
      contact.invitedAt = now;
    }

    if (contact.status === "pending") {
      contact.status = "invited";
    }

    privateKeyB64 = keyPair.privateKeyB64;
  }

  contact.encryptedDEK = await encryptDEKForContact(
    vaultDEKBytes,
    contact.publicKey
  );

  vaultDocument.markModified("contacts");

  return { privateKeyB64 };
}

async function createOrUpdateContactSession(vaultId, contactId) {
  const contactAccessToken = crypto.randomBytes(32).toString("hex");

  const contactAccessTokenHash = crypto
    .createHash("sha256")
    .update(contactAccessToken)
    .digest("hex");

  const tokenExpiresAt = new Date(Date.now() + CONTACT_TOKEN_TTL_MS);

  await ContactSession.findOneAndUpdate(
    { vault: vaultId, contact: contactId },
    {
      tokenHash: contactAccessTokenHash,
      expiresAt: tokenExpiresAt,
      usedAt: null,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return {
    token: contactAccessToken,
    link: `${CONTACT_PORTAL_BASE_URL}/contact-access?token=${contactAccessToken}`,
  };
}

async function sendContactAccessEmail(
  contact,
  session,
  privateKeyB64,
  vaultName
) {
  const emailBody = buildContactAccessEmailText(
    contact,
    session,
    privateKeyB64,
    vaultName
  );

  await sendEmail(contact.email, "Your Memora vault access", emailBody);
}

function buildContactAccessEmailText(
  contact,
  session,
  privateKeyB64,
  vaultName
) {
  const privateKeySection = privateKeyB64
    ? `Your private key (keep this secret and store it safely):
${privateKeyB64}`
    : `Use the private key you already have on file with Memora.`;

  return `Hello ${contact.name || "there"},

You now have access to "${vaultName}".

Link: ${session.link}
Token: ${session.token}

${privateKeySection}

This token expires in ${CONTACT_TOKEN_TTL_DAYS} days.`;
}
