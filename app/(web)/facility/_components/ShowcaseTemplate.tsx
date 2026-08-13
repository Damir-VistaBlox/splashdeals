import { Icon } from "@/components/ui/Icon";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionaries";

// 🏝️ Islands: Client Components for interactive portions
import { ShowcaseHero } from "./ShowcaseHero";
import { FaqAccordion, type FAQCategory } from "./FaqAccordion";
import { OperationalPortal } from "./OperationalPortal";
import { TicketGridSkeleton } from "./ShowcaseSkeletons";
import { HeroActionPill } from "./HeroActionPill";
import dynamic from "next/dynamic";

const ShowcaseTicketGroups = dynamic(
  () =>
    import("@/app/(web)/ticketing/_components/ShowcaseTicketGroups").then(
      (mod) => mod.ShowcaseTicketGroups,
    ),
  {
    loading: () => <TicketGridSkeleton />,
  },
);

const MediaGallery = dynamic(() => import("./MediaGallery").then((mod) => mod.MediaGallery), {
  ssr: true,
  loading: () => (
    <div className="space-y-12">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <Skeleton className="bg-muted mx-auto h-4 w-24 rounded" />
        <Skeleton className="bg-muted mx-auto h-8 w-64 rounded-lg" />
      </div>
      <div className="grid auto-rows-[250px] grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="bg-muted rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  ),
});

const ShowcaseAmenities = dynamic(
  () => import("./ShowcaseAmenities").then((mod) => mod.ShowcaseAmenities),
  {
    ssr: true,
  },
);

import { FacilityReviews } from "./FacilityReviews";
import { BackToTop } from "./BackToTop";
import { PartnerBranding } from "./PartnerBranding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { serialize } from "@/lib/serialize";
import { JsonLd } from "@/components/SEO/JsonLd";
import { validateDiscoverySlug } from "@/app/(server)/lib/data/discovery";
import { getCategoryLabel, buildFacilitySchema, TierEntry } from "../_data";
import {
  getFacility,
  buildTicketGroups,
  flattenActivePrices,
  buildPriceLevelTiers,
} from "../_data";
import { getWeather } from "@/app/(server)/lib/weather";
import { dbValueToSlug } from "@/lib/routing/categories";
import { getFavoritedFacilityIds } from "@/app/(server)/actions/favorites";

/**
 * Infer the FAQ category from question text when the data source doesn't
 * provide one. Uses keyword matching against the four known categories.
 */
function inferFaqCategory(question: string): FAQCategory {
  const q = question.toLowerCase();

  if (
    /ulaznic|karta|kartu|karte|kartom|cen[ae]|cijena?|cijen[ae]|pla[ćc]anj|payment|ticket|price|popust|rezervacij|booking|detalji poset|detalji ulaz/.test(
      q,
    )
  ) {
    return "ulaznice";
  }
  if (
    /boravak|radno vreme|radno vrijeme|otvoren[ao]|trajanj[ae]|sme[šs]taj|smjestaj|smje[šs]taj|working hours|opening|duration|stay|dolazak|odlazak/.test(
      q,
    )
  ) {
    return "boravak";
  }
  if (
    /pravil[ao]|uzrast|starost|dozvoljen[oae]|zabranjen[oae]|pravilo|uslov[ii]|rule|age.?restrict|prohibited|allowed|minimum|maksimum/.test(
      q,
    )
  ) {
    return "pravila";
  }
  if (
    /lokacij[ae]|parking|parkirali[šs]t|adresa|prevoz|kako sti[ćc]i|kako do[ćc]i|transport|address|location|parking|direction|nalazi se/.test(
      q,
    )
  ) {
    return "lokacija";
  }

  return "ulaznice";
}

interface FacilityPageProps {
  params: Promise<{
    categorySlug: string;
    facilitySlug: string;
  }>;
}

type FacilityData = NonNullable<Awaited<ReturnType<typeof getFacility>>>;

function buildTicketProductMap(facility: FacilityData) {
  const ticketProductMap: Record<
    string,
    {
      id: string;
      title: string;
      label: string | null;
      minPeople: number;
      maxPeople: number | null;
      prices: Array<{
        id: string;
        label: string | null;
        price: number;
        originalPrice: number | null;
        dayType: string | null;
        timeSlot: string | null;
      }>;
    }
  > = {};

  for (const cat of facility.ticketCategories || []) {
    for (const prod of cat.types || []) {
      ticketProductMap[prod.id] = {
        id: prod.id,
        title: prod.title,
        label: prod.label,
        minPeople: prod.minPeople,
        maxPeople: prod.maxPeople,
        prices: (prod.prices || []).map((p) => ({
          id: p.id,
          label: p.label,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          dayType: p.dayType,
          timeSlot: p.timeSlot,
        })),
      };
    }
  }

  return ticketProductMap;
}

