import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeDealCard } from "./HomeDealCard";
import type { HomeDeal } from "@/lib/home/deals";

type HomeDict = Record<string, string>;

export function HomeBiggestSavings({ dict, deals }: { dict: HomeDict; deals: HomeDeal[] }) {
  const featuredDeals = deals.slice(0, 4);

  return (
    <section
      id="savings"
      className="mx-auto max-w-7xl scroll-mt-28 px-3 py-7 max-md:scroll-mt-36 sm:px-6 sm:py-14 md:px-8"
    >
      <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary mb-1 text-[10px] font-black tracking-[0.2em] uppercase">
            Najveći popusti
          </p>
          <h2 className="mb-1 text-[1.9rem] leading-none font-black tracking-tighter uppercase italic sm:text-4xl">
            {dict.savings_title}
          </h2>
          <p className="text-muted-foreground max-w-md text-xs leading-relaxed font-bold tracking-[0.15em] uppercase">
            {dict.savings_subtitle}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-12 min-h-12 w-full rounded-full border-white/70 bg-white/72 px-5 text-[11px] font-black uppercase shadow-sm sm:w-auto"
        >
          <Link href="#inventory">{dict.savings_view_all}</Link>
        </Button>
      </div>

      {deals.length === 0 ? (
        <div className="border-border bg-muted/20 flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-12 text-center">
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            {dict.rail_empty || "Trenutno nema ponuda sa slikom za ovu sekciju."}
          </p>
          <Button asChild className="h-12 min-h-12 rounded-full px-6">
            <Link href="/akva-parkovi">{dict.inventory_cta || "Pogledaj destinacije"}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="surface-subtle mb-3 flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/70 px-4 py-3 md:hidden">
            <div>
              <p className="text-foreground text-[11px] font-black tracking-[0.14em] uppercase">
                {featuredDeals.length} izdvojene ponude
              </p>
              <p className="text-muted-foreground pt-1 text-[12px] font-medium">
                Horizontalno skrolovanje za brzo poređenje.
              </p>
            </div>
            <span className="bg-primary/10 text-primary inline-flex min-h-10 items-center rounded-full px-3 text-[10px] font-black tracking-[0.14em] uppercase">
              Swipe
            </span>
          </div>
          <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 md:hidden">
            {featuredDeals.map((deal, i) => (
              <div key={deal.id} className="w-[84vw] max-w-[21rem] min-w-[84vw] snap-start">
                <HomeDealCard deal={deal} priority={i < 2} openTodayLabel={dict.open_today} />
              </div>
            ))}
          </div>
          <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
            {deals.map((deal, i) => (
              <HomeDealCard
                key={deal.id}
                deal={deal}
                priority={i < 2}
                openTodayLabel={dict.open_today}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
