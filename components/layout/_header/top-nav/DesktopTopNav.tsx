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
    <div className="w-full px-3 sm:px-4">
      <nav className="mx-auto grid h-[4.25rem] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 items-center justify-start overflow-hidden">
          <MegaMenu side="left" />
        </div>

        <div className="flex items-center justify-center px-2">
          <Logo
            isTabActive={isTabActive}
            isReducedMotion={isReducedMotion}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            dict={dict}
          />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1.5 overflow-hidden md:gap-2">
          <div className="hidden lg:block lg:w-[14rem] xl:w-[18rem]">
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
