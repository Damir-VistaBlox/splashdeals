import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

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
  const explicitBG = facility.media?.find((m) => m.isCardBackground);
  const aerialPhoto = facility.media?.find((m) => m.purpose === "AERIAL");
  const backgroundPhoto =
    explicitBG ||
    aerialPhoto ||
    facility.media?.find((m) => m.type === "PHOTO" || !m.url?.endsWith(".mp4")) ||
    facility.media?.[0];

  return (
    <Link href={`/${facility.slug}`} className="block">
      <Card className="surface-card group animated-border hover:border-primary/30 relative flex h-[320px] flex-col justify-end overflow-hidden rounded-[2rem] border-white/70 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 sm:h-[410px]">
        {facility.logoUrl && (
          <div className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/72 p-2 shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:scale-105 sm:top-6 sm:right-6 sm:h-14 sm:w-14">
            <div className="relative h-full w-full">
              <Image
                src={facility.logoUrl}
                alt={`${facility.name} Logo`}
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
          </div>
        )}

        <FavoriteButton
          facilityId={facility.id}
          facilitySlug={facility.slug}
          isFavorited={isFavorited}
        />

        <div className="absolute inset-0 z-0">
          {backgroundPhoto?.url ? (
            <Image
              src={backgroundPhoto.url}
              alt={facility.name}
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,32,52,0.02),rgba(2,32,52,0.18)_40%,rgba(2,32,52,0.84)_100%)]" />
        </div>

        <div className="relative z-10 flex w-full flex-col gap-1 p-4 sm:p-6">
          <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-black/18 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-white uppercase backdrop-blur-md">
            <Icon name="navigation" className="text-primary rotate-45 text-[12px]" />
            {dict?.categories?.[facility.category.toLowerCase()] || facility.category}
          </span>
          <h3 className="mb-3 text-xl leading-none font-black tracking-[-0.06em] text-white uppercase italic transition-colors sm:text-2xl">
            {facility.name}
          </h3>

          <div className="flex flex-col gap-2 text-[10px] font-bold tracking-widest text-white/82 uppercase">
            <div className="flex items-center gap-2">
              <Icon name="location_on" className="shrink-0 text-[14px] text-white/68" />
              <span className="truncate">
                {facility.streetName} {facility.streetNumber}, {facility.postalCode} {facility.city}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-white/14 pt-4">
              {facility.minPrice ? (
                <div className="text-[10px] font-black tracking-widest text-white/70 uppercase">
                  {fromLabel}{" "}
                  <span className="mt-1 block text-base leading-none font-black text-white">
                    {facility.minPrice} RSD
                  </span>
                </div>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-1.5 rounded-xl border border-white/16 bg-white/12 px-4 py-2.5 text-[9px] font-black tracking-[0.15em] text-white uppercase shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-x-1 group-hover:border-white/30 group-hover:bg-white/18">
                <span>Detaljnije</span>
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
  );
}
