import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";

export async function GET() {
  try {
    await connectToDatabase();  // Why I am doing this. Thats how Hitesh Chaudhry taught in his Next.js course, 
    // Theory : if yiu wiull try Vault.find without connecting to data base next js complains 

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json(
     
      { message: "Unauthorized" }, 
      { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    console.log(userId)
    const vault = await Vault.findOne({ owner:userId });
    console.log("vault" , vault)
    return NextResponse.json({ vault }, 
      { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
    
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const userId = decoded.id;
//  const userVault = await Vault.findOne({ userId });

//  console.log(userVault)


    const body = await request.json();

    const { name, contacts, trigger } = body || {};

    if (!name || !trigger) return NextResponse.json({ message: "Invalid" }, { status: 400 });

    const contactsArray = Array.isArray(contacts) ? contacts : [];

    const update = {
      owner: userId,
      name,
      contacts: contactsArray.map((c) => ({ name: c.name, email: c.email, relationship: c.relationship })),
      trigger: { inactivityDays: trigger.inactivityDays, warningDays: trigger.warningDays },
    };
    const vault = await Vault.findOneAndUpdate(
      { owner:userId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );


    console.log("vault", vault)
    
    return NextResponse.json({ vault }, { status: 200 });
  } catch (error) {
    // console.log(error.message)
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
