"use client";

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
  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3 px-3 pt-2 pb-3">
        <Logo
          isTabActive={isTabActive}
          isReducedMotion={isReducedMotion}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          dict={dict}
          mobileCompact
        />
        <Link
          href="/search"
          className="group ring-border/50 flex min-h-[3.25rem] min-w-0 flex-1 items-center gap-3 rounded-[1.35rem] bg-gradient-to-r from-white/84 to-white/68 px-4 shadow-[0_16px_30px_rgba(15,23,42,0.08)] ring-1 backdrop-blur-xl transition-transform duration-200 active:scale-[0.99]"
          aria-label={dict.nav.search || "Pretraga"}
        >
          <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl">
            <Icon name="search" className="text-[18px]" />
          </span>
          <div className="min-w-0">
            <span className="text-foreground block truncate text-sm font-black tracking-[-0.03em]">
              Pretraži ponude
            </span>
            <span className="text-muted-foreground block truncate text-[11px] font-bold tracking-[0.1em] uppercase">
              Akva parkovi, bazeni, wellness
            </span>
          </div>
          <Icon
            name="arrow_forward"
            className="text-muted-foreground group-hover:text-primary ml-auto shrink-0 text-[18px] transition-colors"
          />
        </Link>
      </div>
    </div>
  );
}
