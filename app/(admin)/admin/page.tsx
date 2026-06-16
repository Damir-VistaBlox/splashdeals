import { connection } from "next/server"
import { prisma } from "@/server/lib/prisma"
import { DashboardClient } from "./_components/DashboardClient"
import { Metadata } from "next"
import { cacheLife } from 'next/cache'

export const metadata: Metadata = {
  title: "Command Center | Governance Hub",
  description: "Real-time institutional oversight and facility management console.",
}

/**
 * 🌊 Aggregated Institutional Intelligence
 * Cached for 1 minute to reduce database overhead on high-frequency admin navigation.
 */
async function getAggregatedStats() {
  "use cache";
  cacheLife("minutes");
  
  const [revenueRaw, facilityCount, userCount, ticketCount] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "SUCCESS" },
      _sum: { totalAmount: true }
    }),
    prisma.facility.count(),
    prisma.user.count(),
    prisma.ticket.count({ where: { isActive: true } }),
  ]);

  return {
    totalRevenue: Number(revenueRaw._sum.totalAmount || 0),
    activeFacilities: facilityCount,
    totalCustomers: userCount,
    activeTickets: ticketCount,
  };
}

export default async function Page() {
  await connection();

  // 🚀 Parallel Extraction: Cached Aggregates + Real-time Stream
  const [stats, recentActivity] = await Promise.all([
    getAggregatedStats(),
    prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        facility: {
          select: {
            city: true
          }
        }
      }
    })
  ]);

  const dashboardData = {
    ...stats,
    recentActivity: recentActivity.map(tx => ({
      id: tx.id,
      totalAmount: Number(tx.totalAmount),
      status: tx.status,
      createdAt: tx.createdAt,
      city: tx.facility.city
    }))
  };

  return <DashboardClient stats={dashboardData} />
}
