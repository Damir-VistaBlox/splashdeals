"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

type BuyerSignalsComponent = ComponentType;

/**
 * Thin hydration bridge that defers analytics/vitals code until after the shell mounts.
 */
export function BuyerSignalsLoader() {
  const [Signals, setSignals] = useState<BuyerSignalsComponent | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll"];
    const interactionOptions: AddEventListenerOptions = { passive: true };

    const mountSignals = () => {
      if (!active) return;
      if (loadedRef.current) return;
      void import("@/components/analytics/BuyerSignals").then((mod) => {
        if (active) {
          loadedRef.current = true;
          setSignals(() => mod.BuyerSignals);
        }
      });
    };

    const onFirstInteraction = () => {
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, onFirstInteraction, interactionOptions),
      );
      window.clearTimeout(timeoutId);
      mountSignals();
    };

    const timeoutId = window.setTimeout(mountSignals, 25000);
    interactionEvents.forEach((eventName) =>
      window.addEventListener(eventName, onFirstInteraction, interactionOptions),
    );

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, onFirstInteraction, interactionOptions),
      );
    };
  }, []);

  return Signals ? <Signals /> : null;
}
