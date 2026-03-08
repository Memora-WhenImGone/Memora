import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import ContactSession from "@/dataBase/ContactSession";
import { authChecker } from "@/utils/auth";
import { sendEmail } from "@/utils/mail";

connectToDatabase();

export async function POST(request) {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;

    const userId = auth.uid;

    const vault = await Vault.findOne({ owner: userId });
    if (!vault) {
      return NextResponse.json({ message: "Vault not found" }, { status: 404 });
    }

    const origin = request.nextUrl.origin;
    const expiresInDays = 7;
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    let invited = 0;
    let emailed = 0;
    let skipped = 0;

    for (const contact of vault.contacts) {
      try {
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        await ContactSession.findOneAndUpdate(
          { vault: vault._id, contactId: contact._id },
          { tokenHash, expiresAt, usedAt: null },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (contact.status === "pending") {
          contact.status = "invited";
        }

        contact.invitedAt = new Date();
        invited++;

        const link = `${origin}/contact-access?token=${token}`;

        const subject = "You have been invited to access a Memora vault";

        const text = `Hello ${contact.name},

      You have been invited as a trusted contact.

    Access the shared items using this link and token:

    Link: ${link}
    Token: ${token}

    This token expires in ${expiresInDays} days.

    If you were not expecting this email, you can ignore this email.`;

        try {
          await sendEmail(contact.email, subject, text);
          emailed++;
        } catch {
        }
      } catch {
        skipped++;
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
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Failed to send invites" }, { status: 500 });
  }
}