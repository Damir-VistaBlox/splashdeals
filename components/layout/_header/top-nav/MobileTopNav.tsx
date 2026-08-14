"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import type { Dict } from "@/lib/types";

interface MobileTopNavProps {
  dict: Dict;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
}

export function MobileTopNav({
  dict,
  isTabActive,
  isReducedMotion,
  isHovered,
  setIsHovered,
}: MobileTopNavProps) {
  const searchLabel = dict.nav.search || "Pretraga";
  const searchHint = dict.search?.short_placeholder || "Pretraži ponude";
  const searchCta = dict.search?.submit_cta || searchLabel;

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-2 px-3 pt-2 pb-3">
        <Logo
          isTabActive={isTabActive}
          isReducedMotion={isReducedMotion}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          dict={dict}
          mobileCompact
        />
        <div className="min-w-0 flex-1" role="search" aria-label={searchLabel}>
          <Link
            href="/search"
            prefetch
            className="border-border/50 focus-visible:ring-primary/30 group relative flex min-h-[3.1rem] items-center rounded-[1.2rem] border bg-white/88 px-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99]"
            aria-label={searchLabel}
          >
            <span className="text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center">
              <Icon name="search" className="text-[17px]" />
            </span>
            <span className="min-w-0 flex-1 px-2">
              <span className="text-foreground block truncate text-sm font-bold">{searchHint}</span>
              <span className="text-muted-foreground block text-[10px] font-black tracking-[0.12em] uppercase">
                Objekti, gradovi, ponude
              </span>
            </span>
            <span className="bg-primary/8 text-primary group-active:bg-primary/12 inline-flex h-9 shrink-0 items-center rounded-full px-3 text-[10px] font-black tracking-[0.14em] uppercase transition-colors">
              {searchCta}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
