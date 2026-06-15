import { prisma } from "../lib/prisma"
import { DayType, TimeSlot } from "@prisma/client"

async function main() {
  console.log("🚀 Starting Production Data Migration (Flat to Hierarchical)...")

  // 1. Fetch all facilities with their old tickets
  const facilities = await prisma.facility.findMany({
    include: {
      tickets: true
    }
  })

  for (const facility of facilities) {
    console.log(`\nProcessing Facility: ${facility.name}`)
    
    for (const oldTicket of facility.tickets) {
      // 2. Create a Group for each old Ticket (1:1 Migration to maintain layout)
      const group = await prisma.ticketGroup.create({
        data: {
          facilityId: facility.id,
          title: oldTicket.title,
          description: oldTicket.description,
          slug: oldTicket.slug,
          isActive: oldTicket.isActive,
          displayOrder: oldTicket.displayOrder,
          tiers: {
            create: [
              {
                label: "Standard",
                price: oldTicket.price,
                originalPrice: oldTicket.originalPrice,
                isActive: true,
                displayOrder: 0,
                dayType: DayType.ALL,
                timeSlot: TimeSlot.FULL_DAY,
                requiresIdentity: oldTicket.requiresIdentity,
                requiresPhoto: oldTicket.requiresPhoto,
                isSeasonPass: oldTicket.validityType === "SUMMER_SEASON",
              }
            ]
          }
        },
        include: {
          tiers: true
        }
      })

      const newTier = group.tiers[0]
      console.log(`   - Migrated "${oldTicket.title}" -> Group "${group.title}" (Tier ID: ${newTier.id})`)

      // 3. Update IssuedTickets (The most critical part)
      const updateResult = await prisma.issuedTicket.updateMany({
        where: { ticketId: oldTicket.id },
        data: {
          ticketTierId: newTier.id,
          ticketGroupId: group.id
        }
      })

      console.log(`     - Updated ${updateResult.count} issued tickets.`)
    }
  }

  console.log("\n✅ Migration successfully completed!")
  console.log("⚠️  Action Required: You can now safely deprecate the old 'Ticket' model in schema.prisma after verification.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
