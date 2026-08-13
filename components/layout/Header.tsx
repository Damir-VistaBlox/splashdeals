"use client";

import React from "react";
import { useUIState } from "@/hooks/use-ui-state";
import { useHeaderScroll, DesktopTopNav } from "./_header";
import { useServerCart } from "@/hooks/use-server-cart";
import type { Dict } from "@/lib/types";

interface HeaderProps {
  dict: Dict;
}

/**
 * Fixed site header (z-[999]).
 * Stacking contract with BottomNav (z-[998]) and facility sticky mini-cart (z-[999]).
 */
export const Header = ({ dict }: HeaderProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const totalItems = useServerCart((state) => state.totalItems);
  const openCart = useUIState((state) => state.openCart);

  const { scrolled, isOnline, isTabActive, isReducedMotion, mounted } = useHeaderScroll();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[999] px-3 pt-2 transition-[padding] duration-500 sm:px-6 sm:pt-3 md:px-8 ${
        scrolled ? "sm:pt-2" : "sm:pt-3"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl rounded-[1.75rem] border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "public-panel border-white/65 shadow-[0_20px_60px_rgba(18,59,96,0.12)]"
            : "border-white/55 bg-white/66 shadow-[0_18px_42px_rgba(18,59,96,0.08)] backdrop-blur-2xl"
        }`}
      >
        <DesktopTopNav
          mounted={mounted}
          totalItems={totalItems}
          isOnline={isOnline}
          openCart={openCart}
          isTabActive={isTabActive}
          isReducedMotion={isReducedMotion}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          dict={dict}
        />
      </div>

      {isOnline === false && <div className="hidden" role="status" aria-label="offline" />}
    </header>
  );
};
