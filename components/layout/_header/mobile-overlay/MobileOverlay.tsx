"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { MobileOverlayHeader } from "./MobileOverlayHeader";
import { MobileCityPicker } from "./MobileCityPicker";

interface City {
  id: string;
  name: string;
  slug: string;
}

interface MobileOverlayProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  dict: any;
  cities: City[];
  isReducedMotion: boolean;
  isTabActive: boolean;
}

export function MobileOverlay({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  dict,
  cities,
}: MobileOverlayProps) {
  const navLinks = [
    { name: dict.nav.explore, href: `/search`, icon: "search" },
    { name: dict.nav.waterparks || "Akva Parkovi", href: `/akva-parkovi`, icon: "location_on" },
    { name: dict.nav.deals || "Akcije", href: `/#deals`, icon: "shopping_bag" },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[1000] bg-navy-deep/95 backdrop-blur-3xl md:hidden flex flex-col p-8 overflow-hidden"
        >
          <MobileOverlayHeader onClose={() => setIsMobileMenuOpen(false)} />

          <div className="flex flex-col gap-6 overflow-hidden">
            {/* Explore First */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href={navLinks[0].href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4 hover:text-cyan-400 transition-colors"
              >
                <Icon name="search" className="text-[32px] text-cyan-500" />
                {navLinks[0].name}
              </Link>
            </motion.div>

            {/* Cities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MobileCityPicker
                cities={cities}
                dict={dict}
                onCitySelect={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>

            {/* Remaining Links */}
            {navLinks.slice(1).map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4 hover:text-cyan-400 transition-colors"
                >
                  <Icon name={link.icon} className="text-[32px] text-cyan-500" />
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <LiquidButton className="w-full h-14 text-base" onClick={() => setIsMobileMenuOpen(false)}>
              Get Your Pass
            </LiquidButton>
            <div className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
              Serbia&apos;s Best Water Parks
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
