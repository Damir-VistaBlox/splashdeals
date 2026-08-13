"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ShareButton } from "./ShareButton";
import { WeatherBadge } from "./ShowcaseHero";
import { CurrentOperationalStatus } from "./OperationalPortal";
import { DistanceCalculator } from "./DistanceCalculator";
import { MobileUnifiedControlPill } from "./MobileUnifiedControlPill";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

interface CurrentWeather {
  temperature: number;
  weathercode: number;
}

interface HeroActionPillProps {
  facility: {
    id: string;
    name: string;
    slug: string;
    lat?: number | string | null;
    lng?: number | string | null;
    hours: Array<{ dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }>;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    city: string;
  };
  facilitySlug: string;
  categorySlug: string;
  weather: CurrentWeather | null;
  isFavorited?: boolean;
}

/**
 * 🧭 HeroActionPill — facility hero actions.
 * Mobile: 44×44 favorite + share row; control pill below.
 */
export function HeroActionPill({
  facility,
  facilitySlug,
  categorySlug,
  weather,
  isFavorited = false,
}: HeroActionPillProps) {
  const parsedLat =
    facility.lat !== null && facility.lat !== undefined ? Number(facility.lat) : null;
  const parsedLng =
    facility.lng !== null && facility.lng !== undefined ? Number(facility.lng) : null;

  return (
    <>
      {/* 📱 MOBILE SHARE + FAVORITE ROW — equal 44px targets */}
      <div className="flex items-center justify-between gap-3 md:hidden">
        <Link
          href={`/${categorySlug}`}
          className="bg-background/72 text-primary-foreground/92 inline-flex h-11 min-h-11 items-center gap-2 rounded-full border border-white/14 px-4 text-[11px] font-black tracking-[0.18em] uppercase shadow-[0_10px_28px_rgba(7,24,39,0.18)] backdrop-blur-xl transition-colors hover:bg-white/16"
        >
          <Icon name="arrow_back" className="text-[12px]" /> Nazad
        </Link>
        <div className="flex items-center gap-2">
          {weather && (
            <div className="hidden min-[360px]:block">
              <WeatherBadge weather={weather} />
            </div>
          )}
          <FavoriteButton
            facilityId={facility.id}
            facilitySlug={facilitySlug}
            isFavorited={isFavorited}
            variant="default"
            className="bg-background/80 border-border relative top-0 left-0 shadow-sm backdrop-blur-xl"
          />
          <ShareButton
            title={facility.name}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${facilitySlug}`}
          />
        </div>
      </div>

      {/* 🧭 DESKTOP ACTIONS */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        <Link
          href={`/${categorySlug}`}
          className="text-primary-foreground/78 hover:text-primary-foreground flex h-10 min-h-10 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-[11px] font-black tracking-[0.16em] uppercase backdrop-blur-md transition-colors hover:bg-white/12"
        >
          <Icon name="arrow_back" className="text-[12px]" /> Nazad
        </Link>
        <FavoriteButton
          facilityId={facility.id}
          facilitySlug={facilitySlug}
          isFavorited={isFavorited}
          variant="default"
          className="bg-background/72 relative top-0 left-0 border-white/12 shadow-sm backdrop-blur-md"
        />
        <ShareButton
          title={facility.name}
          url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${facilitySlug}`}
        />
      </div>

      {/* 🏙️ HERO INFO ROW */}
      <div className="text-muted-foreground flex w-full flex-wrap items-center gap-3 pb-2 font-bold sm:gap-6 sm:pb-4">
        <div className="text-primary-foreground/74 hidden items-center gap-2 rounded-full border border-white/10 bg-white/7 px-4 py-2 backdrop-blur-md md:flex">
          <Icon name="location_on" className="text-primary text-[16px]" />
          <span className="text-[13px] font-medium tracking-tight">
            {facility.streetName} {facility.streetNumber}, {facility.postalCode} {facility.city}
          </span>
        </div>
        <div className="hidden md:block">
          <CurrentOperationalStatus hours={facility.hours} />
        </div>
        {weather && (
          <div className="hidden md:block">
            <WeatherBadge weather={weather} />
          </div>
        )}
        <div className="hidden lg:block">
          {parsedLat !== null && parsedLng !== null && (
            <DistanceCalculator
              destLat={parsedLat}
              destLng={parsedLng}
              facilityName={facility.name}
            />
          )}
        </div>
        <div className="block w-full pt-2 md:hidden">
          <MobileUnifiedControlPill
            hours={facility.hours}
            destLat={parsedLat}
            destLng={parsedLng}
          />
        </div>
      </div>
    </>
  );
}
