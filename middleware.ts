import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/(account)/:path*"],
};

/**
 * 🌊 Auth Middleware — Protects customer account pages
 * Lightweight edge check: verifies session cookie presence.
 * Full session validation happens in the page component.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself — prevents redirect loops
  if (pathname === "/prijava") {
    return NextResponse.next();
  }

  // Lightweight check: look for the Better Auth session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionCookie) {
    const signInUrl = new URL("/prijava", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
