"use client";

import React from "react";
import Link from "next/link";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { Icon } from "@/components/ui/Icon";

/**
 * 🧭 BreadcrumbBar
 * Standalone full-width horizontal breadcrumb bar.
 * Fixed-positioned just below the top nav header (top-16 = 64px, same as header height).
 * Visible on ALL pages — defaults to a "Početna" home link when no page-specific
 * breadcrumbs are set via BreadcrumbInjector.
 */
export function BreadcrumbBar() {
  const { items, backHref } = useBreadcrumb();
  const hasItems = items.length > 0;

  // Always render at least the "Početna" (Home) breadcrumb
  const displayItems = hasItems
    ? items
    : [{ label: "Početna" as const, href: "/" as const }];
  const isLastItem = (idx: number) => idx === displayItems.length - 1;

  return (
    <div className="w-full border-b border-white/5 bg-background/98 backdrop-blur-[40px] sticky top-16 z-[100]">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-0 px-4 md:px-12 h-10">
        {/* Back button */}
        {backHref && (
          <Link
            href={backHref}
            className="shrink-0 flex items-center justify-center h-full pr-3 text-slate-400 hover:text-white border-r border-white/5 mr-3 transition-colors"
            aria-label="Nazad"
          >
            <Icon name="arrow_back" className="text-[14px]" />
            <span className="sr-only">Nazad</span>
          </Link>
        )}

        {/* Breadcrumb trail */}
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar w-full">
          {displayItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <Icon name="keyboard_arrow_right" className="text-[12px] text-slate-600 shrink-0 mx-1.5" />
              )}
              {item.href && !isLastItem(idx) ? (
                item.href === "/" ? (
                  <Link
                    href={item.href}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors shrink-0 flex items-center gap-1"
                    aria-label={item.label}
                  >
                    <Icon name="home" className="text-[12px]" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    {item.label}
                  </Link>
                )
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 whitespace-nowrap shrink-0">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
