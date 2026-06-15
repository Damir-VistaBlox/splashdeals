"use client";
import { Icon } from "@/components/ui/Icon";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useUIState } from "@/hooks/use-ui-state";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { MegaMenu } from "./header/MegaMenu";
import { cn } from "@/lib/utils";

import { initCartSync } from "@/hooks/use-cart";

interface HeaderProps {
  
  dict: any; // Explicitly passed from server
  cities: { id: string; name: string; slug: string }[];
}

export const Header = ({ dict, cities }: HeaderProps) => {
  const { items: breadcrumbItems, backHref } = useBreadcrumb();
  const hasBreadcrumbs = breadcrumbItems.length > 0;
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openCart = useUIState((state) => state.openCart);
  const totalItems = useCart((state) => state.getTotalItems());

  // ⚡ Deep Hardware & API Matrix
  const [isOnline, setIsOnline] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  const headerHeight = useTransform(scrollY, [0, 100], ["5rem", "4rem"]);
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(2, 6, 23, 0.95)", "rgba(2, 6, 23, 0.98)"]
  );
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(20px)", "blur(40px)"]);
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.12)"]
  );

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    const cleanupSync = initCartSync();

    if (typeof window !== "undefined") {
      // 📡 1. Online/Offline Event Monitoring
      Promise.resolve().then(() => { if (!navigator.onLine) setIsOnline(false); });
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 👁️ 2. Page Visibility API - Conserves GPU/CPU when tab is inactive
      const handleVisibility = () => setIsTabActive(document.visibilityState === "visible");
      document.addEventListener("visibilitychange", handleVisibility);

      // 📶 3. Network Information API (Save Data Protocol)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection?.saveData) Promise.resolve().then(() => setIsReducedMotion(true));

      // 🌓 4. Prefers Reduced Motion Media API
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) Promise.resolve().then(() => setIsReducedMotion(true));

      return () => {
        cancelAnimationFrame(timer);
        cleanupSync();
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }

    return () => {
      cancelAnimationFrame(timer);
      cleanupSync();
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const sortedCities = React.useMemo(() => {
    if (!cities || !Array.isArray(cities)) return [];
    const popularSlugs = ["beograd", "novi-sad", "jagodina", "vrnjacka-banja", "subotica"];
    const popular = cities.filter(c => popularSlugs.includes(c.slug.toLowerCase()));
    const others = cities.filter(c => !popularSlugs.includes(c.slug.toLowerCase()));
    return [...popular, ...others];
  }, [cities]);

  const navLinks = [
    { name: dict.nav.explore, href: `/search`, icon: "search" },
    { name: dict.nav.waterparks || "Akva Parkovi", href: `/akva-parkovi`, icon: "location_on" },
    { name: dict.nav.deals || "Akcije", href: `/#deals`, icon: "shopping_bag" },
  ];

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
          backdropFilter: headerBlur,
          borderColor: headerBorder,
          zIndex: 999,
        }}
        className="fixed top-0 inset-x-0 z-[999] border-b transition-colors duration-500 flex flex-col justify-center px-4 md:px-12"
      >
        {/* Main nav row */}
        <div className="h-16 flex items-center w-full">
          <nav className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* 🔡 High-Impact Wordmark Logo */}
          <Link 
            href={``} 
            className="group flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={cn(
              "flex items-center tracking-[-0.08em] select-none",
              (isTabActive && !isReducedMotion) ? "animate-float group-hover:[animation-play-state:paused]" : ""
            )}>
              <div className="relative overflow-hidden group/logo">
                <span className="text-2xl md:text-3xl font-black italic uppercase text-splash relative z-10">
                  Splash
                </span>
                {/* ⚡ Composited Glint Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none translate-x-[-100%] group-hover/logo:animate-logo-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
              </div>

              <div className="relative">

                
                {/* 🌊 Interactive Water Splash Particles - Throttled by Hardware Profile */}
                <AnimatePresence mode="popLayout">
                  {(isHovered && !isReducedMotion) && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={`drop-${i}`}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0], 
                            scale: [0, 1.2, 0.4],
                            x: ((i * 37) % 80) - 40,
                            y: ((i * 41) % 70) - 45,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.8, 
                            ease: "easeOut",
                            delay: i * 0.01 
                          }}
                          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px]"
                        />
                      ))}
                      {/* Ripple Effect */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.4, 0], scale: 2.5 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-cyan-400/30 rounded-xl blur-lg"
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              <span className="text-2xl md:text-3xl font-black italic uppercase text-white group-hover:text-cyan-50 transition-colors -ml-1">
                deals
              </span>
              <div className="relative ml-1 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[2px] animate-ping opacity-50" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse delay-75 scale-150 opacity-20 pointer-events-none group-hover:scale-[3] transition-transform duration-500" />
              </div>
            </div>
          </Link>

          {/* 🏙️ Desktop Nav - Mega Menu Discovery Hub */}
          <React.Suspense fallback={<DesktopNavSkeleton />}>
            <MegaMenu dict={dict} />
          </React.Suspense>

          {/* 🛡️ Actions */}
          <div className="flex items-center gap-1.5 md:gap-3">
             <LiquidButton variant="ghost" size="sm" className="px-4 h-11 font-medium" aria-label={dict.nav.account || "Moj Nalog"}>
                <Icon name="person" className="text-[16px] text-cyan-500" />
                <span className="hidden lg:inline ml-2">{dict.nav.account || "Moj Nalog"}</span>
             </LiquidButton>

             <div className="relative flex items-center gap-2">
                {/* 🚨 5. HTML5 Offline Indicator - Native Connectivity Feedback */}
                <AnimatePresence>
                  {!isOnline && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: 10 }}
                      className="flex items-center gap-1.5 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded-lg text-[9px] font-black text-destructive uppercase tracking-wider shadow-lg"
                    >
                      <Icon name="cloud_off" className="text-[12px] animate-pulse" />
                      {dict.nav.offline || "Nema Mreže"}
                    </motion.div>
                  )}
                </AnimatePresence>

                <LiquidButton 
                  variant="primary" 
                  size="sm" 
                  className={cn(
                    "px-5 group h-11 transition-all",
                    !isOnline && "opacity-50 grayscale cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!isOnline) return;
                    openCart();
                    if ("vibrate" in navigator) navigator.vibrate(10);
                  }}
                  aria-label={isOnline ? `Otvorite korpu - ${totalItems}` : (dict.nav.offline || "Nema Mreže")}
                >
                  <div className="relative">
                    <Icon name="shopping_bag" className="text-[16px]" />
                    {(mounted && totalItems > 0) && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-white text-navy-deep text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </div>
                  <span className="hidden sm:inline">{dict.nav.checkout || "Kasa"}</span>
                </LiquidButton>
             </div>

             <button 
               onClick={() => {
                 setIsMobileMenuOpen(!isMobileMenuOpen);
                 if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
               }}
               className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-white/80 active:scale-90 hover:bg-white/10 hover:border-cyan-500/20 active:bg-cyan-500/20 active:border-cyan-500/30 transition-all duration-300 shadow-md shadow-black/10 relative overflow-hidden"
               aria-label={isMobileMenuOpen ? "Zatvori meni" : "Otvori meni"}
             >
               {isMobileMenuOpen ? <Icon name="close" className="text-[20px] text-cyan-400" /> : <Icon name="menu" className="text-[20px] text-cyan-400" />}
             </button>
          </div>
          </nav>
        </div>

        {/* 🧭 Mobile Breadcrumb Sub-Row — only when page injects breadcrumbs */}
        <AnimatePresence>
          {hasBreadcrumbs && (
            <motion.div
              key="breadcrumb-row"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden md:hidden w-full border-t border-white/5"
            >
              <div className="max-w-7xl mx-auto w-full flex items-center gap-0 px-0 py-0 h-9">
                {/* Back button */}
                {backHref && (
                  <Link
                    href={backHref}
                    className="shrink-0 flex items-center justify-center h-full px-4 text-slate-400 hover:text-white border-r border-white/5 transition-colors active:bg-white/5"
                    aria-label="Nazad"
                  >
                    <Icon name="arrow_back" className="text-[14px]" />
                    <span className="sr-only">Nazad</span>
                  </Link>
                )}

                {/* Scrollable breadcrumb trail */}
                <div className="flex-1 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-0 whitespace-nowrap px-3 h-9">
                    {breadcrumbItems.map((item, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && (
                          <Icon name="keyboard_arrow_right" className="text-[12px] text-slate-600 shrink-0 mx-1" />
                        )}
                        {item.href && idx < breadcrumbItems.length - 1 ? (
                          item.href === "/" ? (
                            <Link
                              href={item.href}
                              className="text-[14px] text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1.5 inline-flex items-center justify-center min-w-[36px]"
                              aria-label={item.label}
                            >
                              <Icon name="home" />
                              <span className="sr-only">{item.label}</span>
                            </Link>
                          ) : (
                            <Link
                              href={item.href}
                              className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors px-0.5"
                            >
                              {item.label}
                            </Link>
                          )
                        ) : (
                          item.href === "/" ? (
                            <span className="text-[14px] text-cyan-400 px-2 py-1.5 inline-flex items-center justify-center min-w-[36px]">
                              <Icon name="home" />
                              <span className="sr-only">{item.label}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 px-0.5">
                              {item.label}
                            </span>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 📱 Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1000] bg-navy-deep/95 backdrop-blur-3xl md:hidden flex flex-col p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center tracking-[-0.1em] select-none animate-float">
                 <div className="relative overflow-hidden group/logo">
                  <span className="text-2xl md:text-3xl font-black italic uppercase text-splash relative z-10">
                    Splash
                  </span>
                  {/* ⚡ Composited Glint Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none translate-x-[-100%] group-hover/logo:animate-logo-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                </div>
                 <span className="text-3xl md:text-4xl font-black italic uppercase text-white -ml-1">
                   deals
                 </span>
                 <div className="relative ml-1 mt-4">
                   <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                   <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 blur-[2px] animate-ping opacity-50" />
                 </div>
               </div>
               <button 
                 onClick={() => setIsMobileMenuOpen(false)} 
                 className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-white/80 active:scale-90 hover:bg-white/10 hover:border-cyan-500/20 active:bg-cyan-500/20 active:border-cyan-500/30 transition-all duration-300 shadow-md shadow-black/10"
                 aria-label="Zatvori meni"
               >
                 <Icon name="close" className="text-[20px] text-cyan-400" />
               </button>
            </div>

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
                 className="space-y-3"
               >
                 <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                   <Icon name="location_on" className="text-[14px] text-slate-600" />
                   {dict.nav.cities}
                 </div>
                 
                 <div className="relative w-full">
                    {/* Right gradient fade overlay to show scroll availability */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-navy-deep to-transparent pointer-events-none z-10" />
                    
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 scroll-smooth select-none cursor-grab active:cursor-grabbing w-full px-1">
                      {sortedCities.map((city) => {
                        const popularSlugs = ["beograd", "novi-sad", "jagodina", "vrnjacka-banja", "subotica"];
                        const isPopular = popularSlugs.includes(city.slug.toLowerCase());
                        return (
                          <Link
                            key={city.id}
                            href={`/search?q=${encodeURIComponent(city.name)}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "shrink-0 h-10 px-4 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 border",
                              isPopular 
                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.05)] hover:bg-cyan-500/20 hover:border-cyan-500/40" 
                                : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10"
                            )}
                          >
                            {isPopular && <Icon name="auto_awesome" className="text-[12px] mr-1.5 text-cyan-400" />}
                            {city.name}
                          </Link>
                        );
                      })}
                      <Link
                        href={`/`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="shrink-0 h-10 px-5 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest bg-white/5 border border-dashed border-white/15 text-cyan-500/80 hover:text-cyan-400 hover:border-cyan-500/30 transition-all active:scale-95"
                      >
                        {dict.nav.all_regions || "Sve Regije"}
                      </Link>
                    </div>
                 </div>
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
    </>
  );
};

const DesktopNavSkeleton = () => (
  <div className="hidden md:flex items-center bg-white/[0.03] border border-white/10 rounded-full h-12 w-32 animate-pulse" />
);
