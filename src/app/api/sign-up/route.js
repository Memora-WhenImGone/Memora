import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";

// This function will handle all post requests

// if deployed to vercel the function turns into a serverless function




export default async function POST(req) {



    try{
    const reqBody = await req.json();

// I like this way now extract things from body 

const { email, password, } = reqBody;

// we have not decided on signup form yet it should be something like that 


// lets have jwt and scrypt js for passwords 

// In future we may use Zod for validation for now I am using simple validation 


 if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }


    // same Idea but zod can do it better 


 if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }



  
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 409 }
      );
    }


// hashing the password 


    const hashedPassword = await bcrypt.hash(password, 12);


    // here we could save it in Db 


                           const user =     await User.create({
                                    email,
                                         password: hashedPassword,
                                    });




    

  return NextResponse.json(
      {
        message: "User created",
        user: { id: user._id, email: user.email },
      },
      { status: 201 }
    );
    } catch {
     return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
    }
   

    
}