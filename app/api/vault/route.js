import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import { authChecker } from "@/utils/auth";
connectToDatabase();

export async function GET() {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

    const vault = await Vault.findOne({ owner: uid });
    return NextResponse.json({ vault }, { status: 200 });
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
    const { name, contacts, trigger } = body || {};
    if (!name || !trigger) return NextResponse.json({ message: "Invalid" }, { status: 400 });

    const list = Array.isArray(contacts) ? contacts : [];
    const update = {
      owner: uid,
      name,
      contacts: list.map((c) => ({ name: c.name, email: c.email, relationship: c.relationship })),
      trigger: { inactivityDays: trigger.inactivityDays, warningDays: trigger.warningDays },
    };

    const vault = await Vault.findOneAndUpdate(
      { owner: uid },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    return NextResponse.json({ vault }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const auth = await authChecker();
    if (!auth.ok) return auth.response;
    const uid = auth.uid;

    const gone = await Vault.findOneAndDelete({ owner: uid });
    if (!gone) return NextResponse.json({ message: "Vault not found" }, { status: 404 });

    return NextResponse.json({ message: "Vault deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
