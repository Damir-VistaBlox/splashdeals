import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/server/lib/prisma";
import { DiscoveryTemplate, getDiscoveryMetadata } from "@/lib/routing/discovery";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    return await getDiscoveryMetadata((await params).categorySlug);
  } catch {
    notFound();
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  // Quick check: if category slug is completely unknown (not even in catLabels),
  // let the catch-all handle it via notFound
  const hasCategory = await prisma.facility.findFirst({
    where: { category: { equals: categorySlug, mode: "insensitive" } },
    select: { id: true },
  }).catch(() => null);

  // Known category labels that should render even without DB data
  const catLabels: Record<string, string> = {
    "akva-parkovi": "Akva Parkovi",
    "bazeni": "Bazeni",
    "wellness-i-spa": "Wellness i Spa",
  };

  if (!hasCategory && !catLabels[categorySlug.toLowerCase()]) {
    notFound();
  }

  return (
    <DiscoveryTemplate
      params={Promise.resolve({ categorySlug })}
    />
  );
}
