"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";

// ── Static page labels ─────────────────────────────────────────────
const STATIC_LABELS: Record<string, string> = {
  "how-it-works": "Kako Funcioniše",
  terms: "Uslovi Korišćenja",
  privacy: "Privatnost",
  support: "Podrška",
  cookies: "Kolačići",
  cart: "Korpa",
  checkout: "Plaćanje",
  search: "Pretraga",
  success: "Uspešna Porudžbina",
  blog: "Blog",
};

// ── Known category slugs → display names ───────────────────────────
const CATEGORY_NAMES: Record<string, string> = {
  "akva-parkovi": "Akva Parkovi",
  "termalne-rivijere": "Termalne Rivijere",
  bazeni: "Bazeni",
  banje: "Banje",
  "wellness-i-spa": "Wellness i Spa",
  jezera: "Jezera",
  "plaze-i-kupalista": "Plaže i Kupališta",
  "vodeni-sportovi": "Vodeni Sportovi",
};

// ── DB values → category slug lookup ───────────────────────────────
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
 * Uses an embedded facility map (pre-fetched by the server) for facility lookups.
 */
export function BreadcrumbBar({ facilityMap = {} }: { facilityMap?: FacilityMap }) {
  const pathname = usePathname();
  const trail = useMemo<{ items: BreadcrumbItem[]; backHref?: string }>(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: "Početna", href: "/" }];
    let backHref: string | undefined;

    if (segments.length >= 1) {
      const slug = segments[0].toLowerCase();

      if (STATIC_LABELS[slug]) {
        items.push({ label: STATIC_LABELS[slug] });
      } else if (CATEGORY_NAMES[slug]) {
        items.push({ label: CATEGORY_NAMES[slug] });
      } else if (facilityMap[slug]) {
        const fac = facilityMap[slug];
        // Map DB category value → slug → display name
        const catSlug = DB_TO_SLUG[fac.category.toLowerCase()];
        const catName = catSlug ? CATEGORY_NAMES[catSlug] : fac.category;

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
  }, [pathname, facilityMap]);

  const { items, backHref } = trail;
  const isLastItem = (idx: number) => idx === items.length - 1;

  return (
    <div className="bg-background/98 sticky top-16 z-[100] w-full border-b border-white/5 backdrop-blur-[40px]">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center gap-0 px-4 md:px-12">
        {/* Back button */}
        {backHref && (
          <Link
            href={backHref}
            className="mr-3 flex h-full shrink-0 items-center justify-center border-r border-white/5 pr-3 text-slate-400 transition-colors hover:text-white"
            aria-label="Nazad"
          >
            <Icon name="arrow_back" className="text-[14px]" />
            <span className="sr-only">Nazad</span>
          </Link>
        )}

        {/* Breadcrumb trail */}
        <div className="no-scrollbar flex w-full items-center gap-0 overflow-x-auto">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center">
              {idx > 0 && (
                <Icon
                  name="keyboard_arrow_right"
                  className="mx-1.5 shrink-0 text-[12px] text-slate-600"
                />
              )}
              {item.href && !isLastItem(idx) ? (
                item.href === "/" ? (
                  <Link
                    href={item.href}
                    className="flex shrink-0 items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-colors hover:text-cyan-400"
                    aria-label={item.label}
                  >
                    <Icon name="home" className="text-[12px]" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="shrink-0 text-[10px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase transition-colors hover:text-cyan-400"
                  >
                    {item.label}
                  </Link>
                )
              ) : (
                <span className="shrink-0 text-[10px] font-black tracking-wider whitespace-nowrap text-cyan-400 uppercase">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
