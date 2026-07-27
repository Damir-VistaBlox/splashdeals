"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/types/cart";
import { useUIState } from "@/hooks/use-ui-state";
import { useServerCart } from "@/hooks/use-server-cart";
import { persistCartItem } from "@/lib/cart/persist-cart-item";
import { broadcastCartUpdated } from "@/lib/cart/cart-sync";
import { openCartIfDesktop } from "@/lib/cart/open-cart-if-desktop";
import { getDayTypeLabel, getTimeSlotLabel } from "@/lib/ticketing/day-time-labels";
import { toast } from "sonner";

interface PriceOption {
  id: string;
  price: number;
  originalPrice: number | null;
  dayType: string | null;
  timeSlot: string | null;
  label: string | null;
  validFrom: string | null;
  validTo: string | null;
}

interface TicketProduct {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isSeasonPass: boolean;
  minPeople: number;
  maxPeople: number | null;
  requiresIdentity: boolean;
  requiresPhoto: boolean;
  validityType: string;
  prices: PriceOption[];
}

interface TicketVariantSelectorProps {
  product: TicketProduct;
  facility: {
    id: string;
    name: string;
    slug: string;
    category: string;
  };
  dict?: Record<string, string>;
  priceFormat: Intl.NumberFormat;
}

/** Find the best discount deal ID across prices for default selection */
function findBestDeal(prices: PriceOption[]): string | undefined {
  const best = [...prices]
    .filter((p) => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const aPct = ((Number(a.originalPrice) - a.price) / Number(a.originalPrice)) * 100;
      const bPct = ((Number(b.originalPrice) - b.price) / Number(b.originalPrice)) * 100;
      return bPct - aPct;
    })[0];
  return best?.id ?? prices[0]?.id;
}

