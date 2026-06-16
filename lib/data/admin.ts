import { cacheLife } from "next/cache"
import { prisma } from "@/server/lib/prisma"

export async function getAdminDashboardStats() {
  "use cache"
  cacheLife("minutes")

  const [revenueRaw, facilityCount, userCount, ticketCount] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "SUCCESS" },
      _sum: { totalAmount: true },
    }),
    prisma.facility.count(),
    prisma.user.count(),
    prisma.ticket.count({ where: { isActive: true } }),
  ])

  return {
    totalRevenue: Number(revenueRaw._sum.totalAmount || 0),
    activeFacilities: facilityCount,
    totalCustomers: userCount,
    activeTickets: ticketCount,
  }
}

export async function getRecentActivity() {
  "use cache"
  cacheLife("minutes")

  return prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      facility: { select: { city: true } },
    },
  })
}

export async function getFacilityCounts() {
  "use cache"
  cacheLife("minutes")

  const [total, active, closed, emergency] = await Promise.all([
    prisma.facility.count(),
    prisma.facility.count({ where: { status: "ACTIVE" } }),
    prisma.facility.count({ where: { status: "CLOSED" } }),
    prisma.facility.count({ where: { status: "EMERGENCY_SHUTDOWN" } }),
  ])

  return { total, active, closed, emergency }
}

export async function getUserCounts() {
  "use cache"
  cacheLife("minutes")

  const [total, superAdmins, facilityStaff] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SUPER_ADMIN" } }),
    prisma.user.count({ where: { role: "FACILITY_STAFF" } }),
  ])

  return { total, superAdmins, facilityStaff }
}
