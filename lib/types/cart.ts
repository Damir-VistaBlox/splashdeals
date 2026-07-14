/**
 * 🛒 Shared cart types for the cart session and normalized items.
 *
 * CartItem matches the CartSessionItem Prisma model.
 * CartItemInput is what the client sends to the server.
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
  facilityId: string;
  quantity: number;
  title: string;
  price: number;
  currency?: string;
  facilityName?: string;
  category?: string;
  validityType?: string;
  requiresIdentity?: boolean;
  requiresPhoto?: boolean;
  imageUrl?: string | null;
  minPeople?: number;
  maxPeople?: number | null;
}

export interface DiscountInfo {
  campaignId: string;
  code: string;
  discountPercent: number;
}

export const MAX_QUANTITY_PER_ITEM = 50;
