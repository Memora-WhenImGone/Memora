import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/onboarding", "/dashboard"];
const authRoutes = ["/sign-in", "/sign-up"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string) {
  return authRoutes.includes(pathname);
}

async function verifyJWT(token: string) {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Please set a secret");
    }

    const secretKey = new TextEncoder().encode(secret); // to convert to bytes. 

    // I am not using node js Buffer.from(secret); because Next.js routes runs in Edge runtime 
    // it does not support node js native Buffer and some more libraries like 
    // ocr 

    // Our app is serverless 

    await jwtVerify(token, secretKey);

    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;
  const token = cookies.get("token")?.value;

  const protectedRoute = isProtectedRoute(pathname);
  const authRoute = isAuthRoute(pathname);

  let isValidToken = false;

  if (token) {
    isValidToken = await verifyJWT(token);
  }

  if (protectedRoute && !isValidToken) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));

    if (token) {
      response.cookies.delete("token");
    }

    return response;
  }

  if (authRoute && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/onboarding/:path*",
    "/dashboard/:path*",
  ],
};