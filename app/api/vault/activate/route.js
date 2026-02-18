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
    const vault = await Vault.findOneAndUpdate(
      { owner },
      { $set: { status: "active", activatedAt: new Date() } },
      { new: true }
    );
    if (!vault) return NextResponse.json({ message: " Vault Not found" }, { status: 404 });
    return NextResponse.json({ vault }, { status: 200 });
  } catch (error) {
    // console.log(error)
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
