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
  "application/octet-stream",
];

export async function POST(request) {
  try {
 

    const auth = await authChecker();

    if (!auth.ok) {
      return auth.response;
    }

    const uid = auth.uid;

    const form = await request.formData();
    const file = form.get("file");
    const vaultIdRaw = form.get("vaultId");
    const itemIdRaw = form.get("itemId");
    const titleRaw = form.get("title");
    const encAlg = form.get("encAlg") || null;
    const encNonce = form.get("encNonce") || null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    let mime = file.type;
    if (!mime) {
      mime = "application/octet-stream";
    }

    let fileSize = file.size;
    if (!fileSize) {
      fileSize = 0;
    }

    if (!OK_TYPES.includes(mime)) {
      return NextResponse.json({ message: "File type not allowed" }, { status: 415 });
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ message: "File too large" }, { status: 413 });
    }

    const ab = await file.arrayBuffer();
    const buf = Buffer.from(ab);

    let fileName = file.name;
    if (!fileName) {
      fileName = "upload.bin";
    }

    const parts = String(fileName).split(".");

    let ext = "bin";
    if (parts.length > 1) {
      ext = parts.pop();
    }

    let vaultId = null;
    if (vaultIdRaw) {
      vaultId = vaultIdRaw;
    }

    if (!vaultId) {
      const v = await Vault.findOne({ owner: uid });
      if (v) {
        vaultId = v._id;
      }
    } else {
      const v = await Vault.findOne({ _id: vaultIdRaw, owner: uid });
      if (!v) {
        return NextResponse.json({ message: "Vault not found" }, { status: 404 });
      }
      vaultId = v._id;
    }

    if (!vaultId) {
      return NextResponse.json({ message: "Vault not found" }, { status: 404 });
    }

    let itemId = null;
    if (itemIdRaw) {
      itemId = itemIdRaw;
    }

    if (itemId) {
      const it = await VaultItem.findOne({ _id: itemId, owner: uid, vault: vaultId, deletedAt: { $exists: false } });
      if (!it) {
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
      }
    }

    if (!itemId) {
      let title = "Document";
      if (typeof titleRaw === "string" && titleRaw.trim()) {
        title = titleRaw.trim();
      } else if (parts.join(".")) {
        title = parts.join(".");
      }

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

    const s3Res = await uploadToS3({
      key: s3Key,
      body: buf,
      contentType: mime,
    });

    const fileData = {
      owner: uid,
      vault: vaultId,
      item: itemId,
      bucket: s3Res.bucket,
      key: s3Res.key,
      size: fileSize,
      contentType: mime,
      etag: s3Res.etag,
      originalName: fileName,
    };

    if (encAlg) {
      fileData.encAlg = encAlg;
    }

    if (encNonce) {
      fileData.encNonce = encNonce;
    }

    const doc = await File.create(fileData);

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
    console.log(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
