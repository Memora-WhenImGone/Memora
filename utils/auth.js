import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/dataBase/User";
connectToDatabase();
export async function authChecker() {
  const cookieJar = await cookies();
  const token = cookieJar.get("token")?.value;
  if (!token) {
    return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uid = decoded && decoded.id;
    if (!uid) {
      return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
 
    const user = await User.findById(uid);
    if (!user) {
      return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
    if (!user.verified) {
      return { ok: false, response: NextResponse.json({ message: "Email not verified" }, { status: 403 }) };
    }
    return { ok: true, uid, decoded };
  } catch {
    return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
}

