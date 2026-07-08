"use server";

import { createCheckoutSession } from "@/server/lib/stripe-checkout";
import { handleServerActionError, type ActionResult } from "@/server/lib/server-action-error";

/**
 * 🌊 Initialise a Stripe Checkout session from the cart.
 *
 * Validates items, builds Stripe line items, creates a PENDING transaction,
 * and returns the Stripe Checkout redirect URL.
 *
 * Called from CartClient.tsx — the client clears the cart and redirects
 * the browser to the returned URL.
 */
export async function createCheckoutSessionAction(params: {
  items: { ticketPriceId: string; quantity: number }[];
  holderName?: string | null;
  holderPhotoUrl?: string | null;
}): Promise<ActionResult<{ url: string }>> {
  try {
    const result = await createCheckoutSession(params);
    return { success: true, data: { url: result.url } };
  } catch (error) {
    return handleServerActionError(error, "checkout");
  }
}
