import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import { authChecker } from "@/utils/auth";

connectToDatabase();

export async function PATCH(request, { params }) {
  try {
  
    const auth = await authChecker();

    if (!auth.ok) {
      return auth.response;
    }

    const uid = auth.uid;
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();

    let assignedTo = [];

    if (Array.isArray(body.assignedTo)) {
      assignedTo = body.assignedTo;
    } else if (Array.isArray(body.assignedContactIds)) {
      assignedTo = body.assignedContactIds;
    }

    const vault = await Vault.findOne({ owner: uid });

    if (!vault) {
      return NextResponse.json({ message: "Vault not found" }, { status: 404 });
    }

    const validIds = [];
    for (let i = 0; i < vault.contacts.length; i++) {
      validIds.push(String(vault.contacts[i]._id));
    }

    const filtered = [];
    for (let i = 0; i < assignedTo.length; i++) {
      const cid = String(assignedTo[i]);
      if (validIds.includes(cid)) {
        filtered.push(cid);
      }
    }

    const updated = await VaultItem.findOneAndUpdate(
      {
        _id: id,
        owner: uid,
        vault: vault._id,
        deletedAt: { $exists: false },
      },
      { $set: { assignedTo: filtered } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update sharing" }, { status: 500 });
  }
}
