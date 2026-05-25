import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("sh_session");

  // Protect /dashboard — redirect to login if no session
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If already logged in, redirect away from login/register
  if (
    session?.value &&
    (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
