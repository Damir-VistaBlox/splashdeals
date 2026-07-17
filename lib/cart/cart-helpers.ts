import type { DiscountInfo } from "@/lib/types/cart";

/** Notice line from reconcile (title + optional public facility path). */
export type CartReconcileNotice = {
  title: string;
  facilitySlug?: string;
};

export function parseAppliedPromo(value: unknown): DiscountInfo | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.code !== "string" ||
    typeof v.campaignId !== "string" ||
    typeof v.discountPercent !== "number"
  ) {
    return null;
  }
  return {
    code: v.code,
    campaignId: v.campaignId,
    discountPercent: v.discountPercent,
  };
}

export function cartCurrency(items: { currency?: string }[]): string {
  return items.find((i) => i.currency)?.currency || "RSD";
}
