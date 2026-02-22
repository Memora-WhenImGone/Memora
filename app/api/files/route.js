import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";
import { authChecker } from "@/utils/auth";
connectToDatabase();

export async function GET() {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

    const files = await File.find({ owner: uid })
      .sort({ createdAt: -1 })
      .select("bucket key size contentType etag originalName createdAt updatedAt");

    return NextResponse.json({ files }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
