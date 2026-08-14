"use client";

import dynamic from "next/dynamic";
import type { Dict } from "@/lib/types";

const CartStateBootstrap = dynamic(
  () => import("@/components/cart/CartStateBootstrap").then((mod) => mod.CartStateBootstrap),
  { ssr: false },
);
const FavoriteIntentBootstrap = dynamic(
  () =>
    import("@/components/account/FavoriteIntentBootstrap").then(
      (mod) => mod.FavoriteIntentBootstrap,
    ),
  { ssr: false },
);
const CartLoader = dynamic(
  () => import("@/components/cart/CartLoader").then((mod) => mod.CartLoader),
  {
    ssr: false,
  },
);
const BottomNav = dynamic(
  () => import("@/components/layout/BottomNav").then((mod) => mod.BottomNav),
  {
    ssr: false,
  },
);

/**
 * Defers buyer-shell interactive bootstraps and mobile nav until after initial render.
 * Keeps public/account chrome functional while trimming first-load JS on landing pages.
 */
export function PlatformDeferredClient({ dict }: { dict: Dict }) {
  return (
    <>
      <CartStateBootstrap />
      <FavoriteIntentBootstrap />
      <CartLoader />
      <BottomNav dict={dict} />
    </>
  );
}
