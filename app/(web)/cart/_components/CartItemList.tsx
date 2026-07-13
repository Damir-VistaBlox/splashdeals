"use client";

import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/types/cart";
import type { CartItem } from "@/lib/types/cart";

interface CartItemListProps {
  items: CartItem[];
  dict: Record<string, any>;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  removedItems?: string[];
  changedItems?: string[];
}

export function CartItemList({
  items,
  dict,
  onQuantityChange,
  onRemove,
  removedItems = [],
  changedItems = [],
}: CartItemListProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat("sr-RS").format(price);

  return (
    <>
      {/* Error state notices */}
      {removedItems.length > 0 && (
        <div className="bg-destructive/10 border-destructive/20 mb-4 rounded-xl border p-4 text-sm">
          <p className="text-destructive font-bold">
            {dict?.cart?.removed_notice || "Neke stavke više nisu dostupne i uklonjene su:"}
          </p>
          <ul className="text-destructive/80 mt-2 list-inside list-disc space-y-1">
            {removedItems.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      {changedItems.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm">
          <p className="font-bold text-amber-600">
            {dict?.cart?.price_changed_notice || "Cene su ažurirane:"}
          </p>
        </div>
      )}

      {items.map((item) => (
        <Card key={item.id} className="bg-muted/20 border-border flex items-center gap-6 p-6">
          {item.imageUrl && (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
              {item.category || dict?.categories?.waterpark || "Akva Park"}
            </p>
            <h3 className="text-foreground mt-1 text-lg font-black tracking-tight">{item.title}</h3>
            <p className="text-muted-foreground mt-0.5 text-xs">{item.facilityName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="border-border bg-muted/30 flex items-center overflow-hidden rounded-xl border">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= (item.minPeople || 1)}
                className="text-muted-foreground hover:text-foreground px-3 py-2 transition-colors disabled:opacity-30"
              >
                <Icon name="remove" className="text-[14px]" />
              </button>
              <span className="text-foreground min-w-[32px] text-center text-sm font-bold">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={
                  item.quantity >=
                  Math.min(item.maxPeople ?? MAX_QUANTITY_PER_ITEM, MAX_QUANTITY_PER_ITEM)
                }
                className="text-muted-foreground hover:text-foreground px-3 py-2 transition-colors disabled:opacity-30"
              >
                <Icon name="add" className="text-[14px]" />
              </button>
            </div>
            <div className="min-w-[80px] text-right">
              <div className="text-foreground text-lg font-black tracking-tight">
                {formatPrice(item.price * item.quantity)} RSD
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-muted-foreground/50 hover:text-destructive mt-1 text-[9px] font-black tracking-widest uppercase transition-colors"
              >
                {dict?.cart?.remove || "Ukloni"}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
