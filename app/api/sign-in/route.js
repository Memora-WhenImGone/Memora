import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "@/dataBase/User";
import { sendEmail } from "@/utils/mail";
import { checkRateLimit, sensitiveLimiter } from "@/utils/rateLimit";

connectToDatabase();

export async function POST(request) {
  try {
    const rateLimited = await checkRateLimit(request, sensitiveLimiter);
    if (rateLimited) return rateLimited;

    const reqBody = await request.json();
    const email = reqBody.email;
    const password = reqBody.password;

    if (!email || !password) {
      return NextResponse.json({ message: "Email or password is missing" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.verified) {
      return NextResponse.json({ message: "Please verify your email before sign in" }, { status: 403 });
    }


    const code = crypto.randomInt(100000, 999999).toString();
    user.twoFactorCode = code;
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutev expiry
    await user.save();

    await sendEmail(
      user.email,
      "Your Memora sign-in code",
      `Your verification code is: ${code}\n\nThis code expires in 10 minutes. 
      If you did not request this, please ignore this email.`
    );

    return NextResponse.json(
      {
        message: "Verification code sent to your email",
        requiresTwoFactor: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
