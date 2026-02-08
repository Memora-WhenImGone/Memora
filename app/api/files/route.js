import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";

export async function GET() {
  try {
    await connectToDatabase();

    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const uid = userData?.id;
    if (!uid) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const files = await File.find({ owner: uid })
      .sort({ createdAt: -1 })
      .select("bucket key size contentType etag originalName createdAt updatedAt");

    return NextResponse.json({ files }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
