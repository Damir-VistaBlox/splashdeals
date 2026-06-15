import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const facilities = await prisma.facility.findMany({
    select: { id: true, name: true, city: true, status: true, slug: true, description: true },
    orderBy: { name: 'asc' }
  })
  console.log(JSON.stringify(facilities, null, 2))
  await prisma.$disconnect()
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e.message); process.exit(1) })