export function TicketVariantSelector({
  product,
  facility,
  dict = {} as Record<string, string>,
  priceFormat,
}: TicketVariantSelectorProps) {
  const [selectedPrice, setSelectedPrice] = useState<string | null>(
    () => findBestDeal(product.prices) ?? null,
  );
  const [quantity, setQuantity] = useState<number>(product.minPeople || 1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const openCart = useUIState((s) => s.openCart);
  const refreshCart = useServerCart((s) => s.refresh);

  const activePrice =
    product.prices.find((p) => p.id === selectedPrice) ?? product.prices[0] ?? null;
  const bestDealId = findBestDeal(product.prices);

  const handleAddToCart = useCallback(async () => {
    if (!activePrice || isAdding || isAdded) return;
    setIsAdding(true);
    try {
      const addedItem = await persistCartItem({
        ticketPriceId: activePrice.id,
        quantity,
      });
      if (!addedItem) {
        setIsAdding(false);
        return;
      }
      await refreshCart();
      broadcastCartUpdated();
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([15, 80, 15]);
      }
      setIsAdding(false);
      setIsAdded(true);
      toast.success(dict.added_to_cart || "Dodato u korpu");
      setTimeout(() => {
        setIsAdded(false);
        openCartIfDesktop(openCart);
      }, 1200);
    } catch {
      setIsAdding(false);
      toast.error("Greška pri dodavanju u korpu");
    }
  }, [activePrice, quantity, isAdding, isAdded, refreshCart, openCart, dict]);

  return (
    <Card className="border-border overflow-visible p-8">
      <h3 className="text-foreground mb-6 text-lg font-black tracking-tight uppercase italic">
        {dict.choose_variant || "Izaberite varijantu"}
      </h3>

      {/* Price variants — now clickable radio-style */}
      <div className="divide-border/40 divide-y">
        {product.prices.map((price) => {
          const isSelected = selectedPrice === price.id;
          const hasDiscount =
            price.originalPrice && Number(price.originalPrice) > Number(price.price);
          const discountPct = hasDiscount
            ? Math.round(
                ((Number(price.originalPrice) - Number(price.price)) /
                  Number(price.originalPrice)) *
                  100,
              )
            : 0;
          const dayLabel = getDayTypeLabel(price.dayType);
          const timeLabel = getTimeSlotLabel(price.timeSlot);
          const displayLabel = price.label || `${dayLabel} — ${timeLabel}`;

          return (
            <button
              key={price.id}
              type="button"
              onClick={() => setSelectedPrice(price.id)}
              className={cn(
                "flex w-full items-center justify-between py-4 text-left transition-colors first:pt-0 last:pb-0",
                isSelected
                  ? "bg-primary/[0.02] -mx-2 rounded-lg px-2"
                  : "hover:bg-muted/10 active:bg-muted/20 -mx-2 rounded-lg px-2",
              )}
              aria-pressed={isSelected}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {/* Radio indicator */}
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected ? "border-primary" : "border-muted-foreground/30",
                  )}
                >
                  {isSelected && <div className="bg-primary h-2.5 w-2.5 rounded-full" />}
                </div>
                <div className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-bold">
                    {displayLabel}
                  </span>
                  {hasDiscount && (
                    <span className="text-muted-foreground flex items-center gap-1 text-[9px]">
                      {(dict.savings_pct || "Ušteda {pct}%").replace("{pct}", String(discountPct))}
                      {price.id === bestDealId && (
                        <span className="bg-secondary/20 text-secondary rounded-full px-1.5 py-0.5 text-[7px] leading-none font-black tracking-widest uppercase">
                          {dict.best_deal || "Najbolja ponuda"}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex shrink-0 items-baseline gap-1.5">
                {hasDiscount && (
                  <span className="text-muted-foreground/40 text-xs line-through">
                    {priceFormat.format(Number(price.originalPrice))}
                  </span>
                )}
                <span className="text-foreground text-xl font-black">
                  {priceFormat.format(Number(price.price))}
                </span>
                <span className="text-primary text-[10px] font-bold">RSD</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quantity picker */}
      <div className="border-border mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          {dict.quantity || "Količina"}
        </span>
        <div className="bg-muted/60 border-border flex items-center rounded-2xl border p-1 shadow-inner">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(product.minPeople || 1, quantity - 1))}
            disabled={isAdding || isAdded || quantity <= (product.minPeople || 1)}
            className="hover:bg-muted/40 active:bg-muted/60 text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl active:scale-90"
            aria-label={dict.decrease_qty || "Smanji količinu"}
          >
            <Icon name="remove" className="text-[14px]" />
          </Button>
          <span className="text-foreground w-10 text-center text-base font-black select-none">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              setQuantity(Math.min(product.maxPeople ?? MAX_QUANTITY_PER_ITEM, quantity + 1))
            }
            disabled={
              isAdding || isAdded || quantity >= (product.maxPeople ?? MAX_QUANTITY_PER_ITEM)
            }
            className="hover:bg-muted/40 active:bg-muted/60 text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl active:scale-90"
            aria-label={dict.increase_qty || "Povećaj količinu"}
          >
            <Icon name="add" className="text-[14px]" />
          </Button>
        </div>
      </div>

      {/* Total */}
      {activePrice && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            {dict.total || "Ukupno"}
          </span>
          <span className="text-foreground text-xl font-black">
            {priceFormat.format(activePrice.price * quantity)} RSD
          </span>
        </div>
      )}

      {/* Product constraints */}
      <div className="border-border mt-5 flex flex-wrap gap-3 border-t pt-5">
        {product.minPeople > 1 && (
          <div className="bg-muted/50 border-border flex items-center gap-2 rounded-xl border px-3 py-2">
            <Icon name="group" className="text-muted-foreground text-[14px]" />
            <span className="text-muted-foreground text-[10px] font-bold">
              {(dict.min_people || "Min. {count} osobe").replace(
                "{count}",
                String(product.minPeople),
              )}
            </span>
          </div>
        )}
        {product.requiresIdentity && (
          <div className="bg-muted/50 border-border flex items-center gap-2 rounded-xl border px-3 py-2">
            <Icon name="badge" className="text-muted-foreground text-[14px]" />
            <span className="text-muted-foreground text-[10px] font-bold">
              {dict.requires_id || "Potrebna lična karta"}
            </span>
          </div>
        )}
        {product.requiresPhoto && (
          <div className="bg-muted/50 border-border flex items-center gap-2 rounded-xl border px-3 py-2">
            <Icon name="photo_camera" className="text-muted-foreground text-[14px]" />
            <span className="text-muted-foreground text-[10px] font-bold">
              {dict.requires_photo || "Potrebna fotografija"}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding || isAdded || !activePrice}
        className={cn(
          "mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-xs font-black tracking-widest uppercase shadow-lg transition-all active:scale-[0.98]",
          isAdded
            ? "border-primary/30 bg-primary/10 text-primary"
            : isAdding
              ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground",
        )}
      >
        {isAdded ? (
          <>
            <Icon name="check" className="text-[18px]" />
            <span>{dict.added_to_cart || "Dodato u korpu"}</span>
          </>
        ) : isAdding ? (
          <>
            <Icon name="refresh" className="animate-spin text-[18px]" />
            <span>{dict.adding || "Dodavanje..."}</span>
          </>
        ) : (
          <>
            <Icon name="shopping_bag" className="text-[18px]" />
            <span>
              {activePrice
                ? `${dict.add_to_cart || "Dodaj u korpu"} — ${priceFormat.format(activePrice.price * quantity)} RSD`
                : dict.add_to_cart || "Dodaj u korpu"}
            </span>
          </>
        )}
      </Button>
    </Card>
  );
}
