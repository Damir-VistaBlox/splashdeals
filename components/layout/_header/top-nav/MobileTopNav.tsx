"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import type { Dict } from "@/lib/types";

interface MobileTopNavProps {
  dict: Dict;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
}

type SearchResult = {
  id: string;
  href: string;
  type: "facility";
  title: string;
  subtitle: string | null;
};

export function MobileTopNav({
  dict,
  isTabActive,
  isReducedMotion,
  isHovered,
  setIsHovered,
}: MobileTopNavProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= 2;

  React.useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as SearchResult[];
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [canSearch, trimmedQuery]);

  const visibleResults = canSearch ? results : [];

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3 px-3 pt-2 pb-3">
        <Logo
          isTabActive={isTabActive}
          isReducedMotion={isReducedMotion}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          dict={dict}
          mobileCompact
        />
        <div className="relative min-w-0 flex-1">
          <label htmlFor="mobile-header-search" className="sr-only">
            {dict.nav.search || "Pretraga"}
          </label>
          <div className="ring-border/50 relative flex min-h-[3.25rem] items-center rounded-[1.35rem] bg-gradient-to-r from-white/84 to-white/68 px-4 shadow-[0_16px_30px_rgba(15,23,42,0.08)] ring-1 backdrop-blur-xl">
            <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl">
              <Icon name="search" className="text-[18px]" />
            </span>
            <Input
              id="mobile-header-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pretraži ponude"
              enterKeyHint="search"
              className="text-foreground placeholder:text-muted-foreground h-full min-h-[3.25rem] border-0 bg-transparent px-3 text-sm font-black tracking-[-0.03em] shadow-none focus-visible:ring-0"
            />
          </div>

          {canSearch && (
            <div className="surface-glass absolute top-[calc(100%+0.5rem)] right-0 left-0 z-[1001] overflow-hidden rounded-[1.35rem] p-2 shadow-[0_18px_34px_rgba(15,23,42,0.12)]">
              {isLoading ? (
                <div className="flex min-h-20 items-center justify-center gap-2 px-3 py-4">
                  <Icon
                    name="progress_activity"
                    className="text-primary animate-spin text-[18px]"
                  />
                  <span className="text-muted-foreground text-[10px] font-black tracking-[0.12em] uppercase">
                    Pretraga...
                  </span>
                </div>
              ) : visibleResults.length > 0 ? (
                <div className="space-y-1.5">
                  {visibleResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={() => setQuery("")}
                      className="flex items-center gap-3 rounded-[1rem] px-3 py-3 transition-colors hover:bg-white/58"
                    >
                      <span className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                        <Icon name="location_on" className="text-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="text-foreground block truncate text-[13px] font-black tracking-tight">
                          {result.title}
                        </span>
                        <span className="text-muted-foreground block truncate text-[10px] font-bold tracking-[0.12em] uppercase">
                          {result.subtitle || "Destinacija"}
                        </span>
                      </span>
                      <Icon
                        name="arrow_forward"
                        className="text-muted-foreground shrink-0 text-[16px]"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center">
                  <span className="text-muted-foreground text-[10px] font-black tracking-[0.12em] uppercase">
                    Nema rezultata
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
