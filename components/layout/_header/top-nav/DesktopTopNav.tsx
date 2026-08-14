"use client";

import { MegaMenu } from "../mega-menu/MegaMenu";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { AccountButton } from "./AccountButton";
import { useUIState } from "@/hooks/use-ui-state";
import { useServerCart } from "@/hooks/use-server-cart";
import type { Dict } from "@/lib/types";

interface DesktopTopNavProps {
  mounted: boolean;
  isOnline: boolean;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  dict: Dict;
}

export function DesktopTopNav({
  mounted,
  isOnline,
  isTabActive,
  isReducedMotion,
  isHovered,
  setIsHovered,
  dict,
}: DesktopTopNavProps) {
  const totalItems = useServerCart((state) => state.totalItems);
  const openCart = useUIState((state) => state.openCart);

  return (
    <div className="hidden w-full px-3 sm:px-4 md:block">
      <nav
        aria-label={dict?.mega_menu?.main_nav_aria || "Glavna navigacija"}
        className="mx-auto grid h-[4.4rem] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 xl:gap-4"
      >
        <div className="flex min-w-0 items-center justify-start overflow-hidden">
          <MegaMenu side="left" />
        </div>

        <div className="flex items-center justify-center">
          <Logo
            isTabActive={isTabActive}
            isReducedMotion={isReducedMotion}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            dict={dict}
          />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1.5 overflow-hidden md:gap-2">
          <MegaMenu side="right" />
          <AccountButton dict={dict} />
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
