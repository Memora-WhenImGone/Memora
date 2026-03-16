import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import VaultItem from "@/dataBase/VaultItem";
import File from "@/dataBase/File";
import { authChecker } from "@/utils/auth";

connectToDatabase();

export async function GET(request, { params }) {
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

    const item = await VaultItem.findOne({ _id: id, owner: uid, deletedAt: { $exists: false } });

    if (!item) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const files = await File.find({ _id: { $in: item.fileIds }, owner: uid })
      .select("bucket key size contentType etag originalName createdAt");

    return NextResponse.json({ item, files }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

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

    const update = {};
    update.title = body.title;
    update.description = body.description;
    update.tags = body.tags;

    const updated = await VaultItem.findOneAndUpdate(
      { _id: id, owner: uid, deletedAt: { $exists: false } },
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Failure" }, { status: 404 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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

    const gone = await VaultItem.findOneAndUpdate(
      { _id: id, owner: uid, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );

    if (!gone) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
