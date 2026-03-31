import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import { authChecker } from "@/utils/auth";
import { unwrapEncryptionKey } from "@/utils/crypto";
import { checkRateLimit, sensitiveLimiter } from "@/utils/rateLimit";

connectToDatabase();

export async function GET(request) {
  try {
    const rateLimited = await checkRateLimit(request, sensitiveLimiter);
    if (rateLimited) return rateLimited;

    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const owner = auth.uid;
    const vault = await Vault.findOne({ owner });
    if (!vault || !vault.dekWrapped) return NextResponse.json({ message: "Not prepared" }, { status: 404 });
    const dek = await unwrapEncryptionKey(vault.dekWrapped); 
     //base64 for client use
    const base64 = Buffer.from(dek).toString('base64');
    return NextResponse.json({ dekB64: base64 }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

