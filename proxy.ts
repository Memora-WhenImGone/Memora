import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const token = cookies.get("token")?.value;
  const pathname = nextUrl.pathname;

  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const protectedRoutes = ["/onboarding", "/dashboard"];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );  // first time saw .some in next.js docs it is handy it return true if any one element is true .


// we will add more conditions in futrue like admin and what not
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  // we could do some cookies work here too i think
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
// Next.js will only run the proxy when a user hit these routes 