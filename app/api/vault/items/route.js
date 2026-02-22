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
    if (!auth.ok) return auth.response;
    const uid = auth.uid;


    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim(); 
    const type = searchParams.get("type")?.trim(); 

    const vault = await Vault.findOne({ owner: uid });
    if (!vault) return NextResponse.json({ items: [] }, { status: 200 });

   
    const filter = {
      owner: uid,
      vault: vault._id,
      deletedAt: { $exists: false }, 
    };

    if (type && allowedTypes.includes(type)) {
      filter.type = type;
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
          score: { $meta: "textScore" },
        })
        .sort({ score: { $meta: "textScore" }, updatedAt: -1 });
    } else {
      itemsQuery = itemsQuery
        .select("type title description tags updatedAt createdAt fileIds")
        .sort({ updatedAt: -1 });
    }

    const items = await itemsQuery;

    const data = items.map((it) => ({
      id: it._id,
      type: it.type,
      title: it.title,
      description: it.description,
      tags: it.tags,
      fileCount: Array.isArray(it.fileIds) ? it.fileIds.length : 0,
      updatedAt: it.updatedAt,
      createdAt: it.createdAt,
    }));

    return NextResponse.json({ items: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

    const body = await request.json();
    const { type, title, description = "", tags = [] } = body || {};
    if (!type || !allowedTypes.includes(type) || !title) {
      return NextResponse.json({ message: "Invalid" }, { status: 400 });
    }

    const vault = await Vault.findOne({ owner: uid });
    if (!vault) return NextResponse.json({ message: "Vault not found" }, { status: 404 });

    const item = await VaultItem.create({
      owner: uid,
      vault: vault._id,
      type,
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
