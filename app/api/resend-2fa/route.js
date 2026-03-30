import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import crypto from "crypto";
import User from "@/dataBase/User";
import { sendEmail } from "@/utils/mail";

connectToDatabase();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || 
      !user.twoFactorExpires) 
      {
      return NextResponse.json({ message: "If that email is valid, a new code has been sent" }, { status: 200 });
    }

    const code = crypto.randomInt(100000, 999999).toString();  // it creaetd a 6 digit otp
    user.twoFactorCode = code;
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(
      user.email,
      "Your Memora sign-in code",
      `Your verification code is: ${code}\n\nThis code expires in 10 minutes. If you did not request this, please ignore this email. Thanks `
    );

    return NextResponse.json({ message: "New code sent to your email" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to resend code" }, { status: 500 });
  }
}
