import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import type { HomeDeal } from "@/lib/home/deals";

const priceFormat = new Intl.NumberFormat("sr-RS");

type HomeDict = Record<string, string>;

export function HomeGatePriceProof({ dict, deal }: { dict: HomeDict; deal: HomeDeal | null }) {
  if (!deal || !deal.originalPrice || deal.originalPrice <= deal.price) {
    return null;
  }

  const save = deal.originalPrice - deal.price;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 sm:py-14 md:px-12">
      <Card className="border-primary/20 bg-primary/5 overflow-hidden p-5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-primary text-[11px] font-black tracking-[0.2em] uppercase">
              {dict.price_promise}
            </p>
            <h2 className="text-2xl font-black tracking-tight uppercase italic sm:text-3xl">
              {dict.gate_title}
            </h2>
            <p className="text-muted-foreground text-sm">{dict.gate_subtitle}</p>
            <p className="text-foreground text-sm font-bold">
              {deal.facility.name} · {deal.title}
              {deal.facility.city ? ` · ${deal.facility.city}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="bg-background/80 rounded-xl border p-4 text-center">
              <p className="text-muted-foreground mb-1 text-[11px] font-bold tracking-wider uppercase">
                {dict.gate_gate_label}
              </p>
              <p className="text-muted-foreground text-xl font-black line-through">
                {priceFormat.format(deal.originalPrice)}
              </p>
              <p className="text-muted-foreground text-[11px]">RSD</p>
            </div>
            <div className="bg-background border-primary/30 rounded-xl border p-4 text-center">
              <p className="text-primary mb-1 text-[11px] font-bold tracking-wider uppercase">
                {dict.gate_deal_label}
              </p>
              <p className="text-foreground text-xl font-black">{priceFormat.format(deal.price)}</p>
              <p className="text-muted-foreground text-[11px]">RSD</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/15 p-4 text-center">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                {dict.gate_save_label}
              </p>
              <p className="text-xl font-black text-amber-700 dark:text-amber-400">
                {priceFormat.format(save)}
              </p>
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                -{deal.discountPercent}%
              </p>
            </div>
          </div>

          <Button asChild className="h-12 min-h-12 shrink-0 rounded-full px-6">
            <Link href={`/${deal.facility.slug}#deals`} className="gap-2">
              {dict.gate_cta}
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
