"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import type { Dict } from "@/lib/types";

type PlatformDeferredClientComponent = ComponentType<{ dict: Dict }>;

/**
 * Buyer-only interactive shell bootstraps are not required for first paint.
 */
export function PlatformDeferredClientLoader({ dict }: { dict: Dict }) {
  const [PlatformDeferredClient, setPlatformDeferredClient] =
    useState<PlatformDeferredClientComponent | null>(null);

  useEffect(() => {
    let active = true;

    void import("@/components/layout/PlatformDeferredClient").then((mod) => {
      if (active) {
        setPlatformDeferredClient(() => mod.PlatformDeferredClient);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return PlatformDeferredClient ? <PlatformDeferredClient dict={dict} /> : null;
}
