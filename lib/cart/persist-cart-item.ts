"use client";

import { addToCartAction } from "@/app/(server)/actions/cart";
import type { CartItem, CartItemInput } from "@/lib/types/cart";
import { toast } from "sonner";

export async function persistCartItem(input: CartItemInput): Promise<CartItem | null> {
  try {
    const result = await addToCartAction(input);
    if (!result.success || !result.data?.item) {
      toast.error(result.error || "Greška pri dodavanju u korpu.");
      return null;
    }

    return result.data.item;
  } catch {
    toast.error("Greška pri dodavanju u korpu.");
    return null;
  }
}
