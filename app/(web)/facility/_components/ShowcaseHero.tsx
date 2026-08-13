"use client";
import { Icon } from "@/components/ui/Icon";

import type { FacilityMedia } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ShowcaseHeroProps {
  heroMedia: FacilityMedia | null;
  facility: {
    id: string;
    name: string;
  };
}

function getInitialAllowHDMedia() {
  if (typeof navigator === "undefined" || !("connection" in navigator)) return true;

  const conn = (
    navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;

  if (!conn) return true;

  return !(conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
}

/**
 * 🏔️ ShowcaseHero Island (Client)
 * Saturates native Browser APIs to pause rendering loops on tab-blur
 * and auto-suppress HD loops on constrained Save-Data networks.
 */
export function ShowcaseHero({ heroMedia, facility }: ShowcaseHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowHDMedia] = useState(() =>
    typeof window === "undefined" ? false : getInitialAllowHDMedia(),
  );

  useEffect(() => {
    // 👁️ Page Visibility API: Pause JS-Physics/Media pipelines when tab loses focus
    const handleVisibility = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {}); // Ignore user interaction blockages
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const renderMedia = () => {
    if (!heroMedia) {
      return (
        <div className="from-background to-background flex h-full w-full items-center justify-center bg-gradient-to-br">
          <Icon name="waves" className="text-foreground h-48 w-48 animate-pulse" />
        </div>
      );
    }

    const isVideo = heroMedia.type === "VIDEO" && allowHDMedia;

    if (isVideo) {
      return (
        <div className="relative h-full w-full">
          {heroMedia.thumbnailUrl && (
            <Image
              src={heroMedia.thumbnailUrl}
              alt={`${facility.name} poster`}
              fill
              priority
              sizes="100vw"
              className="pointer-events-none object-cover brightness-75"
            />
          )}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            {...{ fetchPriority: "high" as const }}
            preload="metadata"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover brightness-75 transition-[filter] duration-700"
            poster={heroMedia.thumbnailUrl || undefined}
          >
            <source src={heroMedia.url} type="video/mp4" />
          </video>
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
            sizes="100vw"
            className="object-cover brightness-75 transition-[filter] duration-700"
          />
        </div>
      );
    }

    // VIDEO type but allowHDMedia=false → show thumbnail instead of mp4 URL
    const fallbackSrc = heroMedia.thumbnailUrl || null;
    if (!fallbackSrc) {
      return (
        <div className="from-background to-background flex h-full w-full items-center justify-center bg-gradient-to-br">
          <Icon name="waves" className="text-foreground h-48 w-48 animate-pulse" />
        </div>
      );
    }

    return (
      <div className="relative h-full w-full">
        <Image
          src={fallbackSrc}
          alt={facility.name}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-75 transition-[filter] duration-700"
        />
      </div>
    );
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

export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  time?: string;
  is_day?: number;
}

/**
 * 🌤️ WeatherBadge Island (Client)
 * Minimal interactive component for real-time status visibility.
 */
const WEATHER_MESSAGES: Record<string, { icon: string; label: string }> = {
  clear: { icon: "light_mode", label: "Sunčano" },
  cloudy: { icon: "cloud", label: "Oblačno" },
  rainy: { icon: "rainy", label: "Kiša" },
};

function getWeatherDescriptor(code: number): { icon: string; label: string } {
  if (code === 0) return WEATHER_MESSAGES.clear;
  if (code < 4) return WEATHER_MESSAGES.cloudy;
  return WEATHER_MESSAGES.rainy;
}

export function WeatherBadge({ weather }: { weather: CurrentWeather | null }) {
  if (!weather) return null;

  const desc = getWeatherDescriptor(weather.weathercode);

  return (
    <div className="glass-frost flex items-center gap-3 rounded-full border-white/25 px-4 py-2 shadow-xl">
      <Icon name={desc.icon} className="text-primary text-[20px]" />
      <span className="text-foreground text-sm font-black whitespace-nowrap">
        {Math.round(weather.temperature)}°C
      </span>
      <div className="bg-border hidden h-4 w-px md:block" />
      <span className="text-muted-foreground hidden text-xs font-bold tracking-widest uppercase md:inline">
        {desc.label}
      </span>
    </div>
  );
}
