import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import ContactSession from "@/dataBase/ContactSession";
import { authChecker } from "@/utils/auth";
import { sendEmail } from "@/utils/mail";
import {
  unwrapEncryptionKey,
  encryptDEKForContact,
  generateContactKeyPair,
  generateFingerprint,
  generateVaultDEK,
  wrapEncryptionKey,
} from "@/utils/crypto";
import { checkRateLimit, sensitiveLimiter } from "@/utils/rateLimit";

connectToDatabase();

function createInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildInviteLink(origin, token) {
  return `${origin}/contact-access?token=${token}`;
}

function buildInviteEmailText({
  contactName,
  link,
  token,
  privateKey,
  expiresInDays,
}) {
  return `Hello ${contactName},

You have been invited as a trusted contact for a Memora vault.

Use the link and token below to access the shared items:

Link: ${link}
Token: ${token}

Your private key (keep it secret and store it safely):
${privateKey ? privateKey : "(Already registered on file)"}

This token will expire in ${expiresInDays} days.

If you were not expecting this email, you can ignore it.`;
}

async function ensureVaultDEK(vault) {
  if (vault.dekWrapped) {
    const existingDEK = await unwrapEncryptionKey(vault.dekWrapped);
    return existingDEK;
  }

  const newDEK = await generateVaultDEK();
  const wrappedDEK = await wrapEncryptionKey(newDEK);

  vault.dekWrapped = wrappedDEK;
  vault.dekAlg = "secretbox";
  vault.dekVersion = 1;
  vault.dekCreatedAt = new Date();

  return newDEK;
}

async function ensureContactKeyPair(contact) {
  let privateKeyForEmail = null;

  if (contact.publicKey) {
    return privateKeyForEmail;
  }

  const { publicKeyB64, privateKeyB64 } = await generateContactKeyPair();

  contact.publicKey = publicKeyB64;
  contact.keyFingerprint = await generateFingerprint(publicKeyB64);
  contact.keyVersion = 1;
  contact.keyStatus = "active";
  contact.lastKeySentAt = new Date();

  privateKeyForEmail = privateKeyB64;

  return privateKeyForEmail;
}

async function upsertContactSession({ vaultId, contactId, tokenHash, expiresAt }) {
  return ContactSession.findOneAndUpdate(
    {
      vault: vaultId,
      contact: contactId,
    },
    {
      tokenHash,
      expiresAt,
      usedAt: null,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function POST(request) {
  try {
    const rateLimited = await checkRateLimit(request, sensitiveLimiter);
    if (rateLimited) return rateLimited;

    const auth = await authChecker();

    if (!auth.ok) {
      return auth.response;
    }

    const userId = auth.uid;

    const vault = await Vault.findOne({ owner: userId });

    if (!vault) {
      return NextResponse.json(
        { message: "Vault not found" },
        { status: 404 }
      );
    }

    const origin = request.nextUrl.origin;
    const expiresInDays = 7;
    const expiresAt = new Date(
      Date.now() + expiresInDays * 24 * 60 * 60 * 1000
    );

    let invited = 0;
    let emailed = 0;
    let skipped = 0;

    const invites = [];

    const dekBytes = await ensureVaultDEK(vault);

    for (const contact of vault.contacts) {
      try {
        const token = createInviteToken();
        const tokenHash = hashToken(token);
        const inviteLink = buildInviteLink(origin, token);

        await upsertContactSession({
          vaultId: vault._id,
          contactId: contact._id,
          tokenHash,
          expiresAt,
        });

        if (contact.status === "pending") {
          contact.status = "invited";
        }

        contact.invitedAt = new Date();
        invited++;

        const privateKeyForEmail = await ensureContactKeyPair(contact);

        try {
          contact.encryptedDEK = await encryptDEKForContact(
            dekBytes,
            contact.publicKey
          );
        } catch (encryptionError) {
          console.error(
            `Failed to encrypt DEK for contact ${contact.email}:`,
            encryptionError
          );
        }

        const subject = "You have been invited to access a Memora vault";

        const text = buildInviteEmailText({
          contactName: contact.name,
          link: inviteLink,
          token,
          privateKey: privateKeyForEmail,
          expiresInDays,
        });

        try {
          await sendEmail(contact.email, subject, text);
          emailed++;
        } catch (emailError) {
          console.error(
            `Failed to send invite email to ${contact.email}:`,
            emailError
          );
        }

        invites.push({
          name: contact.name,
          email: contact.email,
          token,
          url: inviteLink,
          privateKey: privateKeyForEmail,
        });
      } catch (contactError) {
        skipped++;
        console.error("Failed to process contact invite:", contactError);
      }
    }

    await vault.save();

    return NextResponse.json(
      {
        ok: true,
        invited,
        emailed,
        skipped,
        expiresInDays,
        invites,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send invites:", error);

    return NextResponse.json(
      { message: "Failed to send invites" },
      { status: 500 }
    );
  }
}