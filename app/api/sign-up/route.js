import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/dataBase/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/utils/mail";
connectToDatabase();

export async function POST(request) {
  try {

    const reqBody = await request.json();
    const { fullname, email, password } = reqBody || {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email or password is missing" },
        { status: 400 }
      );
    }

    if (!fullname) {
      return NextResponse.json(
        { message: "Please enter your full name" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, email, password: hashedPassword });

  
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    const url = new URL("/verify-email", request.nextUrl.origin);
    url.searchParams.set("token", token);

    try {
      await sendEmail(
        email,
        "Verify your email",
        `Hi ${fullname},\n\nPlease verify your email by clicking this link: ${url.toString()}\n\nIf you didn't sign up, ignore this.`
      );
    } catch (e) {
console.log("e", e)
    }

    return NextResponse.json(
      {
        message: "User created. Please verify your email.",
        user: { id: user._id, fullname: user.fullname, email: user.email },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to create user" },

      { status: 500 }
    );
  }
}
