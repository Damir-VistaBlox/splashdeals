"use client";

import React from "react";
import Link from "next/link";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { Icon } from "@/components/ui/Icon";

/**
 * 🧭 BreadcrumbBar
 * Standalone full-width horizontal breadcrumb bar.
 * Sticky-positioned just below the fixed header, visible on all screen sizes.
 * Reads breadcrumb data from the Zustand store (set via BreadcrumbInjector).
 */
export function BreadcrumbBar() {
  const { items, backHref } = useBreadcrumb();
  const hasItems = items.length > 0;

  if (!hasItems) return null;

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
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <Icon name="keyboard_arrow_right" className="text-[12px] text-slate-600 shrink-0 mx-1.5" />
              )}
              {item.href && idx < items.length - 1 ? (
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
