"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";

/**
 * 🌊 Splashdeals Google Analytics 4 Script
 *
 * Injects the gtag script via @next/third-parties (Google's official
 * Next.js integration). Uses lazyOnload strategy — never blocks
 * rendering or interaction.
 *
 * Reads GA measurement ID from NEXT_PUBLIC_GA_MEASUREMENT_ID env var.
 * Returns null when the ID is not configured (safe for dev/preview).
 */
export function GAScript() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;

    const enable = () => setEnabled(true);
    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "submit"];
    const interactionOptions: AddEventListenerOptions = { passive: true };
    const onFirstInteraction = () => {
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, onFirstInteraction, interactionOptions),
      );
      window.clearTimeout(timeoutId);
      if (idleCallbackId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      enable();
    };

    let idleCallbackId: number | null = null;
    const timeoutId = globalThis.setTimeout(enable, 12000);

    if ("requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(enable, { timeout: 12000 });
    }

    interactionEvents.forEach((eventName) =>
      window.addEventListener(eventName, onFirstInteraction, interactionOptions),
    );

    return () => {
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, onFirstInteraction, interactionOptions),
      );
      if (idleCallbackId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      globalThis.clearTimeout(timeoutId);
    };
  }, [gaId]);

  if (!gaId) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[GA] NEXT_PUBLIC_GA_MEASUREMENT_ID not set — skipping");
    }
    return null;
  }

  if (!enabled) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
