"use client";

import { useEffect, useRef, useState } from "react";

function getInitialAllowHDMedia() {
  if (typeof navigator === "undefined" || !("connection" in navigator)) return true;

  const conn = (
    navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;

  if (!conn) return true;

  return !(conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
}

export function HeroVideoEnhancer({ src, poster }: { src: string; poster?: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canEnable = getInitialAllowHDMedia();
    if (!canEnable) return;

    const timer = window.setTimeout(() => setEnabled(true), 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibility = () => {
      if (!videoRef.current) return;

      if (document.hidden) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover brightness-75 transition-opacity duration-500"
      poster={poster || undefined}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
