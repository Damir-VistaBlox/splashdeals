"use client";

import { useCart } from "@/hooks/use-cart";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => ({ default: mod.CartDrawer })),
  { ssr: false },
);

/**
 * 🛒 CartLoader
 *
 * Only loads the CartDrawer chunk when the cart actually has items.
 * On first visit with empty cart, the ~23KiB drawer chunk is never requested.
 * As soon as the user adds a ticket, it lazy-loads in the background.
 */
export function CartLoader() {
  const items = useCart((state) => state.items);
  const hasItems = items.length > 0;

  if (!hasItems) return null;

  return (
    <Suspense fallback={null}>
      <CartDrawer />
    </Suspense>
  );
}
