"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Dict } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface FacilityMap {
  [slug: string]: {
    name: string;
    category: string; // DB category value (e.g. "Akva Park")
  };
}

/**
 * 🧭 BreadcrumbBar
 * Derives breadcrumb trail from the current URL pathname.
 * Mobile: simplified trail (home + current) with ≥44px touch targets (facility audit #658).
 */
export function BreadcrumbBar({
  dict,
  facilityMap = {},
}: {
  dict: Dict;
  facilityMap?: FacilityMap;
}) {
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split("/").filter(Boolean), [pathname]);
  const firstSegment = segments[0]?.toLowerCase();
  const hideBreadcrumb =
    !pathname ||
    pathname === "/" ||
    pathname === "/prijava" ||
    pathname === "/moje-karte" ||
    pathname.startsWith("/moje-karte/") ||
    pathname === "/omiljeni" ||
    pathname === "/nalog" ||
    pathname === "/moje-recenzije" ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/") ||
    pathname === "/search" ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/success" ||
    Boolean(firstSegment && facilityMap[firstSegment]);

  const STATIC_LABELS = useMemo(() => {
    const bc = dict?.breadcrumb;
    if (!bc) return null;
    return {
      "how-it-works": bc.how_it_works || "Kako Funkcioniše",
      terms: bc.terms || "Uslovi Korišćenja",
      privacy: bc.privacy || "Privatnost",
      support: bc.support || "Podrška",
      cookies: bc.cookies || "Kolačići",
      cart: bc.cart || "Korpa",
      checkout: bc.checkout || "Plaćanje",
      search: bc.search || "Pretraga",
      success: bc.success || "Uspešna Porudžbina",
      blog: bc.blog || "Blog",
      prijava: bc.prijava || "Prijava",
      "moje-karte": bc.moje_karte || "Moje karte",
      omiljeni: bc.omiljeni || "Omiljeni",
      nalog: bc.nalog || "Nalog",
      "moje-recenzije": bc.moje_recenzije || "Moje recenzije",
      orders: bc.orders || "Porudžbina",
    } as Record<string, string>;
  }, [dict]);

  const CATEGORY_NAMES = useMemo(() => {
    const cats = dict?.breadcrumb?.categories;
    if (!cats) return null;
    return {
      "akva-parkovi": cats.akva_parkovi || "Akva Parkovi",
      "termalne-rivijere": cats.termalne_rivijere || "Termalne Rivijere",
      bazeni: cats.bazeni || "Bazeni",
      banje: cats.banje || "Banje",
      "wellness-i-spa": cats.wellness_i_spa || "Wellness i Spa",
      jezera: cats.jezera || "Jezera",
      "plaze-i-kupalista": cats.plaze_i_kupalista || "Plaže i Kupališta",
      "vodeni-sportovi": cats.vodeni_sportovi || "Vodeni Sportovi",
    } as Record<string, string>;
  }, [dict]);

  const trail = useMemo<{ items: BreadcrumbItem[]; backHref?: string }>(() => {
    const items: BreadcrumbItem[] = [{ label: dict?.breadcrumb?.home || "Početna", href: "/" }];
    let backHref: string | undefined;

    if (segments.length >= 1) {
      const slug = segments[0].toLowerCase();

      if (STATIC_LABELS?.[slug]) {
        if (slug === "moje-karte" && segments[1]?.toLowerCase() === "istorija") {
          items.push({
            label: STATIC_LABELS["moje-karte"],
            href: "/moje-karte",
          });
          items.push({ label: dict?.breadcrumb?.istorija || "Istorija kupovina" });
          backHref = "/moje-karte";
        } else if (slug === "orders" && segments[1]) {
          items.push({ label: STATIC_LABELS.orders });
          backHref = "/moje-karte/istorija";
        } else {
          items.push({ label: STATIC_LABELS[slug] });
          if (slug === "prijava") backHref = "/";
        }
      } else if (CATEGORY_NAMES?.[slug]) {
        items.push({ label: CATEGORY_NAMES[slug] });
      } else if (facilityMap[slug]) {
        const fac = facilityMap[slug];
        const dbLower = fac.category.toLowerCase();
        const DB_TO_SLUG: Record<string, string> = {
          "akva park": "akva-parkovi",
          "termalna rivijera": "termalne-rivijere",
          bazen: "bazeni",
          "otvoreni bazen": "bazeni",
          "zatvoreni bazen": "bazeni",
          "javni bazen": "bazeni",
          banja: "banje",
          "wellness i spa": "wellness-i-spa",
          jezero: "jezera",
          "gradska plaza": "plaze-i-kupalista",
          kupaliste: "plaze-i-kupalista",
          reka: "plaze-i-kupalista",
          "vodeni sport": "vodeni-sportovi",
          rafting: "vodeni-sportovi",
        };
        const catSlug = DB_TO_SLUG[dbLower];
        const catName = catSlug && CATEGORY_NAMES ? CATEGORY_NAMES[catSlug] : fac.category;

        if (catSlug) {
          items.push({ label: catName, href: `/${catSlug}` });
        } else {
          items.push({ label: catName });
        }
        items.push({ label: fac.name });
        backHref = catSlug ? `/${catSlug}` : "/";
      }
    }

    return { items, backHref };
  }, [segments, facilityMap, dict, STATIC_LABELS, CATEGORY_NAMES]);

  const { items, backHref } = trail;

  // Mobile: Početna › current only (hide middle category crumb) — H1/M1
  const mobileItems = useMemo(() => {
    if (items.length <= 2) return items;
    return [items[0], items[items.length - 1]];
  }, [items]);

  const linkClass =
    "text-muted-foreground hover:text-primary inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md px-1.5 text-xs font-bold tracking-wider uppercase transition-colors";
  const currentClass =
    "text-primary inline-flex min-h-11 shrink-0 items-center text-xs font-black tracking-wider uppercase";

  const renderTrail = (trailItems: BreadcrumbItem[]) =>
    trailItems.map((item, idx) => {
      const last = idx === trailItems.length - 1;
      return (
        <div key={`${item.label}-${idx}`} className="flex items-center">
          {idx > 0 && (
            <Icon
              name="keyboard_arrow_right"
              className="text-muted-foreground mx-0.5 shrink-0 text-[14px]"
              aria-hidden
            />
          )}
          {item.href && !last ? (
            item.href === "/" ? (
              <Link href={item.href} className={linkClass} aria-label={item.label}>
                <Icon name="home" className="text-[14px]" aria-hidden />
                <span className="max-w-[6rem] truncate md:max-w-none">{item.label}</span>
              </Link>
            ) : (
              <Link
                href={item.href}
                className={cn(linkClass, "max-w-[8rem] truncate md:max-w-none")}
              >
                {item.label}
              </Link>
            )
          ) : (
            <span
              className={cn(currentClass, "max-w-[11rem] truncate md:max-w-none")}
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </div>
      );
    });

  if (hideBreadcrumb) return null;

  return (
    <div className="sticky top-[var(--mobile-breadcrumb-offset)] z-[100] px-3 pt-2 sm:top-[5.35rem] sm:px-6 md:px-8">
      <div className="public-panel relative mx-auto flex min-h-12 w-full max-w-7xl items-center gap-0 overflow-hidden rounded-[1.4rem] px-3.5 shadow-[0_16px_32px_rgba(15,23,42,0.06)] md:min-h-11 md:px-6 md:shadow-none">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white via-white/88 to-transparent md:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white via-white/88 to-transparent md:hidden"
        />
        {backHref && (
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground border-border/50 bg-background/72 mr-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-r pr-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-colors md:mr-3 md:rounded-none md:border-0 md:border-r md:bg-transparent md:pr-3 md:shadow-none"
            aria-label={dict?.breadcrumb?.back_aria || "Nazad"}
          >
            <Icon name="arrow_back" className="text-[18px]" />
            <span className="sr-only">{dict?.breadcrumb?.back_aria || "Nazad"}</span>
          </Link>
        )}

        <nav
          aria-label="Putanja"
          className="no-scrollbar flex w-full items-center gap-0 overflow-x-auto pr-2 md:hidden"
        >
          {renderTrail(mobileItems)}
        </nav>

        <nav
          aria-label="Putanja"
          className="no-scrollbar hidden w-full items-center gap-0 overflow-x-auto md:flex"
        >
          {renderTrail(items)}
        </nav>
      </div>
    </div>
  );
}
