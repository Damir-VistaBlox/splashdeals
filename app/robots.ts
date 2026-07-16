import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/routing/categories";
import { resolveSiteUrl } from "@/lib/seo";

/**
 * 🌊 Robots Configuration (Next.js Best Practice)
 * This dynamic configuration ensures that:
 * 1. Admin portals are strictly hidden from crawlers.
 * 2. All public discovery and ticket routes are prioritized.
 * 3. Internationalized routes are correctly handled.
 * 4. The sitemap is explicitly declared for GEO (Generative Engine Optimization).
 *
 * Source of truth: this file (app/robots.ts). Do not add public/robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  const site = resolveSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // NOTE: Internationalized /en and /rs prefixes are NOT disallowed here.
          // Google has 23K+ old URLs under /rs/* from prior crawling.
          // Blocking them prevents Google from following the 301 redirect chain
          // to the prefix-free canonical URLs (e.g., /rs/facilities/petroland → /petroland).
          // The redirects handle consolidation; robots.txt must allow the crawl.

          // 🛡️ Hermetically seal administrative and sensitive paths
          "/admin",
          "/*/admin",
          "/api/",
          "/*/api/",

          // 🛠️ Block internal Next.js paths and data manifests
          "/_next/",
          "/middleware-manifest.json",

          // 🔒 Block private user paths
          "/cart",
          "/*/cart",
          "/checkout",
          "/*/checkout",
          "/account",
          "/*/account",
          "/prijava",
          "/*/prijava",

          // 💳 Block order confirmation pages
          "/success",
          "/*/success",

          // 🛡️ Block Cloudflare-obfuscated email recovery pages
          "/cdn-cgi/",
          "/cdn-cgi/*",
        ],
      },
      {
        // 🤖 Bingbot: Dedicated rule to optimize crawl budget and indexing
        userAgent: "bingbot",
        allow: "/",
        disallow: [
          "/admin",
          "/*/admin",
          "/api/",
          "/*/api/",
          "/_next/",
          "/middleware-manifest.json",
          "/cart",
          "/*/cart",
          "/checkout",
          "/*/checkout",
          "/account",
          "/*/account",
          "/prijava",
          "/*/prijava",
          "/success",
          "/*/success",
          "/cdn-cgi/",
          "/cdn-cgi/*",
        ],
      },
      {
        // 🤖 Support Generative Search (GEO)
        // Allow leading AI bots to index public deals for recommendations.
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"],
        allow: ["/", ...getAllSlugs().map((s) => `/${s}/`), "/how-it-works"],
        disallow: [
          "/admin",
          "/api",
          "/checkout",
          "/success",
          "/cart",
          "/account",
          "/prijava",
          "/cdn-cgi/",
          "/cdn-cgi/*",
        ],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
