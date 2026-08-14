import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { absoluteUrl } from "@/lib/seo";

interface Facility {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  description: string | null;
  logoUrl?: string | null;
  media?: { url: string; type?: string; purpose?: string; isCardBackground?: boolean }[];
  minPrice: number | null;
}

interface FacilityCardProps {
  facility: Facility;
  dict: Record<string, any>;
  fromLabel: string;
  isPriority?: boolean;
  isFavorited?: boolean;
}

function getCategoryAccent(category: string) {
  const key = category.toLowerCase();

  if (key.includes("banj")) {
    return {
      glow: "shadow-[0_22px_44px_rgba(234,179,8,0.16)]",
      chip: "bg-amber-400/18 border-amber-200/24 text-white",
      city: "bg-amber-300/18 text-white/92",
      price: "from-amber-300/18 to-transparent",
    };
  }

  if (key.includes("wellness") || key.includes("spa")) {
    return {
      glow: "shadow-[0_22px_44px_rgba(16,185,129,0.16)]",
      chip: "bg-emerald-400/18 border-emerald-200/24 text-white",
      city: "bg-emerald-300/18 text-white/92",
      price: "from-emerald-300/18 to-transparent",
    };
  }

  if (key.includes("bazen")) {
    return {
      glow: "shadow-[0_22px_44px_rgba(59,130,246,0.16)]",
      chip: "bg-blue-400/18 border-blue-200/24 text-white",
      city: "bg-blue-300/18 text-white/92",
      price: "from-blue-300/18 to-transparent",
    };
  }

  return {
    glow: "shadow-[0_22px_44px_rgba(6,182,212,0.16)]",
    chip: "bg-cyan-400/18 border-cyan-200/24 text-white",
    city: "bg-sky-300/18 text-white/92",
    price: "from-cyan-300/18 to-transparent",
  };
}

/**
 * 🌊 FacilityCard — listing card with canonical /{slug} link and session-aware favorite.
 */
