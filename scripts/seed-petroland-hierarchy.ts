import { prisma } from "../lib/prisma"
import { DayType, TimeSlot } from "@prisma/client"

async function main() {
  console.log("🌊 Seeding Petroland Hierarchical Tickets...")

  const petroland = await prisma.facility.findUnique({
    where: { slug: "petroland-backi-petrovac" }
  })

  if (!petroland) {
    console.error("❌ Petroland not found. Please run main seed first.")
    return
  }

  // 1. Create "Dnevne Ulaznice" Group
  const dailyGroup = await prisma.ticketGroup.create({
    data: {
      facilityId: petroland.id,
      title: "Dnevne Ulaznice",
      titleSr: "Dnevne Ulaznice",
      description: "Standardne ulaznice za celodnevni boravak u akva parku.",
      descriptionSr: "Standardne ulaznice za celodnevni boravak u akva parku.",
      slug: "dnevne-ulaznice",
      isActive: true,
      displayOrder: 1,
      tiers: {
        create: [
          {
            label: "Odrasli (Radni dan)",
            labelSr: "Odrasli (Radni dan)",
            price: 1600,
            dayType: DayType.WEEKDAY,
            timeSlot: TimeSlot.FULL_DAY,
            displayOrder: 1,
          },
          {
            label: "Odrasli (Vikend)",
            labelSr: "Odrasli (Vikend)",
            price: 1900,
            dayType: DayType.WEEKEND,
            timeSlot: TimeSlot.FULL_DAY,
            displayOrder: 2,
          },
          {
            label: "Deca/Studenti (Radni dan)",
            labelSr: "Deca/Studenti (Radni dan)",
            price: 1200,
            dayType: DayType.WEEKDAY,
            timeSlot: TimeSlot.FULL_DAY,
            displayOrder: 3,
          },
          {
            label: "Deca/Studenti (Vikend)",
            labelSr: "Deca/Studenti (Vikend)",
            price: 1400,
            dayType: DayType.WEEKEND,
            timeSlot: TimeSlot.FULL_DAY,
            displayOrder: 4,
          }
        ]
      }
    }
  })

  // 2. Create "Porodični Paketi" Group
  const familyGroup = await prisma.ticketGroup.create({
    data: {
      facilityId: petroland.id,
      title: "Porodični Paketi",
      titleSr: "Porodični Paketi",
      description: "Najbolja ponuda za porodice sa decom.",
      descriptionSr: "Najbolja ponuda za porodice sa decom.",
      slug: "porodicni-paketi",
      isActive: true,
      displayOrder: 2,
      tiers: {
        create: [
          {
            label: "2 Odraslih + 1 Dete",
            labelSr: "2 Odraslih + 1 Dete",
            price: 3800,
            dayType: DayType.ALL,
            timeSlot: TimeSlot.FULL_DAY,
            minPeople: 3,
            maxPeople: 3,
            displayOrder: 1,
          },
          {
            label: "2 Odraslih + 2 Dece",
            labelSr: "2 Odraslih + 2 Dece",
            price: 4600,
            dayType: DayType.ALL,
            timeSlot: TimeSlot.FULL_DAY,
            minPeople: 4,
            maxPeople: 4,
            displayOrder: 2,
          }
        ]
      }
    }
  })

  // 3. Create "Sezonske Karte" Group
  const seasonGroup = await prisma.ticketGroup.create({
    data: {
      facilityId: petroland.id,
      title: "Sezonske Karte",
      titleSr: "Sezonske Karte",
      description: "Neograničen pristup tokom celog leta.",
      descriptionSr: "Neograničen pristup tokom celog leta.",
      slug: "sezonske-karte",
      isActive: true,
      displayOrder: 3,
      tiers: {
        create: [
          {
            label: "Premium Sezonska",
            labelSr: "Premium Sezonska",
            price: 12000,
            isSeasonPass: true,
            requiresIdentity: true,
            requiresPhoto: true,
            displayOrder: 1,
          }
        ]
      }
    }
  })

  console.log("✅ Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
