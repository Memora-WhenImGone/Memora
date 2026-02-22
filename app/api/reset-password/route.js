import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/dataBase/User";
import bcrypt from "bcryptjs";

connectToDatabase();

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const tokenFromQuery = url.searchParams.get("token");
    const body = await request.json();
    const token = body.token || tokenFromQuery;
    const { password } = body || {};

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ message: "Password too short" }, { status: 400 });
    }

    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    if (!user.passwordResetExpires) {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

