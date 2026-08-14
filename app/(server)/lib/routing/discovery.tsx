import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { FacilityGrid } from "@/app/(web)/facility/_components/FacilityGrid";
import { FacilityGridSkeleton } from "@/app/(web)/facility/_components/FacilitySkeletons";
import Link from "next/link";
import { prisma } from "@/app/(server)/lib/prisma";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/SEO/JsonLd";
import {
  slugToDbValue,
  slugToName,
  isKnownCategory,
  resolveCategoryKey,
} from "@/lib/routing/categories";
import {
  BRAND_NAME,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  buildBreadcrumbSchema,
  pageMetadata,
  publicRobots,
  resolveSiteUrl,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams?: Promise<{ sort?: string }>;
}

const CATEGORY_SERP_OVERRIDES: Record<
  string,
  {
    titleLead: string;
    descriptionLead: string;
    intro: string;
  }
> = {
  "akva-parkovi": {
    titleLead: "Akva parkovi u Srbiji",
    descriptionLead: "Uporedite akva parkove, sezonske ponude i digitalne ulaznice",
    intro:
      "Pronađite objekte sa toboganima, porodičnim sadržajem i jasnim cenama ulaza na jednoj mobilno prilagođenoj stranici.",
  },
  bazeni: {
    titleLead: "Bazeni u Srbiji",
    descriptionLead: "Pregledajte otvorene i zatvorene bazene sa cenama ulaznica",
    intro:
      "Brzo uporedite gradske, sportske i rekreativne bazene prema lokaciji, sadržaju i aktuelnim digitalnim ponudama.",
  },
  banje: {
    titleLead: "Banje u Srbiji",
    descriptionLead: "Istražite banje, wellness sadržaj i online ulaznice",
    intro:
      "Otvorite proverene banjske destinacije sa fokusom na relaksaciju, termalne sadržaje i kupovinu ulaznica bez čekanja.",
  },
  "wellness-i-spa": {
    titleLead: "Wellness i spa u Srbiji",
    descriptionLead: "Uporedite spa centre, wellness sadržaj i digitalne ulaznice",
    intro:
      "Otkrijte mirnije wellness destinacije sa jasnim informacijama o sadržaju, cenama i uslovima posete na telefonu.",
  },
};

function getDiscoverySeoContent(canonicalSlug: string, displayName: string) {
  const override = CATEGORY_SERP_OVERRIDES[canonicalSlug];
  const titleBase = override?.titleLead ?? `${displayName} u Srbiji`;
  const title = `${titleBase} | Cene ulaznica, lokacije i objekti`;
  const description = override?.descriptionLead
    ? `${override.descriptionLead} u Srbiji. Pregledajte lokacije, sadržaj i proverene Splashdeals stranice za brzu mobilnu kupovinu.`
    : `Istražite ${displayName.toLowerCase()} u Srbiji, uporedite objekte, sadržaj i lokacije, pa otvorite proverene stranice za digitalnu kupovinu ulaznica na telefonu.`;

  return {
    title,
    description,
    intro:
      override?.intro ??
      `Uporedite lokacije, proverite sadržaj i otvorite detaljne stranice objekata za ${displayName.toLowerCase()} sa cenama i digitalnim ulaznicama prilagođenim mobilnoj kupovini.`,
  };
}

/**
 * Generate SEO metadata for a category/discovery page
 */
