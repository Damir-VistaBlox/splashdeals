import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  console.log('🌊 Starting Ticket Slug Backfill...');
  console.log(`🔗 Connecting to: ${connectionString.split('@')[1] || 'Unknown'}`);

  const tickets = await prisma.ticket.findMany({
    where: { slug: null },
    select: { id: true, title: true },
  });

  console.log(`🎟️ Found ${tickets.length} tickets to update.`);

  let updatedCount = 0;
  const slugCounts: Record<string, number> = {};

  for (const ticket of tickets) {
    let baseSlug = slugify(ticket.title);
    if (!baseSlug) baseSlug = 'ticket';

    let finalSlug = baseSlug;
    
    // Handle duplicates
    if (slugCounts[finalSlug] !== undefined) {
      slugCounts[finalSlug]++;
      finalSlug = `${baseSlug}-${slugCounts[finalSlug]}`;
    } else {
      // Check if this slug already exists in DB from another ticket
      const existing = await prisma.ticket.findUnique({
        where: { slug: finalSlug }
      });
      
      if (existing) {
        let suffix = 1;
        while (await prisma.ticket.findUnique({ where: { slug: `${baseSlug}-${suffix}` } })) {
          suffix++;
        }
        finalSlug = `${baseSlug}-${suffix}`;
      }
      
      slugCounts[finalSlug] = 0;
    }

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { slug: finalSlug },
    });

    updatedCount++;
    if (updatedCount % 10 === 0) {
      console.log(`✅ Updated ${updatedCount}/${tickets.length} tickets...`);
    }
  }

  console.log(`\n🎉 Success! Backfilled slugs for ${updatedCount} tickets.`);
}

main()
  .catch((e) => {
    console.error('❌ Backfill failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
