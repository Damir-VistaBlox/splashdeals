"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getClientDictionary } from "@/lib/client-dictionaries";
import type { Dict } from "@/lib/types";

type SearchResult = {
  id: string;
  href: string;
  title: string;
  subtitle?: string | null;
  type?: string;
};

/**
 * 🔍 Global Search Command Palette
 * High-performance search interface designed for Parallel/Intercepting routing.
 */
export function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams ? searchParams.get("q") || "" : "";

  const [query, setQuery] = React.useState(() => q);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dict, setDict] = React.useState<Dict | null>(null);
  const trimmedQuery = query.trim();
  const hasEnoughChars = trimmedQuery.length >= 2;
  const searchDict = dict?.search;
  const recentChips: string[] = searchDict?.recent_chips || [
    "Petroland",
    "Beograd",
    "Porodične Akcije",
  ];

  React.useEffect(() => {
    getClientDictionary().then(setDict);
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(q);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [q]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const visibleResults = hasEnoughChars ? results : [];

  // Close search and go back
  const handleClose = () => router.back();

  const handleResultSelect = React.useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  React.useEffect(() => {
    if (!hasEnoughChars) return;

    const delay = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [hasEnoughChars, trimmedQuery]);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!hasEnoughChars) return;
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    },
    [hasEnoughChars, router, trimmedQuery],
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-stretch justify-center md:items-start md:px-4 md:pt-[10vh]">
      {/* 🌑 Backdrop */}
      <div
        onClick={handleClose}
        className="animate-in fade-in absolute inset-0 bg-slate-950/70 backdrop-blur-xl duration-300 motion-reduce:animate-none md:bg-slate-950/80"
      />

      {/* Search surface — mobile: full-screen bottom-sheet-style slide-up takeover; desktop: centered fade+zoom */}
      <section className="animate-in slide-in-from-bottom-8 fade-in relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.94))] duration-300 ease-out motion-reduce:animate-none md:h-auto md:max-h-[78dvh] md:max-w-2xl md:slide-in-from-bottom-0 md:zoom-in-95 md:rounded-[2rem] md:border md:border-white/20 md:bg-slate-900 md:shadow-2xl md:shadow-cyan-500/10">
        <div className="border-border/40 relative border-b px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-3 md:border-white/5 md:px-6 md:py-6">
          <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
            <div className="min-w-0">
              <p className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
                {searchDict?.heading || "Pretraga"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs font-medium md:text-slate-400">
                {searchDict?.placeholder || "Pretražite akva parkove, gradove ili akcije..."}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground h-11 w-11 rounded-2xl border border-white/70 bg-white/72 shadow-sm md:border-white/10 md:bg-white/5 md:text-slate-400 md:hover:bg-white/10 md:hover:text-white"
            >
              <Icon name="close" className="text-[20px]" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="surface-glass relative rounded-[1.45rem] md:rounded-[1.35rem] md:border-white/10 md:bg-white/5">
              <Icon
                name="search"
                className="text-primary absolute top-1/2 left-4 -translate-y-1/2 text-[20px] md:text-cyan-500"
              />
              <label htmlFor="global-search" className="sr-only">
                {searchDict?.sr_label || "Pretražite akva parkove, gradove ili akcije"}
              </label>
              <Input
                id="global-search"
                autoFocus
                placeholder={
                  searchDict?.placeholder || "Pretražite akva parkove, gradove ili akcije..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                enterKeyHint="search"
                className="text-foreground placeholder:text-muted-foreground h-14 w-full border-0 bg-transparent pr-24 pl-13 text-base font-bold focus-visible:ring-0 md:text-lg md:text-white md:placeholder:text-slate-500"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!hasEnoughChars}
                className="absolute top-1/2 right-2 h-10 min-w-20 -translate-y-1/2 rounded-full px-3 text-[10px] font-black tracking-[0.14em] uppercase"
              >
                {searchDict?.submit_cta || "Otvori"}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-muted-foreground text-[10px] font-black tracking-[0.14em] uppercase md:text-slate-500">
                {hasEnoughChars
                  ? (searchDict?.fast_results_count || "{count} brzih rezultata").replace(
                      "{count}",
                      String(visibleResults.length),
                    )
                  : searchDict?.min_chars_live || "Unesite bar 2 slova za rezultate"}
              </p>
              {hasEnoughChars ? (
                <button
                  type="submit"
                  className="text-primary text-[10px] font-black tracking-[0.14em] uppercase"
                >
                  {searchDict?.open_full_results || "Prikaži celu stranu"}
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3 md:max-h-[60vh] md:p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20" aria-busy="true">
              <Icon
                name="progress_activity"
                className="text-primary animate-spin text-[32px] md:text-cyan-500"
              />
              <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase md:text-slate-500">
                {searchDict?.searching || "Pretražujemo Srpske Vode..."}
              </span>
            </div>
          ) : trimmedQuery.length === 0 ? (
            <div className="space-y-4 px-2 py-6 text-center md:p-8">
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase md:text-slate-400">
                {searchDict?.recent_searches || "Brzi Predlozi"}
              </p>
              <div
                aria-label={searchDict?.quick_rail_label || "Brze teme za pretragu"}
                className="no-scrollbar -mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pt-1 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pt-4"
              >
                {recentChips.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-foreground hover:text-foreground min-h-11 shrink-0 snap-start rounded-full border border-white/70 bg-white/76 px-4 py-3 text-[10px] font-black uppercase shadow-sm transition-all hover:bg-white md:border-white/5 md:bg-white/5 md:text-white md:hover:bg-cyan-500 md:hover:text-slate-950"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="surface-glass rounded-[1.35rem] px-4 py-4 text-left md:border-white/5 md:bg-white/5">
                <p className="text-[10px] font-black tracking-[0.14em] uppercase">
                  {searchDict?.recent_hint_title || "Najbrži put"}
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {searchDict?.recent_hint_body ||
                    "Probajte ime objekta, grad ili kategoriju. Primeri: Petroland, Novi Sad, wellness."}
                </p>
              </div>
            </div>
          ) : visibleResults.length > 0 ? (
            <div className="space-y-2" aria-live="polite">
              {visibleResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultSelect(result.href)}
                  className="surface-glass group flex min-h-16 w-full items-center justify-between rounded-[1.35rem] p-4 text-left transition-colors md:border-white/5 md:bg-white/5 md:hover:bg-white/8"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl transition-colors md:bg-slate-800 md:group-hover:bg-cyan-500/20">
                      {result.type === "facility" ? (
                        <Icon
                          name="location_on"
                          className="text-primary text-[20px] md:text-cyan-400"
                        />
                      ) : (
                        <Icon
                          name="confirmation_number"
                          className="text-primary text-[20px] md:text-cyan-400"
                        />
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-foreground line-clamp-1 text-sm font-black tracking-tight uppercase transition-colors md:text-white md:group-hover:text-cyan-400">
                        {result.title}
                      </div>
                      <div className="text-muted-foreground line-clamp-1 text-[10px] font-bold tracking-widest uppercase md:text-slate-500">
                        {result.subtitle || searchDict?.open_result || "Otvori rezultat"}
                      </div>
                    </div>
                  </div>
                  <Icon
                    name="arrow_forward"
                    className="text-muted-foreground text-[16px] transition-all group-hover:translate-x-1 md:text-slate-700 md:group-hover:text-cyan-400"
                  />
                </button>
              ))}
            </div>
          ) : !hasEnoughChars ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-xs font-black tracking-widest uppercase md:text-slate-500">
                {(
                  searchDict?.min_chars_remaining || "Unesite još najmanje {count} slovo(a)"
                ).replace("{count}", String(2 - trimmedQuery.length))}
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-20 text-center">
              <p className="text-muted-foreground text-xs font-black tracking-widest uppercase md:text-slate-500">
                {searchDict?.no_results || "Nema pronađenih iskustava"}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)}
                className="h-11 rounded-full px-5 text-[10px] font-black tracking-[0.14em] uppercase"
              >
                {searchDict?.open_full_results || "Pogledaj celu pretragu"}
              </Button>
            </div>
          )}
        </div>

        <div className="border-border/40 flex items-center justify-between border-t px-4 py-3 md:border-white/5 md:bg-black/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="text-muted-foreground rounded border border-white/70 bg-white/72 px-2 py-1 text-[9px] font-black md:border-white/5 md:bg-slate-800 md:text-slate-400">
                ESC
              </kbd>
              <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase md:text-slate-600">
                {searchDict?.to_close || "za zatvaranje"}
              </span>
            </div>
            <div className="hidden items-center gap-1.5 md:flex">
              <kbd className="rounded border border-white/5 bg-slate-800 px-2 py-1 text-[9px] font-black text-slate-400">
                ↵
              </kbd>
              <span className="text-[9px] font-bold tracking-widest text-slate-600 uppercase">
                {searchDict?.to_select || "za odabir"}
              </span>
            </div>
          </div>
          <span className="text-primary/60 text-[9px] font-black tracking-[0.2em] uppercase md:text-cyan-500/50">
            {searchDict?.brand_tag || "Splash Otkrivanje v2.0"}
          </span>
        </div>
      </section>
    </div>
  );
}
