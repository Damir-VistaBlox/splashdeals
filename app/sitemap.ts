import { MetadataRoute } from "next";
import { prisma } from "@/app/(server)/lib/prisma";
import { getAllSlugs } from "@/lib/routing/categories";
import {
  absoluteUrl,
  alternates,
  isRobotsIndexable,
  resolveSiteUrl,
  STATIC_PAGE_LASTMOD,
  STATIC_SITEMAP_ROUTES,
} from "@/lib/seo";
import { collectPhotoUrls, pickHeroPhotoUrl } from "@/app/(web)/facility/_data/seo-utils";

/**
 * Public sitemap — Package M policy (#674):
 * - Only known static, categories, ACTIVE facilities, ticket pages, indexable blog
 * - No free-form navigation hrefs, no query strings, no private routes
 * - English hreflang gated via SEO_ENABLE_EN_HREFLANG (default off)
 */
export const revalidate = 3600;

function entry(
  path: string,
  opts: {
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    images?: string[];
  },
): MetadataRoute.Sitemap[number] {
  const site = resolveSiteUrl();
  const url = path ? `${site}${path.startsWith("/") ? path : `/${path}`}` : site;
  return {
    url,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: alternates(path || "/") },
    ...(opts.images?.length ? { images: opts.images } : {}),
  };
}

function facilityImages(
  slug: string,
  media: {
    url: string;
    type?: string | null;
    isHero?: boolean | null;
    isCardBackground?: boolean | null;
  }[],
): string[] {
  const photos = collectPhotoUrls(media, 5).map((u) => absoluteUrl(u));
  if (photos.length > 0) return photos;

  const hero = pickHeroPhotoUrl(media);
  if (hero) return [absoluteUrl(hero)];

  // Crawlable absolute OG fallback (no empty image nodes)
  return [absoluteUrl(`/api/og/facility/${slug}`)];
}

function videoImages(
  media: {
    url: string;
    type?: string | null;
    thumbnailUrl?: string | null;
  }[],
): string[] {
  // Image sitemap only lists stills; video namespace would need content+thumbnail.
  // We only surface video *thumbnails* as images when both exist (richer media without empty thumbs).
  return media
    .filter((m) => m.type === "VIDEO" && m.thumbnailUrl)
    .map((m) => absoluteUrl(m.thumbnailUrl as string))
    .slice(0, 2);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = resolveSiteUrl();
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const push = (item: MetadataRoute.Sitemap[number]) => {
    if (seen.has(item.url)) return;
    seen.add(item.url);
    sitemapEntries.push(item);
  };

  // Freshest facility date used for home / categories when static lastmod is weak
  let newestFacilityAt: Date | null = null;

  // ── Facilities + tickets (ACTIVE only) ──────────────────────────────
  try {
    const facilities = await prisma.facility.findMany({
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        updatedAt: true,
        media: {
          select: {
            url: true,
            type: true,
            isHero: true,
            isCardBackground: true,
            thumbnailUrl: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
        ticketCategories: {
          where: { isActive: true },
          select: {
            updatedAt: true,
            types: {
              where: { isActive: true },
              select: {
                id: true,
                slug: true,
                updatedAt: true,
                imageUrl: true,
                prices: {
                  where: { isActive: true },
                  select: { id: true, updatedAt: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    for (const facility of facilities) {
      if (!newestFacilityAt || facility.updatedAt > newestFacilityAt) {
        newestFacilityAt = facility.updatedAt;
      }

      const images = [
        ...facilityImages(facility.slug, facility.media),
        ...videoImages(facility.media),
      ].slice(0, 5);

      push(
        entry(`/${facility.slug}`, {
          lastModified: facility.updatedAt,
          changeFrequency: "daily",
          priority: 0.95,
          images,
        }),
      );

      // Ticket index + products with at least one active price
      const sellableProducts = facility.ticketCategories.flatMap((cat) =>
        cat.types.filter((t) => t.prices.length > 0),
      );

      if (sellableProducts.length > 0) {
        const ticketIndexLastMod = sellableProducts.reduce((max, p) => {
          return p.updatedAt > max ? p.updatedAt : max;
        }, facility.updatedAt);

        push(
          entry(`/${facility.slug}/ulaznice`, {
            lastModified: ticketIndexLastMod,
            changeFrequency: "daily",
            priority: 0.85,
          }),
        );

        for (const product of sellableProducts) {
          const pathSeg = product.slug?.trim() || product.id;
          if (!pathSeg) continue;
          push(
            entry(`/${facility.slug}/ulaznice/${pathSeg}`, {
              lastModified: product.updatedAt,
              changeFrequency: "weekly",
              priority: 0.8,
              images: product.imageUrl ? [absoluteUrl(product.imageUrl)] : undefined,
            }),
          );
        }
      }
    }
  } catch (error) {
    console.error("Sitemap Error: Could not fetch facilities", error);
  }

  const homeLastMod = newestFacilityAt ?? STATIC_PAGE_LASTMOD["/how-it-works"];

  // ── Static core routes ──────────────────────────────────────────────
  for (const route of STATIC_SITEMAP_ROUTES) {
    const isHome = route === "";
    push(
      entry(route, {
        lastModified: isHome ? homeLastMod : (STATIC_PAGE_LASTMOD[route] ?? homeLastMod),
        changeFrequency: isHome ? "daily" : "monthly",
        priority: isHome ? 1.0 : 0.7,
      }),
    );
  }

  // ── Category discovery routes ───────────────────────────────────────
  for (const slug of getAllSlugs()) {
    push(
      entry(`/${slug}`, {
        lastModified: homeLastMod,
        changeFrequency: "weekly",
        priority: 0.9,
      }),
    );
  }

  // ── Blog index + published indexable posts ──────────────────────────
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        coverImage: true,
        featuredImage: true,
        robotsDirective: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    const indexablePosts = blogPosts.filter((p) => isRobotsIndexable(p.robotsDirective));

    const blogLastMod =
      indexablePosts[0]?.publishedAt || indexablePosts[0]?.updatedAt || homeLastMod;

    push(
      entry("/blog", {
        lastModified: blogLastMod,
        changeFrequency: "daily",
        priority: 0.8,
      }),
    );

    for (const post of indexablePosts) {
      const lastMod =
        post.publishedAt && post.updatedAt
          ? post.publishedAt > post.updatedAt
            ? post.publishedAt
            : post.updatedAt
          : (post.publishedAt ?? post.updatedAt);

      const cover = post.coverImage || post.featuredImage;
      push(
        entry(`/blog/${post.slug}`, {
          lastModified: lastMod,
          changeFrequency: "monthly",
          priority: 0.7,
          images: cover ? [absoluteUrl(cover)] : undefined,
        }),
      );
    }
  } catch (error) {
    console.error("Sitemap Error: Could not fetch blog posts", error);
    push(
      entry("/blog", {
        lastModified: homeLastMod,
        changeFrequency: "daily",
        priority: 0.8,
      }),
    );
  }

  // Hard guarantee: never emit apex non-www if somehow constructed
  return sitemapEntries.filter((e) => {
    try {
      const host = new URL(e.url).hostname;
      return host === new URL(site).hostname;
    } catch {
      return false;
    }
  });
}
