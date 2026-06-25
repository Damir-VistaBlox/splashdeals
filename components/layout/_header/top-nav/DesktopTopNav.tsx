"use client";

import React from "react";
import { MegaMenu } from "../mega-menu/MegaMenu";
import { Logo } from "./Logo";

import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "./CartButton";


interface DesktopTopNavProps {
  cities: { id: string; name: string; slug: string }[];
  mounted: boolean;
  totalItems: number;
  isOnline: boolean;
  openCart: () => void;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
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
}: DesktopTopNavProps) {
  return (
    <div className="h-16 flex items-center w-full">
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
        {/* Left — MegaMenu (left-placed menus) */}
        <div className="flex-1 flex justify-start">
          <MegaMenu side="left" />
        </div>

        {/* Center — Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <Logo
            isTabActive={isTabActive}
            isReducedMotion={isReducedMotion}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        </div>

        {/* Right — MegaMenu (right-placed menus) + controls */}
        <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-3">
          <MegaMenu side="right" />
          <ThemeToggle />
          <CartButton
            isOnline={isOnline}
            mounted={mounted}
            totalItems={totalItems}
            openCart={openCart}
          />
        </div>
      </nav>
    </div>
  );
}
