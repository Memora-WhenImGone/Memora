import { NextResponse, NextRequest } from 'next/server'
 

export async function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: '/about/:path*',
}


// After the incident of middleware.ts, Next js is pushing using proxy 

// https://nextjs.org/docs/app/api-reference/file-conventions/proxy