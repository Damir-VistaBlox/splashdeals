-- Normalize CartSession: add cart_session_item table, rate limiter, locked_at
-- and data-migrate existing JSON items to the new relational table.
--
-- This migration is idempotent — all DDL uses IF NOT EXISTS / IF EXISTS.

-- Self-heal: remove any failed migration marker from a prior partial run
DELETE FROM "sales"."_prisma_migrations"
WHERE "migration_name" = '20260714000001_normalize_cart_items';

BEGIN;

-- 1. Add locked_at column for TTL-based auto-unlock
ALTER TABLE "sales"."cart_session"
  ADD COLUMN IF NOT EXISTS "locked_at" TIMESTAMPTZ;

-- 2. Create cart_session_item table (normalized cart items)
CREATE TABLE IF NOT EXISTS "sales"."cart_session_item" (
    "id"              TEXT NOT NULL,
    "cart_id"         TEXT NOT NULL,
    "ticket_price_id" TEXT NOT NULL,
    "quantity"        INTEGER NOT NULL DEFAULT 1,
    "title"           TEXT NOT NULL,
    "price"           DOUBLE PRECISION NOT NULL,
    "currency"        TEXT NOT NULL DEFAULT 'RSD',
    "facility_id"     TEXT NOT NULL,
    "facility_name"   TEXT,
    "category"        TEXT,
    "validity_type"   TEXT,
    "requires_identity" BOOLEAN NOT NULL DEFAULT false,
    "requires_photo"    BOOLEAN NOT NULL DEFAULT false,
    "image_url"       TEXT,
    "min_people"      INTEGER,
    "max_people"      INTEGER,
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_session_item_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cart_session_item_cart_id_fkey" FOREIGN KEY ("cart_id")
        REFERENCES "sales"."cart_session"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cart_session_item_cart_id_idx"
    ON "sales"."cart_session_item"("cart_id");

-- 3. Create cart_rate_limit table (DB-backed rate limiting)
CREATE TABLE IF NOT EXISTS "sales"."cart_rate_limit" (
    "id"        TEXT NOT NULL,
    "user_id"   TEXT NOT NULL,
    "call_count" INTEGER NOT NULL DEFAULT 1,
    "reset_at"  TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_rate_limit_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cart_rate_limit_user_id_key" UNIQUE ("user_id")
);

-- 4. Data migration: convert existing JSON items to cart_session_item rows
INSERT INTO "sales"."cart_session_item" (
    "id", "cart_id", "ticket_price_id", "quantity", "title", "price",
    "currency", "facility_id", "facility_name", "category", "validity_type",
    "requires_identity", "requires_photo", "image_url", "min_people", "max_people",
    "created_at", "updated_at"
)
SELECT
    gen_random_uuid()::text,
    cs.id,
    COALESCE((item ->> 'ticketId'), '') AS ticket_price_id,
    COALESCE((item ->> 'quantity')::int, 1) AS quantity,
    COALESCE((item ->> 'title'), '') AS title,
    COALESCE((item ->> 'price')::double precision, 0) AS price,
    COALESCE((item ->> 'currency'), 'RSD') AS currency,
    COALESCE((item ->> 'facilityId'), '') AS facility_id,
    (item ->> 'facilityName') AS facility_name,
    (item ->> 'category') AS category,
    (item ->> 'validityType') AS validity_type,
    COALESCE((item ->> 'requiresIdentity')::boolean, false) AS requires_identity,
    COALESCE((item ->> 'requiresPhoto')::boolean, false) AS requires_photo,
    (item ->> 'imageUrl') AS image_url,
    (item ->> 'minPeople')::int AS min_people,
    (item ->> 'maxPeople')::int AS max_people,
    COALESCE(cs.created_at, CURRENT_TIMESTAMP),
    COALESCE(cs.updated_at, CURRENT_TIMESTAMP)
FROM "sales"."cart_session" cs,
     jsonb_array_elements(
         CASE
             WHEN cs.items IS NULL THEN '[]'::jsonb
             WHEN jsonb_typeof(cs.items::jsonb) = 'array' THEN cs.items::jsonb
             ELSE '[]'::jsonb
         END
     ) AS item
ON CONFLICT DO NOTHING;

COMMIT;
