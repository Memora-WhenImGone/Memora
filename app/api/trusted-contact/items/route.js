import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import ContactSession from "@/dataBase/ContactSession";
import { createHash } from "crypto";

connectToDatabase();

export async function POST(request) {
  try {
        const reqBody = await request.json();
         const { token } = reqBody;
    if (!token) return NextResponse.json({ message: "Token required" }, { status: 400 });

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const session = await ContactSession.findOne({ tokenHash });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const contactId = session.contactId?.toString();
    const vaultId = session.vault?.toString();

    const vault = await Vault.findById(vaultId);
    if (!vault || vault.status !== "released") {
      return NextResponse.json({ message: "Vault not accessible" }, { status: 403 });
    }

    const items = await VaultItem.find({
      vault: vaultId,
      assignedTo: contactId,
      deletedAt: { $exists: false },
    }).select("type title description tags secret fileIds updatedAt createdAt");

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}