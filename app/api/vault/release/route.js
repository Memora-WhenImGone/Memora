import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import { authChecker } from "@/utils/auth";

connectToDatabase();

export async function POST() {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const owner = auth.uid;

    const vault = await Vault.findOne({ owner });
    if (!vault) return NextResponse.json({ message: "Vault not found" }, { status: 404 });
    vault.status = "released";
    vault.releasedAt = new Date();
    await vault.save();

    return NextResponse.json({ vault }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

