import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const token = cookies.get("token")?.value;
  const pathname = nextUrl.pathname;

  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const protectedRoutes = ["/onboarding", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
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

