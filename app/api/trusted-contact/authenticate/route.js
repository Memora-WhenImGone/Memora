import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import ContactSession from "@/dataBase/ContactSession";
import { createHash } from "crypto";

connectToDatabase();

export async function POST(request) {
  try {

     const reqBody = await request.json();
     const { token } = reqBody;
    if (!token) return NextResponse.json({ message: "Token required" }, { status: 400 });

    const tokenHash =createHash("sha256").update(token).digest("hex");
    const session = await ContactSession.findOne({ tokenHash });

    if (!session) return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    if (session.expiresAt < new Date()) return NextResponse.json({ message: "Token expired" }, { status: 401 });
    if (!session.usedAt) {
      session.usedAt = new Date();
      await session.save();
    }

    const vault = await Vault.findById(session.vault);
    if (!vault || vault.status !== "released") {
      return NextResponse.json({ message: "Vault not accessible" }, { status: 403 });
    }
    const contact = vault.contacts.id(session.contactId);
    if (!contact) return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    return NextResponse.json({
      encryptedDEK: contact.encryptedDEK,
      publicKey: contact.publicKey,
      contactName: contact.name,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
