"use client";

import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";

interface UseHeaderScrollReturn {
  headerBg: any;
  headerBlur: any;
  headerBorder: any;
  headerHeight: any;
  isOnline: boolean;
  isTabActive: boolean;
  isReducedMotion: boolean;
  mounted: boolean;
  scrollY: any;
}

export function useHeaderScroll(): UseHeaderScrollReturn {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
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

    if (typeof window !== "undefined") {
      // 1. Online/Offline Event Monitoring
      Promise.resolve().then(() => { if (!navigator.onLine) setIsOnline(false); });
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 2. Page Visibility API
      const handleVisibility = () => setIsTabActive(document.visibilityState === "visible");
      document.addEventListener("visibilitychange", handleVisibility);

      // 3. Network Information API (Save Data Protocol)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection?.saveData) Promise.resolve().then(() => setIsReducedMotion(true));

      // 4. Prefers Reduced Motion Media API
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) Promise.resolve().then(() => setIsReducedMotion(true));

      return () => {
        cancelAnimationFrame(timer);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }

    return () => {
      cancelAnimationFrame(timer);
    };
  }, []);

  return {
    headerBg,
    headerBlur,
    headerBorder,
    headerHeight,
    isOnline,
    isTabActive,
    isReducedMotion,
    mounted,
    scrollY,
  };
}
