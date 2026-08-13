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
}

export function Logo({ isTabActive, isReducedMotion, isHovered, setIsHovered, dict }: LogoProps) {
  return (
    <Link
      href="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex min-h-[44px] items-center gap-2.5 rounded-full px-3 py-2",
        isTabActive && "opacity-100",
      )}
      aria-label={dict?.brand?.logo_aria ?? "Splashdeals početna"}
    >
      <div className="absolute inset-0 rounded-full bg-white/52 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center gap-3">
        <Image
          src="/logo-splashdeals.webp"
          alt={dict?.brand?.logo_alt ?? "SplashDeals - digitalne ulaznice za vodene parkove Srbija"}
          width={331}
          height={112}
          className={cn(
            "h-11 w-auto object-contain sm:h-12",
            "transition-[transform,filter] duration-300",
            isHovered && "scale-[1.03] brightness-110",
            isReducedMotion && "transition-none",
          )}
          priority
        />
        <span className="hidden rounded-full border border-sky-200/80 bg-white/72 px-2.5 py-1 text-[10px] font-black tracking-[0.22em] text-sky-700 uppercase shadow-sm lg:inline-flex">
          V1 Live
        </span>
      </div>
    </Link>
  );
}
