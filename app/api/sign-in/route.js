import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/dataBase/User";

export async function POST(request) {
  try {
    await connectToDatabase();

    const reqBody = await request.json();
    const { email, password } = reqBody || {};

    if (!email || !password) {
      // console.log(email, password)
      return NextResponse.json(
        { message: "Email or password is missing" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    };
    const token = jwt.sign(
      tokenData,
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: { id: user._id, fullname: user.fullname, email: user.email },
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });
    return response;
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
