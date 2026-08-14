import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeDealCard } from "./HomeDealCard";
import type { HomeDeal } from "@/lib/home/deals";

type HomeDict = Record<string, string>;

export function HomeOpenToday({ dict, deals }: { dict: HomeDict; deals: HomeDeal[] }) {
  const openDeals = deals.slice(0, 3);

  return (
    <section
      id="ops-open"
      className="border-border mx-auto max-w-7xl scroll-mt-28 border-t px-3 py-8 max-md:scroll-mt-36 sm:px-6 sm:py-12 md:px-12"
    >
      <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary mb-1 text-[10px] font-black tracking-[0.18em] uppercase">
            Za danas
          </p>
          <h2 className="mb-1 text-[1.8rem] leading-none font-black tracking-tighter uppercase italic sm:text-4xl">
            {dict.ops_title}
          </h2>
          <p className="text-muted-foreground max-w-md text-xs leading-relaxed font-bold tracking-wide uppercase">
            {dict.ops_subtitle}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-12 min-h-12 w-full rounded-full border-white/70 bg-white/72 px-5 text-[11px] font-black uppercase shadow-sm sm:w-auto"
        >
          <Link href="/akva-parkovi">{dict.ops_view_all}</Link>
        </Button>
      </div>

      {deals.length === 0 ? (
        <p className="text-muted-foreground text-sm">{dict.ops_empty}</p>
      ) : (
        <>
          <div className="surface-subtle mb-3 flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/70 px-4 py-3 md:hidden">
            <p className="text-foreground text-[11px] font-black tracking-[0.14em] uppercase">
              Potvrđeno za današnji odlazak
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-2 text-[10px] font-black tracking-[0.14em] text-emerald-800 uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Danas
            </span>
          </div>
          <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 md:hidden">
            {openDeals.map((deal) => (
              <div key={deal.id} className="w-[84vw] max-w-[21rem] min-w-[84vw] snap-start">
                <HomeDealCard deal={deal} openTodayLabel={dict.ops_open_badge} />
              </div>
            ))}
          </div>
          <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <HomeDealCard key={deal.id} deal={deal} openTodayLabel={dict.ops_open_badge} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
