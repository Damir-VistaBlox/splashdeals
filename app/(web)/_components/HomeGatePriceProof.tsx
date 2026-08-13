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
    <section className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-14 md:px-8">
      <Card variant="glass" className="overflow-hidden rounded-[1.65rem] p-4 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-1.5">
            <p className="text-primary text-[11px] font-black tracking-[0.2em] uppercase">
              {dict.price_promise}
            </p>
            <h2 className="text-[1.55rem] leading-none font-black tracking-tight uppercase italic sm:text-3xl">
              {dict.gate_title}
            </h2>
            <p className="text-muted-foreground text-[13px]">{dict.gate_subtitle}</p>
            <p className="text-foreground text-[13px] font-bold">
              {deal.facility.name} · {deal.title}
              {deal.facility.city ? ` · ${deal.facility.city}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-[1rem] border border-white/45 bg-white/42 p-3 text-center backdrop-blur-sm">
              <p className="text-muted-foreground mb-1 text-[11px] font-bold tracking-wider uppercase">
                {dict.gate_gate_label}
              </p>
              <p className="text-muted-foreground text-base font-black line-through sm:text-xl">
                {priceFormat.format(deal.originalPrice)}
              </p>
              <p className="text-muted-foreground text-[11px]">RSD</p>
            </div>
            <div className="border-primary/25 rounded-[1rem] border bg-white/52 p-3 text-center backdrop-blur-sm">
              <p className="text-primary mb-1 text-[11px] font-bold tracking-wider uppercase">
                {dict.gate_deal_label}
              </p>
              <p className="text-foreground text-base font-black sm:text-xl">
                {priceFormat.format(deal.price)}
              </p>
              <p className="text-muted-foreground text-[11px]">RSD</p>
            </div>
            <div className="rounded-[1rem] border border-amber-500/25 bg-amber-500/12 p-3 text-center backdrop-blur-sm">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                {dict.gate_save_label}
              </p>
              <p className="text-base font-black text-amber-700 sm:text-xl dark:text-amber-400">
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