export async function getDiscoveryMetadata(categorySlug: string): Promise<Metadata> {
  const canonicalSlug = resolveCategoryKey(categorySlug) || categorySlug.toLowerCase();
  const dbValue = slugToDbValue(canonicalSlug);

  let hasCategory = false;
  try {
    const result = await prisma.facility.findFirst({
      where: { category: { equals: dbValue ?? categorySlug, mode: "insensitive" } },
    });
    hasCategory = !!result;
  } catch {
    // DB not available (CI, empty state) — still render for known categories
  }

  // If no facilities in DB but category slug is known, still render (eg. CI/empty state)
  if (!hasCategory && !isKnownCategory(canonicalSlug)) {
    notFound();
  }

  const catName =
    slugToName(canonicalSlug) ??
    canonicalSlug.charAt(0).toUpperCase() + canonicalSlug.slice(1).toLowerCase();
  const seo = getDiscoverySeoContent(canonicalSlug, catName);
  const canonicalUrl = absoluteUrl(`/${canonicalSlug}`, resolveSiteUrl());
  return {
    ...pageMetadata(`/${canonicalSlug}`),
    title: seo.title,
    description: seo.description,
    keywords: [
      catName,
      `${catName} Srbija`,
      `${catName} ulaznice`,
      "digitalne ulaznice",
      BRAND_NAME,
    ],
    robots: publicRobots(),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      images: [absoluteUrl(DEFAULT_OG_IMAGE, resolveSiteUrl())],
      locale: "sr_RS",
      type: "website",
      siteName: BRAND_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE, resolveSiteUrl())],
    },
  };
}

/**
 * Discovery Template — renders category grid with breadcrumbs and metadata
 */
