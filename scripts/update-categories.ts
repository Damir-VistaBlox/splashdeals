/**
 * Update facility categories from English to Serbian values.
 * Run: npx tsx scripts/update-categories.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Before update:");
  const before = await prisma.facility.findMany({ select: { name: true, category: true } });
  before.forEach(f => console.log(`  ${f.name} → ${f.category}`));

  // Update Waterpark → Akva Park
  const waterResult = await prisma.facility.updateMany({
    where: { category: { equals: "Waterpark", mode: "insensitive" } },
    data: { category: "Akva Park" },
  });
  console.log(`\nUpdated Waterpark → Akva Park: ${waterResult.count} facilities`);

  // Update Swimming Pool → Bazen
  const poolResult = await prisma.facility.updateMany({
    where: { category: { equals: "Swimming Pool", mode: "insensitive" } },
    data: { category: "Bazen" },
  });
  console.log(`Updated Swimming Pool → Bazen: ${poolResult.count} facilities`);

  // Also update any other English categories that have Serbian mappings
  console.log("\nAll unique categories in DB now:");
  const all = await prisma.facility.findMany({ distinct: ["category"], select: { category: true } });
  all.forEach(c => console.log(`  ${c.category}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
