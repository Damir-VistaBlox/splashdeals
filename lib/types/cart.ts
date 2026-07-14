/**
 * 🛒 Shared cart types for the cart session and normalized items.
 *
 * CartItem matches the CartSessionItem Prisma model.
 * CartItemInput is the only cart metadata trusted from the client.
 * All display, price, facility, and restriction fields are hydrated server-side.
 */

export interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  title: string;
  price: number;
  currency: string;
  facilityId: string;
  facilityName?: string;
  category?: string;
  validityType?: string;
  requiresIdentity?: boolean;
  requiresPhoto?: boolean;
  imageUrl?: string | null;
  minPeople?: number;
  maxPeople?: number | null;
  updatedAt: number; // Unix ms for conflict resolution
}

export interface CartItemInput {
  ticketPriceId: string;
  quantity: number;
}

export interface DiscountInfo {
  campaignId: string;
  code: string;
  discountPercent: number;
}

export const MAX_QUANTITY_PER_ITEM = 50;
