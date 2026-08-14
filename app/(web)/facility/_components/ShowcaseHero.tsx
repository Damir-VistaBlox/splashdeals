import { Icon } from "@/components/ui/Icon";
import type { FacilityMedia } from "@prisma/client";
import Image from "next/image";
import { HeroVideoEnhancer } from "./HeroVideoEnhancer";

interface ShowcaseHeroProps {
  heroMedia: FacilityMedia | null;
  facility: {
    id: string;
    name: string;
  };
}

const HERO_IMAGE_SIZES =
  "(max-width: 420px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 92vw, 1280px";
const HERO_IMAGE_QUALITY = 48;

/**
 * SSR-first hero media.
 * Always paints a poster/image for LCP, then upgrades to video on capable clients.
 */
export function ShowcaseHero({ heroMedia, facility }: ShowcaseHeroProps) {
  const renderMedia = () => {
    if (!heroMedia) {
      return (
        <div className="from-background to-background flex h-full w-full items-center justify-center bg-gradient-to-br">
          <Icon name="waves" className="text-foreground h-48 w-48 animate-pulse" />
        </div>
      );
    }

    if (heroMedia.type === "VIDEO") {
      return (
        <div className="relative h-full w-full">
          {heroMedia.thumbnailUrl && (
            <Image
              src={heroMedia.thumbnailUrl}
              alt={`${facility.name} poster`}
              fill
              priority
              fetchPriority="high"
              quality={HERO_IMAGE_QUALITY}
              sizes={HERO_IMAGE_SIZES}
              className="pointer-events-none object-cover brightness-75"
            />
          )}
          <HeroVideoEnhancer src={heroMedia.url} poster={heroMedia.thumbnailUrl || undefined} />
        </div>
      );
    }

    // PHOTO type — render the photo URL directly
    if (heroMedia.type === "PHOTO") {
      return (
        <div className="relative h-full w-full">
          <Image
            src={heroMedia.url}
            alt={facility.name}
            fill
            priority
            fetchPriority="high"
            quality={HERO_IMAGE_QUALITY}
            sizes={HERO_IMAGE_SIZES}
            className="object-cover brightness-75 transition-[filter] duration-700"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-background absolute inset-0 z-0">
      {renderMedia()}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,39,0.18),rgba(7,24,39,0.08)_28%,rgba(7,24,39,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[radial-gradient(circle_at_bottom,rgba(6,182,212,0.28),transparent_62%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent)]" />
    </div>
  );
}
