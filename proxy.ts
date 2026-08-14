import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAccountProtectedPath } from "@/lib/auth/account-paths";

/**
 * Buyer account auth proxy.
 *
 * IMPORTANT: Next.js route groups like `(account)` are NOT part of the URL.
 * Matcher must use real paths: /moje-karte, /omiljeni, /nalog, …
 */
export const config = {
  matcher: ["/((?!api|_next|admin).*)"],
};

export async function proxy(request: NextRequest) {
  const { pathname, hostname, protocol } = request.nextUrl;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = request.headers.get("host");
  const requestHost = (forwardedHost || hostHeader || hostname).split(":")[0];
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const requestProtocol = forwardedProto ? `${forwardedProto}:` : protocol;

  if (
    requestHost === "splashdeals.rs" ||
    (requestHost === "www.splashdeals.rs" && requestProtocol !== "https:")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "www.splashdeals.rs";
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  // Defense: only enforce on known protected account paths
  if (!isAccountProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("splashdeals.session")?.value ??
    request.cookies.get("__Secure-splashdeals.session")?.value ??
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionCookie) {
    const signInUrl = new URL("/prijava", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
