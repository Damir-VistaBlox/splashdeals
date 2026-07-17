"use client";

import type { DiscountInfo } from "@/lib/types/cart";

const PROMO_KEY = "sd_cart_promo";

function getSessionStorage(): Storage | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Client-side promo persistence for /cart remounts (sessionStorage).
 * Server also stores appliedPromo on cart session; this mirrors for instant restore.
 */
export function loadPersistedPromo(): DiscountInfo | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(PROMO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DiscountInfo;
    if (!parsed?.code || typeof parsed.discountPercent !== "number" || !parsed.campaignId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistPromo(discount: DiscountInfo | null): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    if (!discount) {
      storage.removeItem(PROMO_KEY);
      return;
    }
    storage.setItem(PROMO_KEY, JSON.stringify(discount));
  } catch {
    // ignore quota / private mode
  }
}

export function clearPersistedPromo(): void {
  persistPromo(null);
}
