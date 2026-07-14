/**
 * Prebuild script — runs before `next build` on Vercel.
 * Applies the cart normalization migration directly (bypassing prisma migrate
 * which times out on Neon pooler advisory locks).
 */
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { neon } = require("@neondatabase/serverless");

async function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("[prebuild] No DATABASE_URL, skipping");
    return null;
  }
  const sql = neon(connectionString);
  const adapter = new PrismaNeon({ sql });
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = await createPrisma();
  if (!prisma) {
    console.log("[prebuild] Skipped — no DB connection");
    return;
  }

  // 1. Remove failed migration marker
  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM "sales"."_prisma_migrations" WHERE "migration_name" = '20260714000001_normalize_cart_items'`
    );
    console.log("[prebuild] Cleared failed migration marker");
  } catch (e) {
    console.log("[prebuild] Marker cleanup: " + e.message);
  }

  // 2. DDL migrations
  const ddls = [
    `ALTER TABLE "sales"."cart_session" ADD COLUMN IF NOT EXISTS "locked_at" TIMESTAMPTZ`,
    `CREATE TABLE IF NOT EXISTS "sales"."cart_session_item" (
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
    )`,
    `CREATE INDEX IF NOT EXISTS "cart_session_item_cart_id_idx" ON "sales"."cart_session_item"("cart_id")`,
    `CREATE TABLE IF NOT EXISTS "sales"."cart_rate_limit" (
      "id"        TEXT NOT NULL,
      "user_id"   TEXT NOT NULL,
      "call_count" INTEGER NOT NULL DEFAULT 1,
      "reset_at"  TIMESTAMPTZ NOT NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "cart_rate_limit_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "cart_rate_limit_user_id_key" UNIQUE ("user_id")
    )`,
  ];

  for (const sql of ddls) {
    const label = sql.substring(0, 60).replace(/\n/g, " ");
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log("[prebuild] OK: " + label);
    } catch (e) {
      console.log("[prebuild] FAIL: " + label + " — " + e.message);
    }
  }

  // 3. Mark migration as applied
  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "sales"."_prisma_migrations" (
        "id", "checksum", "finished_at", "migration_name", "logs",
        "rolled_back_at", "started_at", "applied_steps_count"
      ) VALUES (
        gen_random_uuid()::text, 'manual', CURRENT_TIMESTAMP,
        '20260714000001_normalize_cart_items',
        'Applied via prebuild script',
        NULL, CURRENT_TIMESTAMP, 1
      ) ON CONFLICT ("id") DO NOTHING`
    );
    console.log("[prebuild] Marked migration as applied");
  } catch (e) {
    console.log("[prebuild] Mark migration: " + e.message);
  }

  await prisma.$disconnect();
  console.log("[prebuild] Done");
}

main().catch((e) => {
  console.error("[prebuild] Fatal:", e.message);
  process.exit(0); // Don't fail the build
});
