import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { uploadToS3 } from "@/utils/s3";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";

const MAX_SIZE = 5 * 1024 * 1024;
const OK_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

export async function POST(request) {
  try {
    await connectToDatabase();
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = jwt.verify(token, process.env.JWT_SECRET);
    const uid = userData && userData.id;
    if (!uid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const mime = file.type || "application/octet-stream";
    const fileSize = file.size || 0;

    if (!OK_TYPES.includes(mime)) {
      return NextResponse.json({ message: "File type not allowed" }, { status: 415 });
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ message: "File too large" }, { status: 413 });
    }

    const ab = await file.arrayBuffer();
    const buf = Buffer.from(ab);

    const fileName = file.name || "upload.bin";
    const parts = String(fileName).split(".");
    const ext = parts.length > 1 ? parts.pop() : "bin";
    const s3Key = `users/${uid}/${Date.now()}.${ext}`;
// geeting ready
    const s3Res = await uploadToS3({
      key: s3Key,
      body: buf,
      contentType: mime,
    });

    const doc = await File.create({
      owner: uid,
      bucket: s3Res.bucket,
      key: s3Res.key,
      size: fileSize,
      contentType: mime,
      etag: s3Res.etag,
      originalName: fileName,
      uploadedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Uploaded",
        bucket: s3Res.bucket,
        key: s3Res.key,
        etag: s3Res.etag,
        size: fileSize,
        contentType: mime,
        fileId: doc._id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err)
    
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
