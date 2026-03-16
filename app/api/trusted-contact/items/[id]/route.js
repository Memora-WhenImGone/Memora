import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import File from "@/dataBase/File";
import ContactSession from "@/dataBase/ContactSession";
import { createHash } from "crypto";

connectToDatabase();

export async function GET(request, { params }) {
  try {
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
    const itemId = (await params)?.id;
    if (!itemId) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const vault = await Vault.findById(vaultId);
    if (!vault || vault.status !== "released") {
      return NextResponse.json({ message: "Vault not accessible" }, { status: 403 });
    }

    const item = await VaultItem.findOne({ _id: itemId, vault: vaultId, deletedAt: { $exists: false } })
      .select("type title description tags fileIds updatedAt createdAt assignedTo");
    if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const isAssigned = (item.assignedTo || []).map(String).includes(String(contactId));
    if (!isAssigned) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const files = await File.find({ _id: { $in: item.fileIds }, vault: vaultId })
      .select("_id size contentType originalName encAlg encNonce createdAt");

    return NextResponse.json({
      item: {
        id: item._id,
        type: item.type,
        title: item.title,
        description: item.description,
        tags: item.tags,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
      },
      files,
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

