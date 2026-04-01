import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import VaultItem from "@/dataBase/VaultItem";
import { authChecker } from "@/utils/auth";

connectToDatabase();

const allowedTypes = ["document", "credential", "note"];

export async function GET(request) {
  try {
   
    const auth = await authChecker();

    if (!auth.ok) {
      return auth.response;
    }

    const uid = auth.uid;

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    let q = searchParams.get("q");
    if (q) {
      q = q.trim();
    }

    let type = searchParams.get("type");
    if (type) {
      type = type.trim();
    }

    let contactId = searchParams.get("contactId");
    if (contactId) {
      contactId = contactId.trim();
    }

    const vault = await Vault.findOne({ owner: uid });

    if (!vault) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const filter = {
      owner: uid,
      vault: vault._id,
      deletedAt: { $exists: false },
    };

    if (type && allowedTypes.includes(type)) {
      filter.type = type;
    }

    if (contactId) {
      const contacts = vault.contacts || [];
      let validContact = false;

      for (let i = 0; i < contacts.length; i++) {
        if (String(contacts[i]._id) === String(contactId)) {
          validContact = true;
          break;
        }
      }

      if (!validContact) {
        return NextResponse.json({ items: [] }, { status: 200 });
      }

      filter.assignedTo = contactId;
    }

    if (q) {
      filter.$text = { $search: q };
    }

    let itemsQuery = VaultItem.find(filter);

    if (q) {
      itemsQuery = itemsQuery
        .select({
          type: 1,
          title: 1,
          description: 1,
          tags: 1,
          updatedAt: 1,
          createdAt: 1,
          fileIds: 1,
          assignedTo: 1,
          score: { $meta: "textScore" },
        })
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 });
    } else {
      itemsQuery = itemsQuery
        .select("type title description tags updatedAt createdAt fileIds assignedTo")
        .sort({ updatedAt: -1 });
    }

    const items = await itemsQuery;

    const data = [];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];

      let assignedContactIds = [];
      if (Array.isArray(it.assignedTo)) {
        assignedContactIds = it.assignedTo.map(String);
      }

      let fileCount = 0;
      if (Array.isArray(it.fileIds)) {
        fileCount = it.fileIds.length;
      }

      data.push({
        id: it._id,
        type: it.type,
        title: it.title,
        description: it.description,
        tags: it.tags,
        assignedTo: it.assignedTo,
        assignedContactIds: assignedContactIds,
        fileCount: fileCount,
        updatedAt: it.updatedAt,
        createdAt: it.createdAt,
      });
    }

    return NextResponse.json({ items: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await authChecker();

    if (!auth.ok) {
      return auth.response;
    }

    const uid = auth.uid;
    const body = await request.json();

    const type = body.type;
    const title = body.title;

    let description = body.description;
    if (!description) {
      description = "";
    }

    let tags = body.tags;
    if (!tags) {
      tags = [];
    }

    if (!type || !allowedTypes.includes(type) || !title) {
      return NextResponse.json({ message: "Invalid" }, { status: 400 });
    }

    const vault = await Vault.findOne({ owner: uid });

    if (!vault) {
      return NextResponse.json({ message: "Vault not found" }, { status: 404 });
    }

    let cleanTags = [];
    if (Array.isArray(tags)) {
      cleanTags = tags;
    }

    const item = await VaultItem.create({
      owner: uid,
      vault: vault._id,
      type,
      title,
      description,
      tags: cleanTags,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
