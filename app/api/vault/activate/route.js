import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";

export async function POST() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner = decoded.id;
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
