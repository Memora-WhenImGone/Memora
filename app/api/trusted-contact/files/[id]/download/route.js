import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import File from "@/dataBase/File";
import ContactSession from "@/dataBase/ContactSession";
import { createHash } from "crypto";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/utils/s3";

connectToDatabase();

const EXPIRES = 60;

export async function GET(request, { params }) {
  try {
 

    if (!process.env.AWS_REGION 
      || !process.env.AWS_S3_BUCKET 
      || !process.env.AWS_ACCESS_KEY_ID 
      || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { message: "S3 is not configured." },
         { status: 500 }
        );
    }
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ message: "Token required" }, { status: 400 });

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const session = await ContactSession.findOne({ tokenHash });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const contactId = session.contact?.toString();
    const vaultId = session.vault?.toString();
    const fileId = (await params)?.id;
    if (!fileId) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const vault = await Vault.findById(vaultId);
    if (!vault || vault.status !== "released") {
      return NextResponse.json({ message: "Vault not accessible" }, { status: 403 });
    }

    const file = await File.findOne({ _id: fileId, vault: vaultId });
    if (!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

    const item = await VaultItem.findOne({ _id: file.item, vault: vaultId, deletedAt: { $exists: false } })
      .select("assignedTo");
    const isAssigned = (item?.assignedTo || []).map(String).includes(String(contactId));
    if (!isAssigned) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const command = new GetObjectCommand({ Bucket: file.bucket, Key: file.key });
    const urlSigned = await getSignedUrl(s3, command, { expiresIn: EXPIRES });


    const s3Res = await fetch(urlSigned);
    if (!s3Res.ok) return NextResponse.json({ message: "Failed to fetch from storage" }, { status: 502 });

    const body = await s3Res.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.originalName || "file"}"`,
        "Content-Length": String(body.byteLength),
      },
    });
  } catch (err) {
    const payload = { message: "Failed" };
    if (process.env.NODE_ENV !== "production") {
      payload.error = String(err && err.message ? err.message : err);
    }
    return NextResponse.json(payload, { status: 500 });
  }
}
