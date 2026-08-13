"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getClientDictionary } from "@/lib/client-dictionaries";
import type { Dict } from "@/lib/types";

/**
 * 🔍 Global Search Command Palette
 * High-performance search interface designed for Parallel/Intercepting routing.
 */
export function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams ? searchParams.get("q") || "" : "";

  const [prevQ, setPrevQ] = React.useState(q);
  const [query, setQuery] = React.useState(q);
  const [results, setResults] = React.useState<Dict[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dict, setDict] = React.useState<Dict | null>(null);

  React.useEffect(() => {
    getClientDictionary().then(setDict);
  }, []);

  if (q !== prevQ) {
    setPrevQ(q);
    setQuery(q);
  }

  const visibleResults = query.length >= 2 ? results : [];

  // Close search and go back
  const handleClose = () => router.back();

  const handleResultSelect = React.useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  // Simulate search logic (will connect to API later)
  React.useEffect(() => {
    if (query.length < 2) return;

    const delay = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-stretch justify-center md:items-start md:px-4 md:pt-[10vh]">
      {/* 🌑 Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl md:bg-slate-950/80"
      />

      {/* Search surface */}
      <section className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.94))] md:h-auto md:max-h-[78dvh] md:max-w-2xl md:rounded-[2rem] md:border md:border-white/20 md:bg-slate-900 md:shadow-2xl md:shadow-cyan-500/10">
        <div className="border-border/40 relative border-b px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-3 md:border-white/5 md:px-6 md:py-6">
          <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
            <div className="min-w-0">
              <p className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
                {dict?.search?.heading || "Pretraga"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs font-medium md:text-slate-400">
                {dict?.search?.placeholder || "Pretražite akva parkove, gradove ili akcije..."}
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

          <div className="surface-glass relative rounded-[1.45rem] md:rounded-[1.35rem] md:border-white/10 md:bg-white/5">
            <Icon
              name="search"
              className="text-primary absolute top-1/2 left-4 -translate-y-1/2 text-[20px] md:text-cyan-500"
            />
            <label htmlFor="global-search" className="sr-only">
              {(dict as Dict)?.search?.sr_label || "Pretražite akva parkove, gradove ili akcije"}
            </label>
            <Input
              id="global-search"
              autoFocus
              placeholder={
                dict?.search?.placeholder || "Pretražite akva parkove, gradove ili akcije..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
              className="text-foreground placeholder:text-muted-foreground h-14 w-full border-0 bg-transparent pr-4 pl-13 text-base font-bold focus-visible:ring-0 md:text-lg md:text-white md:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3 md:max-h-[60vh] md:p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20" aria-busy="true">
              <Icon
                name="progress_activity"
                className="text-primary animate-spin text-[32px] md:text-cyan-500"
              />
              <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase md:text-slate-500">
                {dict?.search?.searching || "Pretražujemo Srpske Vode..."}
              </span>
            </div>
          ) : query.length === 0 ? (
            <div className="space-y-3 px-2 py-6 text-center md:p-8">
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase md:text-slate-400">
                {dict?.search?.recent_searches || "Nedavne Pretrage"}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 md:pt-4">
                {(dict?.search?.recent_chips || ["Petroland", "Beograd", "Porodične Akcije"]).map(
                  (s: string) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="text-foreground hover:text-foreground min-h-11 rounded-full border border-white/70 bg-white/76 px-4 py-3 text-[10px] font-black uppercase shadow-sm transition-all hover:bg-white md:border-white/5 md:bg-white/5 md:text-white md:hover:bg-cyan-500 md:hover:text-slate-950"
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </div>
          ) : visibleResults.length > 0 ? (
            <div className="space-y-2" aria-live="polite">
              {visibleResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultSelect(result.href)}
                  className="surface-glass group flex w-full items-center justify-between rounded-[1.35rem] p-4 text-left transition-colors md:border-white/5 md:bg-white/5 md:hover:bg-white/8"
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
                    <div className="text-left">
                      <div className="text-foreground text-sm font-black tracking-tight uppercase transition-colors md:text-white md:group-hover:text-cyan-400">
                        {result.title}
                      </div>
                      <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-slate-500">
                        {result.subtitle}
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
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-xs font-black tracking-widest uppercase md:text-slate-500">
                {dict?.search?.no_results || "Nema pronađenih iskustava"}
              </p>
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
                {dict?.search?.to_close || "za zatvaranje"}
              </span>
            </div>
            <div className="hidden items-center gap-1.5 md:flex">
              <kbd className="rounded border border-white/5 bg-slate-800 px-2 py-1 text-[9px] font-black text-slate-400">
                ↵
              </kbd>
              <span className="text-[9px] font-bold tracking-widest text-slate-600 uppercase">
                {dict?.search?.to_select || "za odabir"}
              </span>
            </div>
          </div>
          <span className="text-primary/60 text-[9px] font-black tracking-[0.2em] uppercase md:text-cyan-500/50">
            {dict?.search?.brand_tag || "Splash Otkrivanje v2.0"}
          </span>
        </div>
      </section>
    </div>
  );
}