function selectHeroMedia(facility: FacilityData) {
  const explicitHero = facility.media.find((m) => m.isHero);
  const firstVideo = facility.media.find((m) => m.type === "VIDEO");
  return explicitHero || firstVideo || facility.media[0] || null;
}

async function loadFacilityShowcaseContext(facilitySlug: string, categorySlug: string) {
  const facility = await getFacility(facilitySlug);

  if (!facility) return null;

  const discovery = validateDiscoverySlug(categorySlug, facility);
  const mappedGroups = buildTicketGroups(facility);
  const allPrices = flattenActivePrices(facility);
  const heroMedia = selectHeroMedia(facility);
  const ticketProductMap = buildTicketProductMap(facility);
  const priceLevelTiers = buildPriceLevelTiers(facility) as TierEntry[];
  const schemaCategorySlug =
    dbValueToSlug(facility.category) || categorySlug.toLowerCase().replace(/\s+/g, "-");
  const [weather, favoritedIds] = await Promise.all([
    facility.lat && facility.lng ? getWeather(Number(facility.lat), Number(facility.lng)) : null,
    getFavoritedFacilityIds([facility.id]),
  ]);

  return {
    facility,
    discovery,
    mappedGroups,
    allPrices,
    heroMedia,
    ticketProductMap,
    priceLevelTiers,
    schemaCategorySlug,
    weather,
    isFavorited: favoritedIds.has(facility.id),
  };
}

/**
 * 🕵️ Metadata Engine — For the legacy long-segment redirect
 * 301 redirects /{category}/{facility} to /{facility} for SEO link equity.
 * Real metadata for facility pages is built in route generateMetadata via
 * buildFacilityMetadata (app/(web)/[categorySlug]/page.tsx and [...slug]).
 * Do NOT implement page titles/OG here — redirects only.
 */
export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  const { facilitySlug } = await params;

  permanentRedirect(`/${facilitySlug}`);
}

/**
 * 🌊 Showcase Template Component (Used natively by catching routes)
 */
