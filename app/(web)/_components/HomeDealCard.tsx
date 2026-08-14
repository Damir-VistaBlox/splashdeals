import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/Icon";
import { LazyAddToCartButton } from "@/components/cart/LazyAddToCartButton";
import { dbValueToSlug, slugToName } from "@/lib/routing/categories";
import type { HomeDeal } from "@/lib/home/deals";
import { absoluteUrl } from "@/lib/seo";
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
  const trustNote = deal.requiresIdentity
    ? "Potrebna identifikacija"
    : deal.minPeople > 1
      ? `Za ${deal.minPeople}+ osobe`
      : "Digitalna kupovina";
  const purchaseNote =
    deal.requiresPhoto || deal.validityType.includes("PHOTO")
      ? "Spremno za verifikaciju"
      : "Brza isporuka";
  const savingsLabel = hasDiscount ? `${deal.discountPercent}% niže` : "Jasna cena";
  const dealUrl = absoluteUrl(`/${deal.facility.slug}#deals`);

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
      <link itemProp="url" href={dealUrl} />
      <Link
        href={`/${deal.facility.slug}#deals`}
        className="focus-visible:ring-primary absolute inset-0 z-20 rounded-xl focus-visible:ring-2"
        aria-label={`${deal.facility.name} — ${deal.title}`}
        title={`${deal.facility.name} - ${deal.title}`}
      />
      <Card className="surface-card border-border hover:border-primary/30 flex h-full flex-col overflow-hidden rounded-[1.65rem] border-white/75 shadow-[0_18px_32px_rgba(15,23,42,0.08)] transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-[0_22px_44px_rgba(18,59,96,0.12)]">
        <div className="flex flex-col gap-1 px-3 pt-3 sm:gap-1 sm:px-4 sm:pt-4">
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

        <div className="bg-muted relative mx-3 mt-2 aspect-[1.32/1] w-[calc(100%-1.5rem)] overflow-hidden rounded-[1.1rem] sm:mx-4 sm:mt-3 sm:aspect-[4/3] sm:w-[calc(100%-2rem)] sm:rounded-[1.18rem]">
          {deal.imageUrl ? (
            <Image
              src={deal.imageUrl}
              alt={`${deal.facility.name} - ${deal.title}`}
              fill
              priority={priority}
              quality={62}
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
            <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 sm:top-3 sm:left-3">
              <Badge
                className={cn(
                  badgeColor,
                  "border-none px-2 py-1 text-[9px] font-black tracking-[0.12em] text-white uppercase shadow-sm sm:px-2.5 sm:text-[10px] sm:tracking-[0.14em]",
                )}
              >
                {badgeLabel}
              </Badge>
            </div>
          ) : null}

          {hasDiscount ? (
            <div className="pointer-events-none absolute top-2.5 right-2.5 z-10 sm:top-3 sm:right-3">
              <span className="inline-flex items-center rounded-full bg-amber-400 px-2 py-1 text-[9px] font-black tracking-[0.06em] text-amber-950 shadow-lg sm:px-2.5 sm:text-[10px]">
                -{deal.discountPercent}%
              </span>
            </div>
          ) : null}

          {deal.facility.openToday ? (
            <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 sm:bottom-3 sm:left-3">
              <span className="bg-background/88 text-foreground inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold shadow-sm backdrop-blur-sm sm:px-2.5 sm:text-[10px]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {openTodayLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-grow flex-col px-3 pt-2.5 pb-3.5 sm:px-4 sm:pt-3 sm:pb-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="surface-subtle text-foreground inline-flex min-h-7 items-center rounded-full border border-white/70 px-2.5 text-[9px] font-black tracking-[0.12em] uppercase">
              {trustNote}
            </span>
            <span className="text-muted-foreground hidden min-h-7 items-center rounded-full border border-slate-200/80 bg-white/72 px-2.5 text-[9px] font-black tracking-[0.12em] uppercase sm:inline-flex">
              {purchaseNote}
            </span>
            <span className="inline-flex min-h-7 items-center rounded-full bg-emerald-500/10 px-2.5 text-[9px] font-black tracking-[0.12em] text-emerald-800 uppercase">
              {savingsLabel}
            </span>
          </div>
          <h4
            id={`home-deal-title-${deal.id}`}
            className="group-hover:text-primary mb-1 text-[0.95rem] leading-tight font-black tracking-[-0.03em] transition-colors sm:text-[1.12rem]"
            itemProp="name"
          >
            {deal.title}
          </h4>
          <p className="text-muted-foreground mb-2 line-clamp-2 text-[12px] leading-relaxed font-medium sm:mb-3 sm:text-[13px]">
            {deal.pitch}
          </p>

          {hasDiscount ? (
            <div className="mb-2 flex items-center justify-between rounded-[1rem] border border-emerald-200/70 bg-emerald-500/8 px-3 py-2">
              <span className="text-[9px] font-black tracking-[0.14em] text-emerald-800 uppercase">
                Ušteda danas
              </span>
              <span className="text-[11px] font-black text-emerald-900">
                {priceFormat.format(deal.absoluteSave)} RSD
              </span>
            </div>
          ) : null}

          <div className="relative z-30 mt-auto flex items-end justify-between gap-2 border-t border-slate-200/80 pt-2.5 sm:gap-3 sm:pt-3">
            <div className="from-primary/8 min-w-0 flex-1 rounded-[1.15rem] bg-gradient-to-r to-transparent px-2.5 py-2">
              {hasDiscount ? (
                <span className="text-muted-foreground/55 text-[11px] line-through">
                  {priceFormat.format(deal.originalPrice!)}
                </span>
              ) : null}
              <span className="text-muted-foreground/70 block text-[9px] font-black tracking-[0.14em] uppercase">
                Danas od
              </span>
              <div className="flex items-baseline gap-1">
                <data
                  value={deal.price}
                  className="text-foreground text-[1.42rem] leading-none font-black tracking-[-0.05em] sm:text-[1.95rem]"
                >
                  {priceFormat.format(deal.price)}
                </data>
                <span className="text-muted-foreground/60 text-[10px] font-black tracking-[0.14em] uppercase">
                  {deal.currency}
                </span>
              </div>
            </div>

            {showAddToCart ? (
              <LazyAddToCartButton
                className="border-border bg-background/92 hover:bg-primary hover:text-primary-foreground min-h-12 min-w-12 rounded-[1.15rem] border shadow-sm shadow-slate-200/70 sm:min-h-12 sm:min-w-12 sm:rounded-2xl"
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
              <div className="text-muted-foreground min-h-11 rounded-full border border-slate-200/80 px-3 py-2 text-[9px] font-black tracking-[0.12em] uppercase sm:text-[10px]">
                {detailLabel}
              </div>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
