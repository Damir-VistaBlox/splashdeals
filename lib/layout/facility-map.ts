import { cache } from "react";
import { prisma } from "@/app/(server)/lib/prisma";

export type FacilityMap = Record<string, { name: string; category: string }>;

/**
 * Shared active-facility breadcrumb map for buyer-facing shells.
 * Cached per request/render cycle to avoid repeating the same query in
 * both `(web)` and `(account)` layouts.
 */
export const getFacilityMap = cache(async (): Promise<FacilityMap> => {
  const facilities = await prisma.facility.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, name: true, category: true },
  });

  return Object.fromEntries(
    facilities.map((f) => [f.slug, { name: f.name, category: f.category }]),
  );
});
