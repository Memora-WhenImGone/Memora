
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/dataBase/User";


async function POST(NextRequest) {

    const  reqBody = NextRequest.json();

    const {email, password} = reqBody;

    if(!email || !password){
        NextResponse.json({
            message: "Email or Password is missing"
        });
    }


    const user = User.find({email: email});

    if(!user){
          NextResponse.json({
            message: "User Does Not exit"
        });
    }

     const isMatch = await bcryptjs.compare(password, user.password); // because we hashed password with bcrypt js 
        if(!isMatch){
            return NextResponse.json({error: "Password does not match"}, {status: 400})
        }

        const tokendata = {
            id: user.id,
            username: user.fullname,
            email: user.email,
        }
        const createtoken = await jwt.sign(tokendata, process.env.JWT_SECRET, {expiresIn: "7d"} ); // for session managment 
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            token: createtoken,
        });
    
}