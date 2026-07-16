/**
 * Shared SEO helpers — site origin, hreflang, robots indexability, path policy.
 * Single source of truth for public absolute URLs (forced www for splashdeals.rs).
 */

const DEFAULT_SITE_URL = "https://www.splashdeals.rs";

/**
 * English hreflang is gated until /en/* routes are production-ready.
 * Set SEO_ENABLE_EN_HREFLANG=true only after EN pages return 200 + indexable.
 */
export function isEnglishHreflangEnabled(): boolean {
  return process.env.SEO_ENABLE_EN_HREFLANG === "true";
}

/**
 * Canonical public site origin (no trailing slash).
 * Forces www for splashdeals.rs apex; honors NEXT_PUBLIC_SITE_URL / SITE_URL otherwise.
 */
export function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || DEFAULT_SITE_URL;

  try {
    const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
    const u = new URL(withProtocol);
    if (u.hostname === "splashdeals.rs") {
      u.hostname = "www.splashdeals.rs";
    }
    u.hash = "";
    u.search = "";
    u.pathname = "";
    return u.origin.replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Lazy getter — prefer over a module-level const so tests can override env. */
export function getSiteUrl(): string {
  return resolveSiteUrl();
}

export function absoluteUrl(pathOrUrl: string, siteUrl = resolveSiteUrl()): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith("//")) return `https:${pathOrUrl}`;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${path}`;
}

/**
 * Normalize a path for sitemap inclusion.
 * Returns null when the path is blocked, empty, or carries a query string.
 * Trailing slashes (except bare home) are stripped; home is always "".
 */
export function normalizeSitemapPath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "#" || trimmed.startsWith("#")) return null;
  if (trimmed.includes("?") || trimmed.includes("#")) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      if (u.search || u.hash) return null;
      return normalizeSitemapPath(u.pathname);
    } catch {
      return null;
    }
  }

  let path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path === "/") return "";

  if (isBlockedSitemapPath(path)) return null;
  return path;
}

const BLOCKED_EXACT = new Set([
  "/cart",
  "/checkout",
  "/account",
  "/prijava",
  "/success",
  "/search",
  "/login",
  "/register",
  "/api",
  "/admin",
]);

const BLOCKED_PREFIXES = [
  "/admin/",
  "/api/",
  "/_next/",
  "/cdn-cgi/",
  "/cart/",
  "/checkout/",
  "/account/",
  "/prijava/",
  "/success/",
  "/search/",
  "/@modal",
];

export function isBlockedSitemapPath(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (BLOCKED_EXACT.has(p)) return true;
  return BLOCKED_PREFIXES.some((prefix) => p.startsWith(prefix));
}

/** True when robotsDirective does not contain noindex. Empty/null ⇒ indexable. */
export function isRobotsIndexable(directive?: string | null): boolean {
  if (!directive) return true;
  return !/\bnoindex\b/i.test(directive);
}

/**
 * Build hreflang alternates for a given path.
 * - Serbian (default): bare path
 * - x-default: Serbian
 * - English: only when SEO_ENABLE_EN_HREFLANG=true
 */
export function alternates(path: string): Record<string, string> {
  const site = resolveSiteUrl();
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  const sr = clean ? `${site}/${clean}` : site;

  const languages: Record<string, string> = {
    sr,
    "x-default": sr,
  };

  if (isEnglishHreflangEnabled()) {
    languages.en = clean ? `${site}/en/${clean}` : `${site}/en`;
  }

  return languages;
}

export function pageMetadata(path: string) {
  const site = resolveSiteUrl();
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  return {
    alternates: {
      canonical: clean ? `${site}/${clean}` : site,
      languages: alternates(path),
    },
  };
}

/** Known static legal/help pages with honest lastmod (not “now” on every rebuild). */
export const STATIC_PAGE_LASTMOD: Record<string, Date> = {
  "/how-it-works": new Date("2026-03-01T00:00:00.000Z"),
  "/terms": new Date("2026-01-15T00:00:00.000Z"),
  "/privacy": new Date("2026-01-15T00:00:00.000Z"),
  "/support": new Date("2026-03-01T00:00:00.000Z"),
  "/cookies": new Date("2026-01-15T00:00:00.000Z"),
};

export const STATIC_SITEMAP_ROUTES = [
  "",
  "/how-it-works",
  "/terms",
  "/privacy",
  "/support",
  "/cookies",
] as const;
