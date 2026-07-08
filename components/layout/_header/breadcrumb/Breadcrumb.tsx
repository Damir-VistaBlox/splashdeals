"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  breadcrumbItems: BreadcrumbItem[];
  backHref?: string;
  hasBreadcrumbs: boolean;
}

export function Breadcrumb({ breadcrumbItems, backHref, hasBreadcrumbs }: BreadcrumbProps) {
  return (
    <>
      {hasBreadcrumbs && (
        <div className="w-full overflow-hidden border-t border-white/5 transition-all duration-200 md:hidden">
          <div className="mx-auto flex h-9 w-full max-w-7xl items-center gap-0 px-0 py-0">
            {/* Back button */}
            {backHref && (
              <Link
                href={backHref}
                className="flex h-full shrink-0 items-center justify-center border-r border-white/5 px-4 text-slate-400 transition-colors hover:text-white active:bg-white/5"
                aria-label="Nazad"
              >
                <Icon name="arrow_back" className="text-[14px]" />
                <span className="sr-only">Nazad</span>
              </Link>
            )}

            {/* Scrollable breadcrumb trail */}
            <div className="no-scrollbar flex-1 overflow-x-auto">
              <div className="flex h-9 items-center gap-0 px-3 whitespace-nowrap">
                {breadcrumbItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <Icon
                        name="keyboard_arrow_right"
                        className="mx-1 shrink-0 text-[12px] text-slate-600"
                      />
                    )}
                    {item.href && idx < breadcrumbItems.length - 1 ? (
                      item.href === "/" ? (
                        <Link
                          href={item.href}
                          className="inline-flex min-w-[36px] items-center justify-center px-2 py-1.5 text-[14px] text-slate-400 transition-colors hover:text-cyan-400"
                          aria-label={item.label}
                        >
                          <Icon name="home" />
                          <span className="sr-only">{item.label}</span>
                        </Link>
                      ) : (
                        <Link
                          href={item.href}
                          className="px-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-colors hover:text-cyan-400"
                        >
                          {item.label}
                        </Link>
                      )
                    ) : item.href === "/" ? (
                      <span className="inline-flex min-w-[36px] items-center justify-center px-2 py-1.5 text-[14px] text-cyan-400">
                        <Icon name="home" />
                        <span className="sr-only">{item.label}</span>
                      </span>
                    ) : (
                      <span className="px-0.5 text-[10px] font-black tracking-wider text-cyan-400 uppercase">
                        {item.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
