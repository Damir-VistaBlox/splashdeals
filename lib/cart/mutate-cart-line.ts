"use client";

import { removeFromCartAction, updateCartQuantityAction } from "@/app/(server)/actions/cart";
import type { CartItem } from "@/lib/types/cart";
import { useServerCart } from "@/hooks/use-server-cart";

export type CartLineMutationMode = "setQuantity" | "removeLine" | "removeOneUnit";

export type CartLineMutationResult = {
  ok: boolean;
  error?: string;
  items: CartItem[];
};

function getMinQty(item: CartItem): number {
  return Math.max(1, item.minPeople || 1);
}

/**
 * Shared optimistic remove/qty path for CartClient + CartDrawer.
 * - removeOneUnit: −1 when above min, else delete whole line
 * - removeLine: always delete the line
 * - setQuantity: update qty; if below min / ≤0 → delete line via remove action
 */
export async function mutateCartLine(params: {
  itemId: string;
  mode: CartLineMutationMode;
  /** Required for mode === "setQuantity" */
  quantity?: number;
  errorFallback?: string;
}): Promise<CartLineMutationResult> {
  const { itemId, mode, quantity, errorFallback } = params;
  if (!itemId) {
    return { ok: false, error: errorFallback, items: useServerCart.getState().items };
  }

  const previousItems = useServerCart.getState().items;
  const item = previousItems.find((i) => i.id === itemId);
  if (!item) {
    return { ok: false, error: errorFallback, items: previousItems };
  }

  const minQty = getMinQty(item);
  let shouldRemove = false;
  let nextQuantity = item.quantity;

  if (mode === "removeLine") {
    shouldRemove = true;
  } else if (mode === "removeOneUnit") {
    if (item.quantity > minQty) {
      shouldRemove = false;
      nextQuantity = item.quantity - 1;
    } else {
      shouldRemove = true;
    }
  } else {
    // setQuantity
    const q = quantity ?? item.quantity;
    if (q < minQty || q <= 0) {
      shouldRemove = true;
    } else {
      shouldRemove = false;
      nextQuantity = q;
    }
  }

  const optimistic = shouldRemove
    ? previousItems.filter((i) => i.id !== itemId)
    : previousItems.map((i) => (i.id === itemId ? { ...i, quantity: nextQuantity } : i));

  useServerCart.getState().setItems(optimistic);

  try {
    const result = shouldRemove
      ? await removeFromCartAction({ itemId })
      : await updateCartQuantityAction({ itemId, quantity: nextQuantity });

    if (!result.success) {
      useServerCart.getState().setItems(previousItems);
      return {
        ok: false,
        error: result.error || errorFallback,
        items: previousItems,
      };
    }

    if (shouldRemove && result.data && "items" in result.data && Array.isArray(result.data.items)) {
      const serverItems = result.data.items as CartItem[];
      // Guard: never wipe sibling lines if server unexpectedly returns empty.
      if (serverItems.length === 0 && optimistic.length > 0) {
        await useServerCart.getState().refresh();
        return { ok: true, items: useServerCart.getState().items };
      }
      useServerCart.getState().setItems(serverItems);
      useServerCart.getState().notifyUpdated();
      return { ok: true, items: serverItems };
    }

    if (!shouldRemove && result.data && "item" in result.data && result.data.item) {
      const updated = result.data.item as CartItem;
      const next = useServerCart.getState().items.map((i) => (i.id === updated.id ? updated : i));
      useServerCart.getState().setItems(next);
      useServerCart.getState().notifyUpdated();
      return { ok: true, items: next };
    }

    await useServerCart.getState().refresh();
    useServerCart.getState().notifyUpdated();
    return { ok: true, items: useServerCart.getState().items };
  } catch {
    useServerCart.getState().setItems(previousItems);
    return { ok: false, error: errorFallback, items: previousItems };
  }
}
