
import { NextRequest, NextResponse } from "next/server";

import User from "@/dataBase/User";
import bcryptjs from "bcryptjs";

async function POST(NextRequest) {

    const  reqBody = NextRequest.json();

    const {fullname, email, password} = reqBody;

    if(!email || !password){
        NextResponse.json({
            message: "Email or Password is missing"
        });
    }

    if(!fullname){
          NextResponse.json({
            message: "Please Enter a Name"
        });
    }


    const user = User.find({email: email});

    if(user){
          NextResponse.json({
            message: "User Already Exist"
        });
    }

        const salt = 3;
        const hashedPassword = await bcryptjs.hash(password, salt);
          
           const save = await User({
            fullname: fullname, 
            password: hashedPassword, 
            email: email
           }).save();

   

           NextResponse.json({
            status: 201,
            "message":"User Data Saved",
            user
           })
}
