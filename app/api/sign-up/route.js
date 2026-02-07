import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/dataBase/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectToDatabase();

    const reqBody = await request.json();

    // console.log("reqBody, ", reqBody)
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

    return NextResponse.json(
      {
        message: "User created",
        user: { id: user._id, fullname: user.fullname, email: user.email },
      },
      { status: 201 }
    );
  } catch (err) {


    // console.log(err)
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}