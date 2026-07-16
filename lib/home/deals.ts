import { cache } from "react";
import { prisma } from "@/app/(server)/lib/prisma";
import { isOpenOnDay } from "@/lib/facility/availability";
import { categoryBoost, homeDealScore, isLikelyEntryTicket } from "@/lib/home/deal-score";
import type { HomeDeal } from "@/lib/home/deals-types";

export type { HomeDeal } from "@/lib/home/deals-types";
export { homeDealScore } from "@/lib/home/deal-score";

function discountPercent(price: number, original: number | null): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

function shortPitch(
  ticketDesc: string | null,
  facilityDesc: string | null,
  city: string | null,
  pct: number,
  fallback: string,
): string {
  const base = (ticketDesc || facilityDesc || "").replace(/\s+/g, " ").trim();
  if (base.length >= 24) {
    const cut = base.slice(0, 110);
    const nicer = cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut;
    return nicer + (base.length > nicer.length ? "…" : "");
  }
  const bits = [city, pct > 0 ? `ušteda ${pct}%` : null].filter(Boolean);
  return bits.length ? bits.join(" · ") : fallback;
}

function absoluteSave(price: number, original: number | null): number {
  if (!original || original <= price) return 0;
  return Math.round(original - price);
}

/** Shared ticket loader — React cache de-dupes within a single request. */
export const loadActiveTicketRows = cache(async function loadActiveTicketRows() {
  const now = new Date();
  return prisma.ticketPrice.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ saleStart: null }, { saleStart: { lte: now } }] },
        { OR: [{ saleEnd: null }, { saleEnd: { gte: now } }] },
      ],
      ticketType: {
        isActive: true,
        category: {
          isActive: true,
          facility: { status: "ACTIVE" },
        },
      },
    },
    include: {
      ticketType: {
        include: {
          category: {
            include: {
              facility: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  category: true,
                  city: true,
                  description: true,
                  media: {
                    where: { type: "PHOTO" },
                    orderBy: [{ isHero: "desc" }, { order: "asc" }],
                    take: 1,
                  },
                  hours: { select: { dayOfWeek: true, isClosed: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    take: 120,
  });
});

function mapDeal(
  row: Awaited<ReturnType<typeof loadActiveTicketRows>>[number],
  fallbackPitch: string,
): HomeDeal | null {
  const facility = row.ticketType?.category?.facility;
  const ticketType = row.ticketType;
  if (!facility || !ticketType) return null;

  const title = ticketType.title || "Ulaznica";
  if (!isLikelyEntryTicket(title)) return null;

  const price = Number(row.price);
  const originalPrice = row.originalPrice ? Number(row.originalPrice) : null;
  const pct = discountPercent(price, originalPrice);
  const imageUrl = facility.media?.[0]?.url || ticketType.imageUrl || null;

  return {
    id: row.id,
    title,
    price,
    originalPrice,
    currency: "RSD",
    discountPercent: pct,
    absoluteSave: absoluteSave(price, originalPrice),
    pitch: shortPitch(
      ticketType.description,
      facility.description,
      facility.city,
      pct,
      fallbackPitch,
    ),
    imageUrl,
    validityType: ticketType.validityType || "FLEXIBLE_30_DAY",
    requiresIdentity: Boolean(ticketType.requiresIdentity),
    requiresPhoto: Boolean(ticketType.requiresPhoto),
    minPeople: ticketType.minPeople ?? 1,
    maxPeople: ticketType.maxPeople ?? null,
    facility: {
      id: facility.id,
      name: facility.name,
      slug: facility.slug,
      category: facility.category,
      city: facility.city,
      openToday: isOpenOnDay(facility.hours),
    },
  };
}

function uniqueByFacility(deals: HomeDeal[], limit: number): HomeDeal[] {
  const seen = new Set<string>();
  const out: HomeDeal[] = [];
  for (const d of deals) {
    if (seen.has(d.facility.id)) continue;
    seen.add(d.facility.id);
    out.push(d);
    if (out.length >= limit) break;
  }
  return out;
}

/** Featured inventory: media-required first, diversify facilities. */
export async function getHomeFeaturedDeals(fallbackPitch: string, limit = 6): Promise<HomeDeal[]> {
  const rows = await loadActiveTicketRows();
  const mapped = rows
    .map((r) => mapDeal(r, fallbackPitch))
    .filter((d): d is HomeDeal => d !== null);

  const withMedia = mapped
    .filter((d) => d.imageUrl)
    .sort((a, b) => homeDealScore(b) - homeDealScore(a));
  const withoutMedia = mapped
    .filter((d) => !d.imageUrl)
    .sort((a, b) => homeDealScore(b) - homeDealScore(a));

  const picked = uniqueByFacility(withMedia, limit);
  if (picked.length < limit) {
    for (const deal of withoutMedia) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.facility.id === deal.facility.id || p.id === deal.id)) continue;
      picked.push(deal);
    }
  }

  return picked;
}

