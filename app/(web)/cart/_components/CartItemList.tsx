"use client";

import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/types/cart";
import type { CartItem, CartDictionary } from "@/lib/types/cart";
import type { CartReconcileNotice } from "@/lib/cart/cart-helpers";
import { buildPublicFacilityPath } from "@/lib/routing/public-facility-path";

interface CartItemListProps {
  items: CartItem[];
  dict: { cart?: CartDictionary } & Record<string, unknown>;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  removedItems?: CartReconcileNotice[];
  changedItems?: CartReconcileNotice[];
  /** Per-line mutation lock — multiple lines may mutate in parallel. */
  mutatingItemIds?: ReadonlySet<string> | string[];
}

/**
 * Remove one unit when qty is above the line minimum; only delete the whole line
 * when already at min qty. Matches “remove a single item” (not clear cart).
 */
function removeOneUnitOrLine(
  item: CartItem,
  onQuantityChange: (itemId: string, quantity: number) => void,
  onRemove: (itemId: string) => void,
) {
  const minQty = Math.max(1, item.minPeople || 1);
  if (item.quantity > minQty) {
    onQuantityChange(item.id, item.quantity - 1);
    return;
  }
  onRemove(item.id);
}

function isMutating(ids: ReadonlySet<string> | readonly string[] | undefined, id: string): boolean {
  if (!ids) return false;
  return "has" in ids ? ids.has(id) : ids.indexOf(id) !== -1;
}

function NoticeList({
  notices,
  title,
  variant,
}: {
  notices: CartReconcileNotice[];
  title?: string;
  variant: "destructive" | "warning";
}) {
  if (notices.length === 0) return null;
  const box =
    variant === "destructive"
      ? "bg-destructive/10 border-destructive/20 text-destructive"
      : "border-warning/20 bg-warning/10 text-warning";
  const muted = variant === "destructive" ? "text-destructive/80" : "text-warning/80";
  return (
    <div className={`mb-4 rounded-xl border p-3 text-sm sm:p-4 ${box}`}>
      <p className="font-bold">{title}</p>
      <ul className={`mt-2 list-inside list-disc space-y-1 ${muted}`}>
        {notices.map((notice) => (
          <li key={`${notice.title}-${notice.facilitySlug || "x"}`}>
            {notice.facilitySlug ? (
              <Link
                href={buildPublicFacilityPath(notice.facilitySlug)}
                className="underline underline-offset-2 hover:opacity-80"
              >
                {notice.title}
              </Link>
            ) : (
              notice.title
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CartItemList({
  items,
  dict,
  onQuantityChange,
  onRemove,
  removedItems = [],
  changedItems = [],
  mutatingItemIds,
}: CartItemListProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat("sr-RS").format(price);
  const cartDict = dict?.cart;

  return (
    <>
      <NoticeList notices={removedItems} title={cartDict?.removed_notice} variant="destructive" />
      <NoticeList notices={changedItems} title={cartDict?.price_changed_notice} variant="warning" />

      {items.map((item) => {
        const minQty = Math.max(1, item.minPeople || 1);
        const mutating = isMutating(mutatingItemIds, item.id);
        const atMin = item.quantity <= minQty;
        const currency = item.currency || "RSD";

        return (
          <Card
            key={item.id}
            className="bg-muted/20 border-border relative flex flex-col gap-3 p-3 sm:gap-4 sm:p-6"
          >
            <div className="flex min-w-0 items-start gap-3">
              {item.imageUrl && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-20">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 64px, 80px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 pr-1">
                <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  {item.category || cartDict?.default_category}
                </p>
                <h3 className="text-foreground mt-0.5 text-base leading-snug font-black tracking-tight sm:text-lg">
                  {item.title}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeOneUnitOrLine(item, onQuantityChange, onRemove);
                }}
                disabled={mutating}
                aria-label={cartDict?.remove || "Ukloni"}
                className="text-muted-foreground hover:text-destructive h-11 w-11 shrink-0 rounded-xl"
              >
                <Icon name="delete" className="text-[18px]" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="border-border bg-muted/40 flex items-center overflow-hidden rounded-xl border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  disabled={mutating}
                  aria-label={atMin ? cartDict?.remove || "Ukloni" : cartDict?.decrease_qty}
                  className="text-muted-foreground hover:text-foreground h-11 w-11 touch-manipulation rounded-none"
                >
                  <Icon name={atMin ? "delete" : "remove"} className="text-[16px]" />
                </Button>
                <span className="text-foreground w-10 text-center text-sm font-black tabular-nums">
                  {item.quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  disabled={
                    mutating ||
                    item.quantity >=
                      Math.min(item.maxPeople ?? MAX_QUANTITY_PER_ITEM, MAX_QUANTITY_PER_ITEM)
                  }
                  aria-label={cartDict?.increase_qty}
                  className="text-muted-foreground hover:text-foreground h-11 w-11 touch-manipulation rounded-none"
                >
                  <Icon name="add" className="text-[16px]" />
                </Button>
              </div>

              <div className="text-right">
                <div className="text-foreground text-base font-black tracking-tight tabular-nums sm:text-lg">
                  {formatPrice(item.price * item.quantity)} {currency}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeOneUnitOrLine(item, onQuantityChange, onRemove);
                  }}
                  disabled={mutating}
                  aria-label={cartDict?.remove || "Ukloni"}
                  className="text-muted-foreground hover:text-destructive mt-0.5 h-10 min-h-10 touch-manipulation px-2 text-[11px] font-black tracking-widest uppercase"
                >
                  {cartDict?.remove || "Ukloni"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
}
