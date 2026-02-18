import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
    return { ok: true, uid, decoded };
  } catch {
    return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
}

