import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function DELETE(_request, { params }) {
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

    await s3Client.send(
      new DeleteObjectCommand({ Bucket: file.bucket, Key: file.key })
    );

 
    await File.deleteOne({ _id: file._id });

    return NextResponse.json({ message: "File deleted" }, { status: 200 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
