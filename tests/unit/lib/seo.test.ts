import { afterEach, describe, expect, it } from "vitest";
import {
  absoluteUrl,
  alternates,
  buildBreadcrumbSchema,
  buildStaticPageMetadata,
  canonicalUrl,
  isBlockedSitemapPath,
  isEnglishHreflangEnabled,
  isRobotsIndexable,
  normalizeSitemapPath,
  publicRobots,
  resolveSiteUrl,
} from "@/lib/seo";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.SEO_ENABLE_EN_HREFLANG;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.SITE_URL;
});

describe("lib/seo site URL", () => {
  it("defaults to www splashdeals", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.SITE_URL;
    expect(resolveSiteUrl()).toBe("https://www.splashdeals.rs");
  });

  it("forces www for apex splashdeals.rs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://splashdeals.rs";
    expect(resolveSiteUrl()).toBe("https://www.splashdeals.rs");
  });

  it("strips trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.splashdeals.rs/";
    expect(resolveSiteUrl()).toBe("https://www.splashdeals.rs");
  });

  it("builds absolute urls", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.splashdeals.rs";
    expect(absoluteUrl("/petroland")).toBe("https://www.splashdeals.rs/petroland");
    expect(absoluteUrl("https://cdn.example/x.webp")).toBe("https://cdn.example/x.webp");
  });

  it("normalizes canonical urls", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.splashdeals.rs";
    expect(canonicalUrl("/petroland/")).toBe("https://www.splashdeals.rs/petroland");
    expect(canonicalUrl("/")).toBe("https://www.splashdeals.rs");
  });
});

describe("lib/seo hreflang", () => {
  it("omits en when gated off (default)", () => {
    delete process.env.SEO_ENABLE_EN_HREFLANG;
    expect(isEnglishHreflangEnabled()).toBe(false);
    const a = alternates("/petroland");
    expect(a.sr).toContain("/petroland");
    expect(a["x-default"]).toContain("/petroland");
    expect(a.en).toBeUndefined();
  });

  it("includes en when enabled", () => {
    process.env.SEO_ENABLE_EN_HREFLANG = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.splashdeals.rs";
    const a = alternates("/petroland");
    expect(a.en).toBe("https://www.splashdeals.rs/en/petroland");
  });
});

describe("lib/seo sitemap path policy", () => {
  it("blocks private routes", () => {
    expect(isBlockedSitemapPath("/cart")).toBe(true);
    expect(isBlockedSitemapPath("/admin")).toBe(true);
    expect(isBlockedSitemapPath("/api/foo")).toBe(true);
    expect(isBlockedSitemapPath("/prijava")).toBe(true);
    expect(isBlockedSitemapPath("/petroland")).toBe(false);
    expect(isBlockedSitemapPath("/petroland/ulaznice")).toBe(false);
  });

  it("normalizes paths and rejects query/hash", () => {
    expect(normalizeSitemapPath("/petroland/")).toBe("/petroland");
    expect(normalizeSitemapPath("/")).toBe("");
    expect(normalizeSitemapPath("/blog?tag=x")).toBeNull();
    expect(normalizeSitemapPath("/cart")).toBeNull();
    expect(normalizeSitemapPath("#")).toBeNull();
  });

  it("robotsDirective noindex detection", () => {
    expect(isRobotsIndexable(null)).toBe(true);
    expect(isRobotsIndexable("index, follow")).toBe(true);
    expect(isRobotsIndexable("noindex, nofollow")).toBe(false);
    expect(isRobotsIndexable("NOINDEX")).toBe(false);
  });
});

describe("lib/seo shared metadata helpers", () => {
  it("builds public robots directives with rich previews", () => {
    expect(publicRobots()).toMatchObject({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    });
  });

  it("builds static page metadata with canonical and og url", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.splashdeals.rs";
    const metadata = buildStaticPageMetadata({
      path: "/support",
      title: "Podrška",
      description: "Opis podrške",
      keywords: ["podrška"],
    });

    expect(metadata.alternates?.canonical).toBe("https://www.splashdeals.rs/support");
    expect(metadata.openGraph?.url).toBe("https://www.splashdeals.rs/support");
    expect(metadata.twitter?.images).toEqual(["https://www.splashdeals.rs/og-image.png"]);
    expect(metadata.keywords).toEqual(["podrška"]);
  });

  it("builds breadcrumb schema with canonical item urls", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.splashdeals.rs";
    const schema = buildBreadcrumbSchema(
      [
        { name: "Početna", path: "/" },
        { name: "Podrška", path: "/support" },
      ],
      "/support",
    );

    expect(schema["@id"]).toBe("https://www.splashdeals.rs/support#breadcrumb");
    expect(schema.itemListElement[0]?.item).toBe("https://www.splashdeals.rs");
    expect(schema.itemListElement[1]?.item).toBe("https://www.splashdeals.rs/support");
  });
});
