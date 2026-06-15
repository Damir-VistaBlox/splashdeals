import { prisma } from "../lib/prisma";

async function main() {
  const facilities = await prisma.facility.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      tickets: {
        select: {
          id: true,
          title: true,
          isActive: true
        }
      },
      ticketGroups: {
        select: {
          id: true,
          title: true,
          isActive: true
        }
      }
    }
  });
  console.log(JSON.stringify(facilities, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
