import { NextResponse } from "next/server";
import { uploadToS3 } from "@/utils/s3";
import { connectToDatabase } from "@/lib/mongoose";
import File from "@/dataBase/File";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import { authChecker } from "@/utils/auth";
connectToDatabase();

const MAX_SIZE = 5 * 1024 * 1024;
const OK_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

export async function POST(request) {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

    const form = await request.formData();
    const file = form.get("file");
    const vaultIdRaw = form.get("vaultId");
    const itemIdRaw = form.get("itemId");
    const titleRaw = form.get("title");

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
    let vaultId = vaultIdRaw || null;
    if (!vaultId) {
      const v = await Vault.findOne({ owner: uid });
      vaultId = v?._id || null;
    } else {
      const v = await Vault.findOne({ _id: vaultIdRaw, owner: uid });
      if (!v) return NextResponse.json({ message: "Vault not found" }, { status: 404 });
      vaultId = v._id;
    }
    if (!vaultId) return NextResponse.json({ message: "Vault not found" }, { status: 404 });

    let itemId = itemIdRaw || null;
    if (itemId) {
      const it = await VaultItem.findOne({ _id: itemId, owner: uid, vault: vaultId, deletedAt: { $exists: false } });
      if (!it) return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    if (!itemId) {
      const title = (typeof titleRaw === "string" && titleRaw.trim()) ? titleRaw.trim() : parts.join(".") || "Document";
      const created = await VaultItem.create({
        owner: uid,
        vault: vaultId,
        type: "document",
        title,
        description: "",
        tags: [],
      });
      itemId = created._id;
    }

    const s3Key = `users/${uid}/vaults/${vaultId}/${itemId}/${Date.now()}.${ext}`;
// geeting ready
    const s3Res = await uploadToS3({
      key: s3Key,
      body: buf,
      contentType: mime,
    });

    const doc = await File.create({
      owner: uid,
      vault: vaultId,
      item: itemId,
      bucket: s3Res.bucket,
      key: s3Res.key,
      size: fileSize,
      contentType: mime,
      etag: s3Res.etag,
      originalName: fileName,
      uploadedAt: new Date(),
    });

   
    await VaultItem.updateOne({ _id: itemId }, { $addToSet: { fileIds: doc._id } });

    return NextResponse.json(
      {
        message: "Uploaded",
        bucket: s3Res.bucket,
        key: s3Res.key,
        etag: s3Res.etag,
        size: fileSize,
        contentType: mime,
        fileId: doc._id,
        itemId: itemId,
        vaultId: vaultId,
      },
      { status: 200 }
    );
  } catch (err) {
    
    console.log(err)
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