/**
 * Biggest savings: absolute RSD save + aqua/entry weight.
 * Media-required for homepage display — empty array triggers empty state UI.
 */
export async function getHomeBiggestSavings(fallbackPitch: string, limit = 4): Promise<HomeDeal[]> {
  const rows = await loadActiveTicketRows();
  const ranked = rows
    .map((r) => mapDeal(r, fallbackPitch))
    .filter((d): d is HomeDeal => d !== null && d.absoluteSave > 0 && Boolean(d.imageUrl))
    .sort((a, b) => homeDealScore(b) - homeDealScore(a) || b.absoluteSave - a.absoluteSave);

  return uniqueByFacility(ranked, limit);
}

export async function getHomeGateProof(fallbackPitch: string): Promise<HomeDeal | null> {
  const savings = await getHomeBiggestSavings(fallbackPitch, 16);
  const adultish = savings.find(
    (d) =>
      d.originalPrice &&
      d.originalPrice > d.price &&
      /odrasl|adult|ulaz/i.test(d.title) &&
      categoryBoost(d.facility.category) >= 80,
  );
  if (adultish) return adultish;
  return savings.find((d) => d.originalPrice && d.originalPrice > d.price) || null;
}

export async function getHomeOpenToday(fallbackPitch: string, limit = 6): Promise<HomeDeal[]> {
  const featured = await getHomeFeaturedDeals(fallbackPitch, 24);
  const open = featured.filter((d) => d.facility.openToday && d.imageUrl);
  return uniqueByFacility(open, limit);
}

export async function getHomeMetrics(): Promise<{
  activeFacilities: number;
  activeOffers: number;
  avgDiscountPercent: number;
}> {
  const now = new Date();
  const [activeFacilities, offerRows] = await Promise.all([
    prisma.facility.count({ where: { status: "ACTIVE" } }),
    prisma.ticketPrice.findMany({
      where: {
        isActive: true,
        originalPrice: { not: null },
        AND: [
          { OR: [{ saleStart: null }, { saleStart: { lte: now } }] },
          { OR: [{ saleEnd: null }, { saleEnd: { gte: now } }] },
        ],
        ticketType: {
          isActive: true,
          category: { isActive: true, facility: { status: "ACTIVE" } },
        },
      },
      select: {
        price: true,
        originalPrice: true,
        ticketType: { select: { title: true } },
      },
      take: 100,
    }),
  ]);

  const discounts = offerRows
    .filter((r) => isLikelyEntryTicket(r.ticketType?.title || ""))
    .map((r) => discountPercent(Number(r.price), r.originalPrice ? Number(r.originalPrice) : null))
    .filter((n) => n > 0);

  const avgDiscountPercent =
    discounts.length > 0 ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length) : 0;

  return {
    activeFacilities,
    activeOffers: offerRows.length,
    avgDiscountPercent,
  };
}

export async function getHomeBlogPosts(limit = 3) {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    });
  } catch {
    return [];
  }
}
