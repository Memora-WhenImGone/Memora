import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import User from "@/dataBase/User";
import { checkRateLimit, sensitiveLimiter } from "@/utils/rateLimit";

connectToDatabase();

export async function POST(request) {
  try {
    const rateLimited = await checkRateLimit(request, sensitiveLimiter);
    if (rateLimited) return rateLimited;

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    if (!user.twoFactorCode || !user.twoFactorExpires) {
      return NextResponse.json({ message: "No verification code requested" }, { status: 400 });
    }

    if (user.twoFactorExpires < new Date()) {
      user.twoFactorCode = null;
      user.twoFactorExpires = null;
      await user.save();
      return NextResponse.json({ message: "Code expired. Please sign in again." }, { status: 400 });
    }

    if (user.twoFactorCode !== code.trim()) {
      return NextResponse.json({ message: "Invalid code" }, { status: 401 });
    }


// Cleared the token
    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    await user.save();

    // Issue JWT same logic as the original sign-in

    const tokenData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "2d" });

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: { id: user._id, fullname: user.fullname, email: user.email },
      },
      { status: 200 }
    );


    // we shifted token handleing here.
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}
