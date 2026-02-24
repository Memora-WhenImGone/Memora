import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/dataBase/User";
import crypto from "crypto";
import { sendEmail } from "@/utils/mail";

connectToDatabase();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};
    if (!email) {
      return NextResponse.json({ message: "Email is required for Password Reset" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "An email has been sent." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
  // Next js beauty
    const url = new URL("/reset-password", request.nextUrl.origin);
    url.searchParams.set("token", token);

  

    try {
      await sendEmail(
        user.email,
        "Reset your password",
        `Hi ${user.fullname},\n\nUse this link to reset your password: ${url.toString()}\n\nIf you didn't request this, ignore it.`
      );
    } catch (e) {
     console.log("e", e)
    }

    return NextResponse.json({ message: "If that account exists, email sent" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
