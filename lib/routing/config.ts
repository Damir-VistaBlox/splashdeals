/**
 * 🗺️ Splashdeals Routing Registry
 * Centralized declarative routing for the Edge Proxy.
 */

export interface RedirectRule {
  pattern: RegExp;
  destination: (match: RegExpMatchArray) => string;
  permanent: boolean;
  type: "redirect" | "rewrite";
}

export const ROUTING_CONFIG = {
  // Legacy paths that need to be "killed" or moved
  LEGACY_REDIRECTS: [
    {
      // /explore -> /facilities
      pattern: /\/explore/,
      destination: () => "/",
      permanent: true,
      type: "redirect",
    },
    {
      // /facility/[slug] -> /facilities/all/[slug]
      pattern: /\/facility\/([^/]+)/,
      destination: (match: RegExpMatchArray) => `/facilities/all/${match[1]}`,
      permanent: true,
      type: "redirect",
    },
  ] as RedirectRule[],

  // SEO Ticket Migration: Single-hop via internal rewrite
  TICKET_MIGRATION: {
    pattern: /^(?:\/[a-z]{2})?\/ticket\/(.+)$/i,
    // We rewrite internally to the consolidated API route
    internalPath: (id: string) => `/api/seo/redirect-ticket?id=${id}`,
  },

  // Admin protection & exclusion
  ADMIN_PREFIXES: ["/admin"],

  // Public routes allowed without locale
  PUBLIC_ASSETS: ["_next", "favicon.ico", "sitemap.xml", "robots.txt", "api/auth", "api/webhooks"],
};