export function FacilityCard({
  facility,
  dict,
  fromLabel,
  isPriority = false,
  isFavorited = false,
}: FacilityCardProps) {
  const facilityDict = dict?.facility || {};
  const explicitBG = facility.media?.find((m) => m.isCardBackground);
  const aerialPhoto = facility.media?.find((m) => m.purpose === "AERIAL");
  const backgroundPhoto =
    explicitBG ||
    aerialPhoto ||
    facility.media?.find((m) => m.type === "PHOTO" || !m.url?.endsWith(".mp4")) ||
    facility.media?.[0];
  const categoryLabel =
    dict?.categories?.[facility.category.toLowerCase()] || facility.category.replaceAll("-", " ");
  const addressLine = `${facility.streetName} ${facility.streetNumber}, ${facility.postalCode} ${facility.city}`;
  const shortAddress = `${facility.streetName} ${facility.streetNumber}`;
  const detailLabel = facilityDict.details_cta || "Detaljnije";
  const fallbackDescription =
    facilityDict.card_description || "Digitalne ulaznice, jasne cene i brza kupovina online.";
  const descriptionText = facility.description?.trim() || fallbackDescription;
  const accent = getCategoryAccent(facility.category);
  const trustChip = facilityDict.trusted_checkout || "Online kupovina";
  const speedChip = facilityDict.fast_entry || "Brza potvrda";
  const clearPriceLabel = facilityDict.clear_price || "Jasna cena";
  const openFacilityLabel = facilityDict.open_facility || "Otvori objekat";
  const facilityUrl = absoluteUrl(`/${facility.slug}`);

  return (
    <article
      className="group relative"
      itemScope
      itemType="https://schema.org/TouristAttraction"
      aria-labelledby={`facility-card-title-${facility.id}`}
    >
      <meta itemProp="name" content={facility.name} />
      <meta itemProp="url" content={facilityUrl} />
      {backgroundPhoto?.url ? <meta itemProp="image" content={backgroundPhoto.url} /> : null}
      <meta itemProp="description" content={descriptionText} />
      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <meta
          itemProp="streetAddress"
          content={`${facility.streetName} ${facility.streetNumber}`}
        />
        <meta itemProp="postalCode" content={facility.postalCode} />
        <meta itemProp="addressLocality" content={facility.city} />
        <meta itemProp="addressCountry" content="RS" />
      </div>
      {facility.minPrice ? (
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="RSD" />
          <meta itemProp="price" content={String(facility.minPrice)} />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <link itemProp="url" href={facilityUrl} />
        </div>
      ) : null}

      <FavoriteButton
        facilityId={facility.id}
        facilitySlug={facility.slug}
        isFavorited={isFavorited}
        className="absolute top-2 left-2 z-30"
      />

      <Link
        href={`/${facility.slug}`}
        className="block"
        aria-label={`${facility.name}, ${facility.city} - ${detailLabel}`}
        title={`${facility.name} - ${facility.city}`}
      >
        <Card
          className={`surface-card group animated-border hover:border-primary/30 relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[1.6rem] border-white/70 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 ${accent.glow} sm:h-[410px] sm:min-h-0 sm:rounded-[2rem]`}
        >
          {facility.logoUrl && (
            <div className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1rem] border border-white/70 bg-white/78 p-2 shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:scale-105 sm:top-5 sm:right-5 sm:h-13 sm:w-13 sm:rounded-2xl">
              <div className="relative h-full w-full">
                <Image
                  src={facility.logoUrl}
                  alt={`${facility.name} logo`}
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div className="absolute inset-0 z-0">
            {backgroundPhoto?.url ? (
              <Image
                src={backgroundPhoto.url}
                alt={`${facility.name} u gradu ${facility.city}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                priority={isPriority}
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <Icon name="auto_awesome" className="text-foreground text-[48px]" />
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,32,52,0.01),rgba(2,32,52,0.12)_34%,rgba(2,32,52,0.7)_68%,rgba(2,32,52,0.9)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(7,29,44,0.15)_24%,rgba(7,29,44,0.58)_58%,rgba(7,29,44,0.92)_100%)]" />
          </div>

          <div className="relative z-10 flex w-full flex-col gap-2 p-3.5 sm:gap-2 sm:p-5">
            <div className="mb-0.5 flex flex-wrap items-center gap-1.5 sm:mb-1 sm:gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black tracking-[0.12em] uppercase backdrop-blur-md sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-[0.14em] ${accent.chip}`}
              >
                <Icon name="navigation" className="text-primary rotate-45 text-[12px]" />
                {categoryLabel}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] uppercase backdrop-blur-sm sm:text-[10px] sm:tracking-[0.12em] ${accent.city}`}
              >
                {facility.city}
              </span>
              <span className="hidden items-center rounded-full border border-white/18 bg-white/10 px-2.5 py-1 text-[9px] font-black tracking-[0.12em] text-white uppercase backdrop-blur-md sm:inline-flex">
                {trustChip}
              </span>
            </div>

            <h3
              id={`facility-card-title-${facility.id}`}
              className="text-[1.45rem] leading-[0.96] font-black tracking-[-0.05em] text-balance text-white transition-colors sm:text-[1.95rem]"
              itemProp="name"
            >
              {facility.name}
            </h3>

            <p className="line-clamp-3 max-w-[30ch] text-[13px] leading-relaxed font-medium text-white/82 sm:line-clamp-2 sm:max-w-[32ch] sm:text-[15px]">
              {descriptionText}
            </p>

            <div className="flex flex-col gap-2.5 pt-0.5 sm:gap-3 sm:pt-1">
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex min-h-7 items-center rounded-full bg-white/12 px-2.5 text-[9px] font-black tracking-[0.12em] text-white uppercase backdrop-blur-sm">
                  {speedChip}
                </span>
                {facility.minPrice ? (
                  <span className="hidden min-h-7 items-center rounded-full bg-emerald-400/18 px-2.5 text-[9px] font-black tracking-[0.12em] text-white uppercase backdrop-blur-sm sm:inline-flex">
                    {clearPriceLabel}
                  </span>
                ) : null}
              </div>
              <address className="flex items-center gap-2 text-[10px] leading-tight font-semibold text-white/74 not-italic sm:text-[11px]">
                <Icon name="location_on" className="shrink-0 text-[14px] text-white/64" />
                <span className="truncate" title={addressLine}>
                  {shortAddress}
                </span>
              </address>

              <div className="mt-0.5 flex items-end justify-between gap-2.5 border-t border-white/14 pt-3 sm:mt-1 sm:gap-3 sm:pt-4">
                {facility.minPrice ? (
                  <div
                    className={`min-w-0 rounded-[1.1rem] bg-gradient-to-r ${accent.price} px-2.5 py-2 sm:rounded-2xl sm:px-3`}
                  >
                    <div className="text-[9px] font-black tracking-[0.14em] text-white/62 uppercase sm:text-[10px] sm:tracking-[0.16em]">
                      {fromLabel}
                    </div>
                    <span
                      className="mt-1 block text-[1.45rem] leading-none font-black tracking-[-0.04em] text-white sm:text-[1.75rem]"
                      itemProp="price"
                    >
                      {facility.minPrice} RSD
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex min-h-11 items-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-3.5 py-2 text-[8px] font-black tracking-[0.12em] text-white uppercase shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-x-1 group-hover:border-white/30 group-hover:bg-white/16 sm:px-4 sm:py-2.5 sm:text-[9px] sm:tracking-[0.14em]">
                  <span>{facility.minPrice ? detailLabel : openFacilityLabel}</span>
                  <Icon
                    name="navigation"
                    className="rotate-90 text-[10px] transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </article>
  );
}
