import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/(server)/lib/auth";

export const config = {
  matcher: ["/(account)/:path*"],
};

/**
 * 🌊 Auth Middleware — Protects customer account pages
 * - Unauthenticated users are redirected to the login page
 * - Non-CUSTOMER roles (admin, staff, owner) are redirected to the admin dashboard
 * - The login page itself (prijava) is excluded to prevent redirect loops
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself — prevents redirect loops
  if (pathname === "/prijava") {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const signInUrl = new URL("/prijava", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin/staff users should use the admin dashboard
  if (session.user.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
