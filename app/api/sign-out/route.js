import { NextResponse } from "next/server";

export async function POST(request) {


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

