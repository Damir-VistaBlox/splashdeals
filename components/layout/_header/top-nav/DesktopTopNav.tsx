"use client";

import { MegaMenu } from "../mega-menu/MegaMenu";
import { Logo } from "./Logo";

import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { SearchBox } from "@/app/(web)/_components/SearchBox";
import type { Dict } from "@/lib/types";

interface DesktopTopNavProps {
  mounted: boolean;
  totalItems: number;
  isOnline: boolean;
  openCart: () => void;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  dict: Dict;
}

export function DesktopTopNav({
  mounted,
  totalItems,
  isOnline,
  openCart,
  isTabActive,
  isReducedMotion,
  isHovered,
  setIsHovered,
  dict,
}: DesktopTopNavProps) {
  return (
    <div className="flex h-[4.25rem] w-full items-center px-3 sm:px-4">
      <nav className="relative mx-auto flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 justify-start">
          <MegaMenu side="left" />
        </div>

        <div className="absolute left-1/2 z-10 -translate-x-1/2">
          <Logo
            isTabActive={isTabActive}
            isReducedMotion={isReducedMotion}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            dict={dict}
          />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 md:gap-2.5">
          <div className="hidden md:block md:w-[18rem] lg:w-[22rem]">
            <SearchBox dict={dict as Record<string, any>} />
          </div>
          <MegaMenu side="right" />
          <AccountButton dict={dict} />
          <ThemeToggle dict={dict} />
          <CartButton
            isOnline={isOnline}
            mounted={mounted}
            totalItems={totalItems}
            openCart={openCart}
            dict={dict}
          />
        </div>
      </nav>
    </div>
  );
}
