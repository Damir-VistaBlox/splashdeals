import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser (handles quoted fields)
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
        continue;
      }
      current += ch;
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    rows.push(row);
  }
  return rows;
}

async function main() {
  console.log("🌍 Seeding Populated Places...");

  const csvPath = path.join(__dirname, "populated-places.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");
  const records = parseCSV(raw);

  console.log(`📄 Read ${records.length} places from CSV`);

  // Batch insert in chunks of 500
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const data = batch.map((r: Record<string, string>) => ({
      name: r.name,
      type: r.type || null,
      municipality: r.municipality || null,
      district: r.district || null,
      region: r.region || null,
      postalCode: r.postalCode || null,
      latitude: r.latitude ? parseFloat(r.latitude) : null,
      longitude: r.longitude ? parseFloat(r.longitude) : null,
      slug: r.slug,
    }));

    await prisma.populatedPlace.createMany({ data, skipDuplicates: true });
    inserted += batch.length;
    console.log(`  ✅ ${inserted}/${records.length}`);
  }

  console.log(`✅ Seeded ${inserted} populated places successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
