-- Enforce one active cart per authenticated user and one row per ticket price in a cart.
-- A live preflight check on 2026-07-15 found no duplicate groups for either key.

DROP INDEX IF EXISTS "sales"."CartSession_userId_idx";

CREATE UNIQUE INDEX "CartSession_userId_key"
  ON "sales"."CartSession"("userId");

CREATE UNIQUE INDEX "CartSessionItem_cartId_ticketPriceId_key"
  ON "sales"."CartSessionItem"("cartId", "ticketPriceId");
