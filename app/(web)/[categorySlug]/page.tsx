import { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/server/lib/prisma";
import { FacilityShowcaseTemplate } from "@/app/(web)/_facility/page";
import { buildFacilityMetadata } from "@/app/(web)/_facility/_metadata";
import { DiscoveryTemplate, getDiscoveryMetadata } from "@/lib/routing/discovery";
import { resolveSlug, resolveFacilitySlug } from "@/lib/routing/resolve-slug";
import { isKnownCategory, slugToDbValue } from "@/lib/routing/categories";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;

  // Try as category first
  if (isKnownCategory(categorySlug.toLowerCase())) {
    return await getDiscoveryMetadata(categorySlug);
  }

  // Try as category via DB lookup
  const dbValue = slugToDbValue(categorySlug);
  const hasCategory = await prisma.facility.findFirst({
    where: { category: { equals: dbValue ?? categorySlug, mode: "insensitive" } },
    select: { id: true },
  });

  if (hasCategory) {
    return await getDiscoveryMetadata(categorySlug);
  }

  // Try as facility slug
  const facility = await resolveFacilitySlug(categorySlug);
  if (facility) {
    return await buildFacilityMetadata(categorySlug, facility.category);
  }

  notFound();
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  // Try as category first
  if (isKnownCategory(categorySlug.toLowerCase())) {
    return (
      <DiscoveryTemplate
        params={Promise.resolve({ categorySlug })}
      />
    );
  }

  // Try as category via DB lookup
  const dbValue = slugToDbValue(categorySlug);
  const hasCategory = await prisma.facility.findFirst({
    where: { category: { equals: dbValue ?? categorySlug, mode: "insensitive" } },
    select: { id: true },
  });

  if (hasCategory) {
    return (
      <DiscoveryTemplate
        params={Promise.resolve({ categorySlug })}
      />
    );
  }

  // Try as facility slug
  const facility = await resolveFacilitySlug(categorySlug);
  if (facility) {
    return (
      <FacilityShowcaseTemplate
        params={Promise.resolve({
          categorySlug: facility.category,
          facilitySlug: categorySlug,
        })}
      />
    );
  }

  notFound();
}
