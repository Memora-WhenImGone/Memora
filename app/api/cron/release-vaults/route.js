import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import ContactSession from "@/dataBase/ContactSession";
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
const CONTACT_TOKEN_TTL_MS = CONTACT_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

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

  const inactiveVaultCandidates = await Vault.collection
    .aggregate(inactiveVaultPipeline)
    .toArray();

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

  return {
    checked: inactiveVaultCandidates.length,
    released: releasedCount,
    summary: releaseSummary,
  };
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