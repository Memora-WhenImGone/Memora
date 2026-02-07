import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/utils/s3";

const EXPIRES = 60;

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();

    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const uid = userData?.id;
    if (!uid) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params?.id;
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const file = await File.findOne({ _id: id, owner: uid });
    if (!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

    const command = new GetObjectCommand({ Bucket: file.bucket, Key: file.key });
    const url = await getSignedUrl(s3, command, { expiresIn: EXPIRES }); // signed url when user download somthing // aws test question

    return NextResponse.json({ url, expiresIn: EXPIRES }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
