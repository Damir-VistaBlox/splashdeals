"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/types";

interface LogoProps {
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  dict?: Dict;
  mobileCompact?: boolean;
}

export function Logo({
  isTabActive,
  isReducedMotion,
  isHovered,
  setIsHovered,
  dict,
  mobileCompact = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex min-h-[44px] items-center gap-2.5 rounded-full px-3 py-2",
        mobileCompact && "min-h-0 shrink-0 gap-0 px-1 py-1.5",
        isTabActive && "opacity-100",
      )}
      aria-label={dict?.brand?.logo_aria ?? "Splashdeals početna"}
    >
      <div className="absolute inset-0 rounded-full bg-white/52 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className={cn("relative z-10 flex items-center gap-2.5", mobileCompact && "gap-0")}>
        <Image
          src={mobileCompact ? "/splashdeal-logo-mini.png" : "/logo-splashdeals.webp"}
          alt={dict?.brand?.logo_alt ?? "SplashDeals - digitalne ulaznice za vodene parkove Srbija"}
          width={mobileCompact ? 105 : 331}
          height={mobileCompact ? 105 : 112}
          className={cn(
            mobileCompact ? "h-10 w-10 object-contain" : "h-10 w-auto object-contain sm:h-11",
            "transition-[transform,filter] duration-300",
            isHovered && "scale-[1.03] brightness-110",
            isReducedMotion && "transition-none",
          )}
          priority
        />
      </div>
    </Link>
  );
}
