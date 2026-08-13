import * as React from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { NavigationStructuredData } from "@/components/layout/_header/NavigationStructuredData";
import { BreadcrumbBar } from "@/components/layout/BreadcrumbBar";
import { GlobalAmbient } from "@/components/ui/GlobalAmbient";
import { CartLoader } from "@/components/cart/CartLoader";
import { CartStateBootstrap } from "@/components/cart/CartStateBootstrap";
import { FavoriteIntentBootstrap } from "@/components/account/FavoriteIntentBootstrap";
import { BottomNav } from "@/components/layout/BottomNav";
import type { Dict } from "@/lib/types";

const Footer = dynamic(() => import("@/components/layout/Footer").then((mod) => mod.Footer), {
  ssr: true,
});

interface FacilityMap {
  [slug: string]: { name: string; category: string };
}

/**
 * Shared buyer-facing chrome used by `(web)` and `(account)` route groups.
 * Keeps Header / Breadcrumb / Footer / BottomNav / cart bootstrap consistent.
 */
export function PlatformShell({
  children,
  dict,
  facilityMap = {},
  showBreadcrumb = true,
  showStructuredData = true,
}: {
  children: React.ReactNode;
  dict: Dict;
  facilityMap?: FacilityMap;
  showBreadcrumb?: boolean;
  showStructuredData?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden font-sans">
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:rounded-xl focus:px-4 focus:py-3 focus:text-xs focus:font-black focus:tracking-widest focus:uppercase focus:shadow-lg focus:outline-none"
      >
        {dict.layout?.skip_to_content || "Preskoči na sadržaj"}
      </a>
      <GlobalAmbient />
      {showStructuredData ? <NavigationStructuredData /> : null}
      <Header dict={dict} />
      {showBreadcrumb ? <BreadcrumbBar facilityMap={facilityMap} /> : null}
      <main
        id="main-content"
        className="relative flex-grow pt-[4.75rem] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pt-20 sm:pb-0"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),transparent)]" />
        <React.Suspense
          fallback={
            <div className="bg-muted flex flex-1 animate-pulse items-center justify-center p-20" />
          }
        >
          {children}
        </React.Suspense>
      </main>

      <Footer dict={dict} />
      <CartStateBootstrap />
      <FavoriteIntentBootstrap />
      <CartLoader />
      <BottomNav dict={dict} />
    </div>
  );
}
