"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { Dict } from "@/lib/types";

const DesktopTopNav = dynamic(() => import("./DesktopTopNav").then((mod) => mod.DesktopTopNav), {
  ssr: false,
  loading: () => null,
});

interface DeferredDesktopTopNavProps {
  mounted: boolean;
  isOnline: boolean;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  dict: Dict;
}

export function DeferredDesktopTopNav(props: DeferredDesktopTopNavProps) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const sync = () => setShouldRender(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return <DesktopTopNav {...props} />;
}
