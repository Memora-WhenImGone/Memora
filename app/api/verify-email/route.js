import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/dataBase/User";

connectToDatabase();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) { 
      //  there is no expiry saved         // the saved expiry time is before now
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    user.verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return NextResponse.json({ message: "Email verified" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

