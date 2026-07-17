"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => ({ default: mod.CartDrawer })),
  { ssr: false },
);

/**
 * 🛒 CartLoader
 *
 * Lazy-loads the CartDrawer chunk only (desktop preview).
 * Badge/hydration + guest claim live in CartStateBootstrap (web shell).
 */
export function CartLoader() {
  return (
    <Suspense fallback={null}>
      <CartDrawer />
    </Suspense>
  );
}
