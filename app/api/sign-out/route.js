import { NextResponse } from "next/server";
import { checkRateLimit } from "@/utils/rateLimit";

export async function POST(request) {
  const rateLimited = await checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const response = NextResponse.json({ message: "Signed out" }, { status: 200 });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

