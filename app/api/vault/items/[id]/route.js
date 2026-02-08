import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import VaultItem from "@/dataBase/VaultItem";
import File from "@/dataBase/File";


export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let uid;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      uid = decoded?.id;
    } catch (e) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log(uid)
    if (!uid) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params?.id;
    console.log(id)
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const item = await VaultItem.findOne({ _id: id, owner: uid, deletedAt: { $exists: false } });


    // go with me , Vault have => Vaultitem and they will have files hard to understand
    console.log(item)
    if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const files = await File.find({ _id: { $in: item.fileIds }, owner: uid })
      .select("bucket key size contentType etag originalName createdAt"); // we filter
// because in our schema item.fileIds is a object
    return NextResponse.json({ item, files }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

// Next js style
// just trying to be cool 
// you may use a post here 
export async function PATCH(request, { params }) {
  try {
    
    await connectToDatabase();
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let uid;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      uid = decoded?.id;
    } catch (e) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!uid) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params?.id;
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

     const body = await request.json();
   // just like asp.net
    const update = {};
    update.title = body.title;
    update.description = body.description;
    update.tags = body.tags;

    
    const updated = await VaultItem.findOneAndUpdate(
      { _id: id, owner: uid, deletedAt: { $exists: false } },
      { $set: update },
      { new: true }
    );
    if (!updated) return NextResponse.json({ message: "Failure" }, { status: 404 });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {

    // console.log(err)
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let uid;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      uid = decoded?.id;
    } catch (e) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!uid) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params?.id;
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const gone = await VaultItem.findOneAndUpdate(
      { _id: id, owner: uid, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!gone) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
