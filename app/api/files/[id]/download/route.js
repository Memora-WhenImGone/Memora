import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/utils/s3";
import { authChecker } from "@/utils/auth";
connectToDatabase();

const EXPIRES = 60;

export async function GET(_request, { params }) {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

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