export async function DiscoveryTemplate({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  const rawSearchParams = searchParams ? await searchParams : {};
  const canonicalSlug = resolveCategoryKey(categorySlug) || categorySlug.toLowerCase();
  const dict = await getDictionary();
  const dbValue = slugToDbValue(canonicalSlug);
  const site = resolveSiteUrl();
  const sortParam =
    rawSearchParams?.sort === "price_asc" ||
    rawSearchParams?.sort === "price_desc" ||
    rawSearchParams?.sort === "name_asc"
      ? rawSearchParams.sort
      : "newest";

  let hasCategory = false;
  try {
    const result = await prisma.facility.findFirst({
      where: { category: { equals: dbValue ?? canonicalSlug, mode: "insensitive" } },
    });
    hasCategory = !!result;
  } catch {
    // DB not available (CI, empty state) — still render for known categories
  }

  // If no facilities in DB but category slug is known, still render (eg. CI/empty state)
  if (!hasCategory && !isKnownCategory(canonicalSlug)) {
    notFound();
  }

  const displayName =
    slugToName(canonicalSlug) ??
    canonicalSlug.charAt(0).toUpperCase() + canonicalSlug.slice(1).toLowerCase();
  const seo = getDiscoverySeoContent(canonicalSlug, displayName);
  let categoryItems: { slug: string; name: string; city: string }[] = [];

  try {
    categoryItems = await prisma.facility.findMany({
      where: {
        category: { equals: dbValue ?? canonicalSlug, mode: "insensitive" },
        status: "ACTIVE",
      },
      select: { slug: true, name: true, city: true },
      orderBy: [{ updatedAt: "desc" }],
      take: 12,
    });
  } catch {
    categoryItems = [];
  }

  const categoryUrl = absoluteUrl(`/${canonicalSlug}`, site);
  const relatedLinks = [
    { href: "/how-it-works", label: "Kako funkcioniše kupovina" },
    { href: "/support", label: "Korisnička podrška" },
    { href: "/terms", label: "Uslovi kupovine" },
    { href: "/privacy", label: "Privatnost i zaštita podataka" },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Početna", path: "/" },
      { name: displayName, path: `/${canonicalSlug}` },
    ],
    `/${canonicalSlug}`,
  );
  const controlLinks = [
    { href: `/${canonicalSlug}`, label: "Najnovije", active: sortParam === "newest" },
    {
      href: `/${canonicalSlug}?sort=price_asc`,
      label: "Najniža cena",
      active: sortParam === "price_asc",
    },
    {
      href: `/${canonicalSlug}?sort=name_asc`,
      label: "A-Z",
      active: sortParam === "name_asc",
    },
    {
      href: `/search?q=${encodeURIComponent(displayName)}`,
      label: "Pretraga",
      active: false,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#webpage`,
        name: `${displayName} u Srbiji`,
        description: seo.description,
        url: categoryUrl,
        inLanguage: "sr-Latn-RS",
        isPartOf: { "@id": `${site}/#website` },
        breadcrumb: { "@id": `${categoryUrl}#breadcrumb` },
        significantLink: [
          ...categoryItems.slice(0, 6).map((facility) => absoluteUrl(`/${facility.slug}`, site)),
          ...relatedLinks.map((link) => absoluteUrl(link.href, site)),
        ],
        mainEntity: {
          "@type": "ItemList",
          "@id": `${categoryUrl}#itemlist`,
          numberOfItems: categoryItems.length,
          itemListElement: categoryItems.map((facility, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: facility.name,
            url: absoluteUrl(`/${facility.slug}`, site),
          })),
        },
      },
      breadcrumbSchema,
    ],
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-3 pt-8 pb-32 sm:px-6 sm:pt-10 md:px-8">
      <JsonLd data={jsonLd} />

      <header className="section-shell mb-12 overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="relative z-10 mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <span className="mb-4 block text-[10px] font-black tracking-[0.4em] text-cyan-600 uppercase">
              {dict.facilities.category_discovery}
            </span>
            <h1 className="text-4xl leading-[0.9] font-black tracking-[-0.08em] text-sky-950 uppercase italic sm:text-7xl">
              {dict.facilities.best_label} <br />{" "}
              <span className="text-splash capitalize">{displayName}</span>{" "}
              {dict.facilities.facilities_label}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              {seo.intro}
            </p>
          </div>
          <div className="surface-glass max-w-sm rounded-[1.35rem] p-4">
            <p className="text-primary text-[10px] font-black tracking-[0.16em] uppercase">
              Za kupce
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Digitalne ulaznice, jasne cene i izbor destinacija koji se lako pretražuje po
              kategoriji.
            </p>
          </div>
        </div>
      </header>

      <section aria-labelledby="category-results-heading">
        <div className="mb-5 flex flex-col gap-2">
          <h2
            id="category-results-heading"
            className="text-2xl font-black tracking-[-0.04em] text-slate-950"
          >
            {displayName} objekti i ulaznice
          </h2>
          <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
            Otvorite detaljne stranice objekata za cene, sadržaj, radno vreme i aktuelne digitalne
            ponude u kategoriji {displayName.toLowerCase()}.
          </p>
        </div>
        <nav
          aria-label="Kontrole otkrivanja"
          className="no-scrollbar -mx-1 mb-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1"
        >
          {controlLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.active
                  ? "bg-primary text-primary-foreground inline-flex min-h-11 shrink-0 snap-start items-center rounded-full px-4 text-[10px] font-black tracking-[0.14em] uppercase shadow-[0_14px_30px_rgba(6,182,212,0.2)]"
                  : "surface-subtle inline-flex min-h-11 shrink-0 snap-start items-center rounded-full border border-white/70 px-4 text-[10px] font-black tracking-[0.14em] uppercase"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={<FacilityGridSkeleton count={4} />}>
          <FacilityGrid
            dict={dict}
            fromLabel={dict.facilities.from_price}
            category={dbValue ?? categorySlug}
            sort={sortParam}
            noFacilitiesLabel={dict.facilities.no_facilities}
          />
        </Suspense>
      </section>

      <section
        aria-labelledby="category-helpful-links-heading"
        className="mt-12 grid gap-4 rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-[0_20px_60px_-30px_rgba(14,116,144,0.35)] sm:p-6"
      >
        <div className="space-y-2">
          <h2
            id="category-helpful-links-heading"
            className="text-lg font-black tracking-[-0.03em] text-slate-950"
          >
            Sledeći koraci za mobilnu kupovinu
          </h2>
          <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
            Pređite na proverene informativne strane ako želite da razumete tok kupovine, korisničku
            podršku ili pravila pre naručivanja ulaznica.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-300 hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
