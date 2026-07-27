import { Metadata } from "next";
import { prisma } from "@/app/(server)/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { SITE_URL } from "@/app/(web)/facility/_data/schemas";
import { TicketVariantSelector } from "@/app/(web)/ticketing/_components/TicketVariantSelector";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}

async function loadProduct(categorySlug: string, productSlug: string) {
  const facility = await prisma.facility.findUnique({
    where: { slug: categorySlug, status: "ACTIVE" },
    select: { id: true, name: true, slug: true, category: true, city: true },
  });
  if (!facility) return null;

  const categories = await prisma.ticketCategory.findMany({
    where: { facilityId: facility.id, isActive: true },
    include: {
      types: {
        where: { isActive: true },
        include: {
          prices: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  for (const cat of categories) {
    const prod = cat.types.find((t) => t.slug === productSlug || t.id === productSlug);
    if (prod) {
      return { facility, product: prod, category: cat };
    }
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const loaded = await loadProduct(categorySlug, productSlug);
  if (!loaded) notFound();

  const { facility, product } = loaded;
  const minPrice =
    product.prices.length > 0 ? Math.min(...product.prices.map((p) => Number(p.price))) : null;
  const title = `${product.title} — ${facility.name}`;
  const description = [
    product.description?.slice(0, 120) || `Ulaznica ${product.title} za ${facility.name}`,
    minPrice != null ? `Već od ${minPrice} RSD.` : null,
    "Kupite digitalno na Splashdeals.",
  ]
    .filter(Boolean)
    .join(" ");
  const pathSeg = product.slug || product.id;
  const canonical = `${SITE_URL}/${facility.slug}/ulaznice/${pathSeg}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Splashdeals",
      locale: "sr_RS",
      type: "website",
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: product.title }]
        : [`${SITE_URL}/api/og/facility/${facility.slug}`],
    },
  };
}

/**
 * 🎫 Ticket Detail Page
 * Route: /[facilitySlug]/ulaznice/[productSlug]
 *
 * Variants are now interactive — users pick a price variant, set quantity,
 * and add directly to cart without leaving the page.
 */
export default async function TicketProductDetailPage({ params }: PageProps) {
  const { categorySlug, productSlug } = await params;
  const dict = await getDictionary();
  const t = (dict.ticketing || {}) as Record<string, string>;

  const loaded = await loadProduct(categorySlug, productSlug);
  if (!loaded) notFound();

  const { facility, product, category } = loaded;
  const priceFormat = new Intl.NumberFormat("sr-RS");

  // Map product shape to TicketVariantSelector's expected props
  const selectorProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    imageUrl: product.imageUrl,
    isSeasonPass: product.isSeasonPass,
    minPeople: product.minPeople,
    maxPeople: product.maxPeople,
    requiresIdentity: product.requiresIdentity,
    requiresPhoto: product.requiresPhoto,
    validityType: String(product.validityType),
    prices: product.prices.map((p) => ({
      id: p.id,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      dayType: p.dayType ? String(p.dayType) : null,
      timeSlot: p.timeSlot ? String(p.timeSlot) : null,
      label: p.label,
      validFrom: p.validFrom ? String(p.validFrom) : null,
      validTo: p.validTo ? String(p.validTo) : null,
    })),
  };

  return (
    <div className="text-foreground mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-36 sm:px-12 sm:pb-32">
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link
          href={`/${facility.slug}`}
          className="text-muted-foreground hover:text-foreground text-xs font-bold tracking-widest uppercase transition-colors"
        >
          {facility.name}
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <Link
          href={`/${facility.slug}/ulaznice`}
          className="text-muted-foreground hover:text-foreground text-xs font-bold tracking-widest uppercase transition-colors"
        >
          {t.tickets_label || "Ulaznice"}
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-primary text-xs font-black tracking-widest uppercase">
          {product.title}
        </span>
      </div>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <div>
          {product.imageUrl ? (
            <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-3xl">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="bg-muted/30 mb-6 flex aspect-[4/3] w-full items-center justify-center rounded-3xl">
              <Icon name="confirmation_number" className="text-muted-foreground/30 text-[80px]" />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="default"
                className="border-primary/20 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase"
              >
                {category.title}
              </Badge>
              {product.isSeasonPass && (
                <Badge
                  variant="default"
                  className="border-secondary/20 bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase"
                >
                  {t.season_pass || "Sezonska karta"}
                </Badge>
              )}
            </div>

            <h1 className="text-foreground text-3xl leading-[0.95] font-black tracking-tighter uppercase italic md:text-5xl">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed font-medium">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Interactive variant selector with direct add-to-cart */}
        <div id="variant-selector" className="md:sticky md:top-28 md:self-start">
          <TicketVariantSelector
            product={selectorProduct}
            facility={{
              id: facility.id,
              name: facility.name,
              slug: facility.slug,
              category: facility.category,
            }}
            dict={t}
            priceFormat={priceFormat}
          />
        </div>
      </div>
    </div>
  );
}
