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
      <Card variant="glass" className="overflow-hidden rounded-[1.5rem] p-4 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-1">
            <p className="text-primary text-[11px] font-black tracking-[0.2em] uppercase">
              {dict.price_promise}
            </p>
            <h2 className="text-[1.15rem] leading-tight font-black tracking-tight uppercase sm:text-[1.35rem]">
              {dict.gate_subtitle}
            </h2>
            <p className="text-muted-foreground text-[12px] font-bold tracking-[0.12em] uppercase">
              {dict.gate_title}
            </p>
            <p className="text-foreground pt-0.5 text-[13px] font-bold">
              {deal.facility.name} · {deal.title}
              {deal.facility.city ? ` · ${deal.facility.city}` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:min-w-[22rem]">
            <div className="surface-subtle grid grid-cols-2 gap-2 rounded-[1rem] p-2.5">
              <div className="rounded-[0.8rem] bg-white/55 px-3 py-2 text-left">
                <p className="text-muted-foreground text-[10px] font-bold tracking-[0.14em] uppercase">
                  {dict.gate_gate_label}
                </p>
                <p className="text-muted-foreground text-base font-black line-through sm:text-lg">
                  {priceFormat.format(deal.originalPrice)} <span className="text-[11px]">RSD</span>
                </p>
              </div>

              <div className="border-primary/15 bg-primary/6 rounded-[0.8rem] border px-3 py-2 text-left">
                <p className="text-primary text-[10px] font-bold tracking-[0.14em] uppercase">
                  {dict.gate_deal_label}
                </p>
                <p className="text-foreground text-base font-black sm:text-lg">
                  {priceFormat.format(deal.price)} <span className="text-[11px]">RSD</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2">
              <p className="text-[10px] font-bold tracking-[0.14em] text-amber-700 uppercase dark:text-amber-400">
                {dict.gate_save_label}
              </p>
              <p className="text-sm font-black text-amber-700 dark:text-amber-400">
                {priceFormat.format(save)} RSD · -{deal.discountPercent}%
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-11 min-h-11 shrink-0 rounded-full px-5 text-[11px] font-black uppercase"
          >
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