export async function FacilityShowcaseTemplate({ params }: FacilityPageProps) {
  const { facilitySlug, categorySlug } = await params;
  const currentYear = new Date().getFullYear();
  const dict = await getDictionary();
  const showcase = await loadFacilityShowcaseContext(facilitySlug, categorySlug);

  if (!showcase) return notFound();

  const {
    facility,
    discovery,
    mappedGroups,
    allPrices,
    heroMedia,
    ticketProductMap,
    priceLevelTiers,
    schemaCategorySlug,
    weather,
    isFavorited,
  } = showcase;

  const categoryLabel = getCategoryLabel(facility.category);

  // 🕵️ Validate that the URL slug matches the facility's category or city.
  // Never 500 — redirect to the canonical short facility path when invalid.
  if (!discovery.valid) {
    permanentRedirect(discovery.canonicalPath);
  }

  const ticketCount = allPrices.length;

  const facilitySchema = buildFacilitySchema({
    facility: {
      name: facility.name,
      slug: facility.slug,
      category: facility.category,
      description: facility.description,
      publicPhone: facility.publicPhone,
      streetName: facility.streetName,
      streetNumber: facility.streetNumber,
      city: facility.city,
      postalCode: facility.postalCode,
      lat: facility.lat,
      lng: facility.lng,
      createdAt: facility.createdAt,
      logoUrl: facility.logoUrl,
      socialLinks: facility.socialLinks,
      media: facility.media,
    },
    facilitySlug,
    categorySlug: schemaCategorySlug,
    categoryLabel,
    allTiers: priceLevelTiers,
    heroMedia: heroMedia ?? null,
    ticketCount: priceLevelTiers.filter((t) => t.isEntry !== false).length || ticketCount,
    currentYear,
    hours: (facility.hours ?? []).map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
    faqs: (facility.faqs ?? [])
      .filter((f) => f.question && f.answer)
      .map((f) => ({ question: f.question, answer: f.answer })),
    reviews: (facility.reviews ?? []).map((r) => ({
      rating: r.rating,
      comment: r.content,
      userName: r.user?.name ?? null,
    })),
  });
  return (
    <div className="text-foreground selection:bg-primary/30 relative min-h-screen font-sans">
      {/* ✅ Structured Data */}
      <JsonLd data={facilitySchema} id={`facility-${facilitySlug}-schema`} />
      <section className="relative flex min-h-[62svh] w-full flex-col justify-end overflow-hidden px-4 pt-18 pb-5 sm:px-6 md:min-h-[calc(92dvh-120px)] md:px-12 md:pt-18 md:pb-14">
        <ShowcaseHero heroMedia={heroMedia} facility={facility} />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-4 md:mb-10 md:grid-cols-12 md:gap-12">
          <div className="space-y-3.5 md:col-span-8 md:space-y-6">
            <HeroActionPill
              facility={{
                id: facility.id,
                name: facility.name,
                slug: facility.slug,
                lat: facility.lat,
                lng: facility.lng,
                hours: facility.hours,
                streetName: facility.streetName,
                streetNumber: facility.streetNumber,
                postalCode: facility.postalCode,
                city: facility.city,
              }}
              facilitySlug={facilitySlug}
              categorySlug={categorySlug}
              weather={weather}
              isFavorited={isFavorited}
            />

            <div className="bg-background/10 md:bg-background/6 max-w-3xl rounded-[1.6rem] border border-white/12 px-4 py-4 shadow-[0_18px_60px_rgba(7,24,39,0.26)] backdrop-blur-sm sm:px-6 sm:py-6 md:max-w-[54rem] md:rounded-[2.5rem] md:border-white/8 md:px-8 md:py-7 md:shadow-[0_20px_70px_rgba(7,24,39,0.2)]">
              <div className="text-primary-foreground/80 mb-2 text-[10px] font-black tracking-[0.2em] uppercase md:mb-4 md:text-xs">
                {categoryLabel}
              </div>
              <h1 className="text-primary-foreground py-0.5 text-[1.95rem] leading-[0.94] font-black tracking-[-0.05em] italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-5xl md:py-1 md:text-[5.2rem] md:leading-[0.9]">
                {(() => {
                  const words = facility.name.split(" ");
                  if (words.length === 1) {
                    return <span className="text-splash">{words[0]}</span>;
                  }
                  const last = words.length - 1;
                  return words.map((word, i) => (
                    <span key={i} className={i === last ? "text-splash" : ""}>
                      {word}{" "}
                    </span>
                  ));
                })()}
              </h1>
              <p className="text-primary-foreground/84 mt-2 max-w-[17rem] text-[13px] leading-relaxed font-medium sm:max-w-2xl md:mt-5 md:text-[1.02rem]">
                {facility.streetName} {facility.streetNumber}, {facility.postalCode} {facility.city}
              </p>
              <div className="mt-4 hidden items-center gap-3 md:flex">
                <a
                  href="#deals"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-xs font-black tracking-[0.16em] uppercase shadow-[0_18px_40px_rgba(6,182,212,0.26)] transition-colors"
                >
                  <Icon name="confirmation_number" className="text-[15px]" />
                  {dict.facilities?.view_prices}
                </a>
                <a
                  href="#gallery"
                  className="text-primary-foreground/84 hover:text-primary-foreground inline-flex min-h-12 items-center gap-2 rounded-full border border-white/14 bg-white/8 px-5 text-xs font-black tracking-[0.16em] uppercase backdrop-blur-md transition-colors"
                >
                  <Icon name="photo_camera" className="text-[15px]" />
                  Pogledaj galeriju
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:col-span-4 md:block">
            <div className="ml-auto max-w-[21rem] rounded-[2.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-5 shadow-[0_20px_65px_rgba(7,24,39,0.18)] backdrop-blur-lg">
              <div className="text-primary-foreground/68 mb-3 text-[10px] font-black tracking-[0.18em] uppercase">
                Planirajte posetu
              </div>
              <p className="text-primary-foreground text-xl leading-tight font-black tracking-[-0.04em] uppercase italic">
                Jasna cena i brži ulaz.
              </p>
              <p className="text-primary-foreground/70 mt-3 text-sm leading-relaxed font-medium">
                Pregledajte ponude i proverite operativne informacije pre dolaska.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[1.25rem] border border-white/8 bg-black/8 px-4 py-3">
                  <div className="text-primary-foreground/62 text-[10px] font-black tracking-[0.16em] uppercase">
                    Aktivnih ponuda
                  </div>
                  <div className="text-primary-foreground mt-2 text-[2rem] font-black tracking-tight">
                    {ticketCount}
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-white/8 bg-black/8 px-4 py-3">
                  <div className="text-primary-foreground/62 text-[10px] font-black tracking-[0.16em] uppercase">
                    Kategorija
                  </div>
                  <div className="text-primary-foreground mt-2 text-sm leading-tight font-black uppercase">
                    {categoryLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main
        id="facility-main"
        className="relative z-20 mx-auto -mt-4 max-w-7xl [scroll-padding-top:8rem] space-y-8 px-4 pb-20 sm:-mt-8 sm:space-y-32 sm:px-6 sm:pb-48 md:-mt-24 md:px-12"
      >
        <section
          id="deals"
          aria-labelledby="facility-deals-heading"
          className="bg-background/97 border-border/40 scroll-mt-32 space-y-5 rounded-[1.6rem] border px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:space-y-12 sm:px-6 sm:py-8 md:rounded-[2.75rem] md:border md:border-white/60 md:bg-white/64 md:px-8 md:py-8 md:pt-10 md:shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:backdrop-blur-xl"
        >
          <div className="mb-3 flex flex-col items-center space-y-2.5 text-center sm:mb-16 md:mb-10">
            <div className="brand-divider mb-1 w-14" />
            <span className="text-primary text-[11px] font-black tracking-[0.2em] uppercase">
              Ulaznice i paketi
            </span>
            <h2
              id="facility-deals-heading"
              className="text-foreground text-[1.55rem] leading-[0.92] font-black tracking-tighter uppercase italic md:text-5xl"
            >
              {dict.facilities.ticket_prices}
            </h2>
            <p className="text-muted-foreground max-w-[18rem] text-[13px] leading-relaxed sm:max-w-2xl md:text-base">
              Uporedite najvažnije opcije za posetu Petrolandu i izaberite kartu koja najbolje
              odgovara terminu, uzrastu i planu boravka.
            </p>
            <ul
              className="grid w-full max-w-md grid-cols-3 gap-2 pt-1 md:hidden"
              aria-label="Prednosti kupovine ulaznica"
            >
              <li className="bg-muted/35 border-border/40 rounded-2xl border px-3 py-2 text-center">
                <div className="text-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                  Online
                </div>
                <div className="text-muted-foreground mt-1 text-[11px] font-medium">jasne cene</div>
              </li>
              <li className="bg-muted/35 border-border/40 rounded-2xl border px-3 py-2 text-center">
                <div className="text-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                  Izbor
                </div>
                <div className="text-muted-foreground mt-1 text-[11px] font-medium">po terminu</div>
              </li>
              <li className="bg-muted/35 border-border/40 rounded-2xl border px-3 py-2 text-center">
                <div className="text-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                  Kupovina
                </div>
                <div className="text-muted-foreground mt-1 text-[11px] font-medium">bez poziva</div>
              </li>
            </ul>
          </div>
          <Suspense fallback={<TicketGridSkeleton />}>
            <ShowcaseTicketGroups
              groups={mappedGroups}
              facilityId={facility.id}
              facilitySlug={facility.slug}
              facilityName={facility.name}
              category={facility.category}
              dict={dict}
              facility={facility}
              ticketProductMap={serialize(ticketProductMap)}
            />
          </Suspense>
        </section>

        {/* 🍱 Bento Experience Sections */}
        <section
          id="overview"
          aria-labelledby="facility-overview-heading"
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
        >
          <div className="space-y-8 lg:col-span-8">
            {/* Main Text Card */}
            <Card className="brand-card flex min-h-0 flex-col justify-center">
              <CardHeader className="gap-6 p-6 pb-0 sm:p-12 sm:pb-0 md:p-16 md:pb-0">
                <div className="text-primary hidden items-center gap-3 text-xs font-black tracking-[0.2em] uppercase md:flex">
                  <Icon name="auto_awesome" aria-hidden="true" className="text-[16px]" />{" "}
                  {dict.facilities?.experience_label}
                </div>
                <div className="brand-divider mb-4 hidden w-24 md:block" />
                <CardTitle
                  id="facility-overview-heading"
                  className="text-foreground hidden text-2xl leading-tight font-black tracking-tighter uppercase italic md:block md:text-5xl"
                >
                  {dict.facilities?.fun_unlocked}{" "}
                  <span className="text-splash">{dict.facilities?.fun_unlocked_accent}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6 sm:p-12 md:p-16">
                <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed font-medium italic opacity-90 md:text-xl">
                  <span>{facility.description || dict.facilities?.default_description}</span>
                </p>

                {facility.amenities && facility.amenities.length > 0 && (
                  <>
                    {/* Option F: amenity names as prose on mobile (audit M6) */}
                    <p className="text-muted-foreground/80 border-border/30 mt-4 border-t pt-4 text-sm font-medium not-italic md:hidden">
                      <span className="text-foreground font-bold">Sadržaji: </span>
                      {facility.amenities
                        .map((fa) => {
                          const raw = fa.amenity?.name || "";
                          const key = raw.toLowerCase().replace(/['\s]+/g, "_");
                          const translated =
                            (dict?.amenities as Record<string, string> | undefined)?.[key] || raw;
                          return translated;
                        })
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <div className="hidden flex-wrap items-center gap-3 pt-2 md:flex">
                      <span className="text-foreground text-xs font-black tracking-widest uppercase">
                        {facility.amenities.length} sadržaja
                      </span>
                      <a
                        href="#amenities"
                        className="text-primary hover:text-primary/80 inline-flex min-h-11 items-center text-xs font-black tracking-wider uppercase underline underline-offset-4 transition-colors"
                      >
                        {dict.facilities?.browse_all}
                      </a>
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#deals"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 text-xs font-black tracking-wider uppercase shadow-lg transition-colors"
                  >
                    <Icon name="confirmation_number" className="text-[14px]" />
                    {dict.facilities?.view_prices}
                  </a>
                </div>
              </CardContent>
            </Card>

            {facility.transitGuide && (
              <Card className="border-l-primary bg-muted/50 mt-8 border-l-4">
                <CardHeader className="gap-3 p-8 pb-0">
                  <div className="text-primary flex items-center gap-3 text-xs font-black tracking-widest uppercase">
                    <Icon name="location_on" className="text-[16px]" /> Kako stići
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium whitespace-pre-line">
                    {facility.transitGuide}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 🍱 Facility amenities card grid — hidden on mobile, already in description text */}
            <div id="amenities" className="hidden md:block">
              <ShowcaseAmenities
                amenities={
                  serialize(facility.amenities) as unknown as Array<{
                    amenityId: string;
                    value: string | null;
                    imageUrl?: string | null;
                    scheduledAt?: string | null;
                    isFeatured?: boolean;
                    amenity: {
                      id: string;
                      name: string;
                      icon: string;
                      category: string | null;
                      type: "BOOLEAN" | "QUANTIFIABLE" | "TEXT";
                    };
                  }>
                }
                dict={dict}
              />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-4">
            {/* Partner Branding — hidden on mobile (already in description text) */}
            <div className="hidden md:block">
              <PartnerBranding logoUrl={facility.logoUrl} name={facility.name} />
            </div>

            {/* Operational Portal — hidden on mobile (already in MobileUnifiedControlPill) */}
            <div className="hidden md:block">
              <Suspense fallback={<Skeleton className="bg-muted/20 h-[600px] rounded-[3rem]" />}>
                <OperationalPortal hours={facility.hours} />
              </Suspense>
            </div>
          </aside>
        </section>

        {facility.faqs && facility.faqs.length > 0 && (
          <section
            id="faq"
            aria-labelledby="facility-faq-heading"
            className="bg-brand-amber-subtle border-border/30 mx-auto w-full max-w-3xl space-y-8 rounded-[2rem] border px-5 py-6 md:rounded-3xl md:px-12 md:py-8"
          >
            <h2 id="facility-faq-heading" className="sr-only">
              Često postavljena pitanja
            </h2>
            <FaqAccordion
              faqs={facility.faqs.map((f) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
                category: inferFaqCategory(f.question),
              }))}
            />
          </section>
        )}

        {facility.id && (
          <section
            id="reviews"
            aria-labelledby="facility-reviews-heading"
            className="bg-background/92 border-border/30 mx-auto w-full max-w-3xl space-y-8 rounded-[2rem] border px-5 py-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:border-0 md:bg-transparent md:px-12 md:py-8 md:shadow-none"
          >
            <h2 id="facility-reviews-heading" className="sr-only">
              Recenzije posetilaca
            </h2>
            <FacilityReviews
              facilityId={facility.id}
              initialReviews={facility.reviews || []}
              dict={dict}
            />
          </section>
        )}

        <section className="bg-background/92 border-border/30 rounded-[2rem] border px-4 py-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:rounded-[3rem] md:border-0 md:bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.18))] md:px-8 md:py-10 md:shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
          <MediaGallery media={facility.media} dict={dict} />
        </section>

        {facility.seoArticle && (
          <article className="text-muted-foreground border-border mx-auto mt-24 max-w-5xl border-t px-6 py-12 text-center text-xs md:text-left md:text-sm">
            <div className="leading-relaxed whitespace-pre-line">{facility.seoArticle}</div>
          </article>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
