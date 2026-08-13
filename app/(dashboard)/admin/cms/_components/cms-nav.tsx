"use client";

import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CMS_NAV, isCmsNavActive } from "../_lib/cms-nav";
import { cn } from "@/lib/utils";

export function CmsNav() {
  const pathname = usePathname() || "";

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground flex items-center gap-2 px-1 text-[10px] font-black tracking-[0.2em] uppercase">
        <Icon name="article" className="text-primary text-[14px]" />
        Sadržaj i operacije
      </div>
      <nav
        aria-label="CMS navigacija"
        className="border-border/60 bg-muted/20 no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-xl border p-1"
      >
        {CMS_NAV.map((item) => {
          const active = isCmsNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold tracking-wide whitespace-nowrap uppercase transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background hover:text-foreground",
              )}
            >
              <Icon name={item.icon} className="text-[14px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
