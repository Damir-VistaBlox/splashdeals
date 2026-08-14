import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeDealCard } from "./HomeDealCard";
import type { HomeDeal } from "@/lib/home/deals";

type HomeDict = Record<string, string>;

export function HomeInventorySection({ dict, deals }: { dict: HomeDict; deals: HomeDeal[] }) {
  return (
    <section id="inventory" className="scroll-mt-28 pb-9 max-md:scroll-mt-36 sm:pb-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 md:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <h2 className="mb-1 text-[1.9rem] leading-none font-black tracking-[-0.06em] uppercase italic sm:text-4xl">
              {dict.offers_title}
            </h2>
            <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
              {dict.offers_subtitle}
            </p>
            <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed font-medium tracking-normal normal-case">
              Ručno izdvojene ponude sa jasnom cenom, aktivnom dostupnošću i brzim putem do
              kupovine.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-12 min-h-12 rounded-full border-white/70 bg-white/70 px-5 text-[11px] font-black uppercase shadow-sm max-md:w-full"
          >
            <Link href="/akva-parkovi">{dict.inventory_cta}</Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 md:px-8">
        {deals.length === 0 ? (
          <div className="public-panel flex flex-col items-center gap-4 rounded-[1.75rem] border-dashed px-6 py-16 text-center">
            <p className="text-muted-foreground max-w-md text-sm">
              {dict.rail_empty || "Trenutno nema aktivnih ponuda sa slikom."}
            </p>
            <Button asChild className="h-12 min-h-12 rounded-full px-6">
              <Link href="/akva-parkovi">{dict.inventory_cta}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="surface-subtle flex flex-wrap items-center justify-between gap-2 rounded-[1.5rem] border border-white/70 px-4 py-3.5">
              <div>
                <p className="text-foreground text-[11px] font-black tracking-[0.14em] uppercase">
                  {deals.length} ručno izdvojenih ponuda
                </p>
                <p className="text-muted-foreground pt-1 text-[12px] font-medium">
                  Fokus na jasne cene, aktivne ulaznice i brz put do kupovine.
                </p>
              </div>
              <p className="text-muted-foreground rounded-full border border-white/70 bg-white/72 px-3 py-2 text-[10px] font-black tracking-[0.14em] uppercase">
                Jasna cena
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-md:[&>*:nth-child(n+4)]:hidden">
              {deals.map((deal) => (
                <HomeDealCard
                  key={deal.id}
                  deal={deal}
                  priority={false}
                  openTodayLabel={dict.open_today}
                />
              ))}
            </div>
            <div className="flex md:hidden">
              <Button
                asChild
                variant="outline"
                className="h-12 min-h-12 w-full rounded-full border-white/70 bg-white/72 px-5 text-[11px] font-black uppercase shadow-sm"
              >
                <Link href="/akva-parkovi">{dict.inventory_cta}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
