import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import { authChecker } from "@/utils/auth";
import { generateVaultDEK, wrapEncryptionKey } from "@/utils/crypto";

connectToDatabase();

export async function POST() {
  try {
    const auth = await authChecker();

    if (!auth.ok) {
      return auth.response;
    }

    const owner = auth.uid;
    const vault = await Vault.findOne({ owner });

    if (!vault) {
      return NextResponse.json({ message: " Vault Not found" }, { status: 404 });
    }

    if (!vault.dekWrapped) {
      try {
        const dek = await generateVaultDEK();
        const wrapped = await wrapEncryptionKey(dek);
        vault.dekWrapped = wrapped;
        vault.dekAlg = "secretbox";
        vault.dekVersion = 1;
        vault.dekCreatedAt = new Date();
      } catch (e) {
        return NextResponse.json({ message: "Failed to prepare encryption" }, { status: 500 });
      }
    }

    vault.status = "active";
    vault.activatedAt = new Date();
    await vault.save();

    return NextResponse.json({ vault }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
