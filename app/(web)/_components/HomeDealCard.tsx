import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/Icon";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { dbValueToSlug, slugToName } from "@/lib/routing/categories";
import type { HomeDeal } from "@/lib/home/deals";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "akva-parkovi": "bg-cyan-500/92",
  banje: "bg-amber-500/92",
  bazeni: "bg-sky-500/92",
  "wellness-i-spa": "bg-emerald-500/92",
};

const priceFormat = new Intl.NumberFormat("sr-RS");

type Props = {
  deal: HomeDeal;
  priority?: boolean;
  openTodayLabel?: string;
  className?: string;
  showAddToCart?: boolean;
};

export function HomeDealCard({
  deal,
  priority = false,
  openTodayLabel = "Otvoreno danas",
  className,
  showAddToCart = true,
}: Props) {
  const dbSlug = dbValueToSlug(deal.facility.category ?? "") || "";
  const badgeLabel = (dbSlug ? slugToName(dbSlug) : null) ?? deal.facility.category ?? "";
  const badgeColor = CATEGORY_COLORS[dbSlug] || "bg-primary";
  const hasDiscount = deal.discountPercent > 0 && deal.originalPrice;
  const detailLabel = "Detalji ponude";

  return (
    <article
      className={cn("group relative h-full", className)}
      itemScope
      itemType="https://schema.org/Offer"
      aria-labelledby={`home-deal-title-${deal.id}`}
    >
      <meta itemProp="priceCurrency" content={deal.currency} />
      <meta itemProp="price" content={String(deal.price)} />
      <meta itemProp="availability" content="https://schema.org/InStock" />
      <meta itemProp="name" content={`${deal.facility.name} - ${deal.title}`} />
      <meta itemProp="description" content={deal.pitch} />
      <link itemProp="url" href={`https://www.splashdeals.rs/${deal.facility.slug}#deals`} />
      <Link
        href={`/${deal.facility.slug}#deals`}
        className="focus-visible:ring-primary absolute inset-0 z-20 rounded-xl focus-visible:ring-2"
        aria-label={`${deal.facility.name} — ${deal.title}`}
        title={`${deal.facility.name} - ${deal.title}`}
      />
      <Card className="border-border hover:border-primary/30 bg-card/94 flex h-full flex-col overflow-hidden rounded-[1.5rem] border-white/70 transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-[0_22px_44px_rgba(18,59,96,0.12)]">
        <div className="flex flex-col gap-1 px-3 pt-3 sm:px-4 sm:pt-4">
          <h3 className="text-foreground line-clamp-1 text-[11px] leading-tight font-black tracking-[0.06em] uppercase sm:text-xs">
            {deal.facility.name}
          </h3>
          {deal.facility.city ? (
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold">
              <Icon name="location_on" className="text-primary/70 text-[12px]" />
              {deal.facility.city}
            </span>
          ) : null}
        </div>

        <div className="bg-muted relative mx-3 mt-3 aspect-[4/3] w-[calc(100%-1.5rem)] overflow-hidden rounded-[1.1rem] sm:mx-4 sm:w-[calc(100%-2rem)]">
          {deal.imageUrl ? (
            <Image
              src={deal.imageUrl}
              alt={`${deal.facility.name} - ${deal.title}`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 28vw"
              className="object-cover transition-transform duration-700 md:group-hover:scale-105"
              itemProp="image"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center" aria-hidden>
              <Icon name="waves" className="text-muted-foreground/40 text-[40px]" />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,44,0.02),rgba(7,29,44,0.08)_45%,rgba(7,29,44,0.3)_100%)]" />

          {badgeLabel ? (
            <div className="pointer-events-none absolute top-3 left-3 z-10">
              <Badge
                className={cn(
                  badgeColor,
                  "border-none px-2.5 py-1 text-[10px] font-black tracking-[0.14em] text-white uppercase shadow-sm",
                )}
              >
                {badgeLabel}
              </Badge>
            </div>
          ) : null}

          {hasDiscount ? (
            <div className="pointer-events-none absolute top-3 right-3 z-10">
              <span className="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black tracking-[0.08em] text-amber-950 shadow-lg">
                -{deal.discountPercent}%
              </span>
            </div>
          ) : null}

          {deal.facility.openToday ? (
            <div className="pointer-events-none absolute bottom-3 left-3 z-10">
              <span className="bg-background/88 text-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {openTodayLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-grow flex-col px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
          <h4
            id={`home-deal-title-${deal.id}`}
            className="group-hover:text-primary mb-1 text-[1.05rem] leading-tight font-black tracking-[-0.03em] transition-colors sm:text-[1.12rem]"
            itemProp="name"
          >
            {deal.title}
          </h4>
          <p className="text-muted-foreground mb-3 line-clamp-2 text-[13px] leading-relaxed font-medium">
            {deal.pitch}
          </p>

          <div className="relative z-30 mt-auto flex items-end justify-between gap-3 border-t border-slate-200/80 pt-3">
            <div className="from-primary/8 min-w-0 rounded-2xl bg-gradient-to-r to-transparent px-2.5 py-2">
              {hasDiscount ? (
                <span className="text-muted-foreground/55 text-[11px] line-through">
                  {priceFormat.format(deal.originalPrice!)}
                </span>
              ) : null}
              <div className="flex items-baseline gap-1">
                <data
                  value={deal.price}
                  className="text-foreground text-[1.8rem] leading-none font-black tracking-[-0.05em] sm:text-[1.95rem]"
                >
                  {priceFormat.format(deal.price)}
                </data>
                <span className="text-muted-foreground/60 text-[10px] font-black tracking-[0.14em] uppercase">
                  {deal.currency}
                </span>
              </div>
            </div>

            {showAddToCart ? (
              <AddToCartButton
                className="border-border bg-background/92 hover:bg-primary hover:text-primary-foreground min-h-12 min-w-12 rounded-2xl border shadow-sm"
                ticket={{
                  id: deal.id,
                  title: `${deal.facility.name} - ${deal.title}`,
                  price: deal.price,
                  currency: deal.currency,
                  validityType: deal.validityType || "FLEXIBLE_30_DAY",
                  requiresIdentity: deal.requiresIdentity,
                  requiresPhoto: deal.requiresPhoto,
                  minPeople: deal.minPeople,
                  maxPeople: deal.maxPeople,
                  imageUrl: deal.imageUrl,
                  facility: {
                    id: deal.facility.id,
                    name: deal.facility.name,
                    category: deal.facility.category ?? "",
                  },
                }}
              />
            ) : (
              <div className="text-muted-foreground rounded-full border border-slate-200/80 px-3 py-2 text-[10px] font-black tracking-[0.14em] uppercase">
                {detailLabel}
              </div>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
