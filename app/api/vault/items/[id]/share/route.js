import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import { authChecker } from "@/utils/auth";

connectToDatabase();

export async function PATCH(request, { params }) {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

    const { id } = await params;
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const body = await request.json();
    let { assignedContactIds } = body || {};

    const vault = await Vault.findOne({ owner: uid });
    if (!vault) return NextResponse.json({ message: "Vault not found" }, { status: 404 });

    const validIds = new Set(vault.contacts.map((c) => c._id));
    const filtered = assignedContactIds
      .map((x) => String(x))
      .filter((x) => validIds.has(x));

    const updated = await VaultItem.findOneAndUpdate(
      { _id: id, owner: uid, vault: vault._id, deletedAt: { $exists: false } },
      { $set: { assignedContactIds: filtered } },
      { new: true }
    );
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ item: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

