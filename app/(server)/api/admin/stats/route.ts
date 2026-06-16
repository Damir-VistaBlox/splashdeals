import { NextResponse } from "next/server"
import { prisma } from "@/server/lib/prisma"

export async function GET() {
  const [revenueRaw, facilityCount, userCount, ticketCount, recentActivity] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "SUCCESS" },
      _sum: { totalAmount: true }
    }),
    prisma.facility.count(),
    prisma.user.count(),
    prisma.ticket.count({ where: { isActive: true } }),
    prisma.transaction.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        facility: {
          select: {
            city: true
          }
        }
      }
    })
  ]);

  return NextResponse.json({
    totalRevenue: Number(revenueRaw._sum.totalAmount || 0),
    activeFacilities: facilityCount,
    totalCustomers: userCount,
    activeTickets: ticketCount,
    recentActivity: recentActivity.map(a => ({
      id: a.id,
      totalAmount: a.totalAmount,
      status: a.status,
      createdAt: a.createdAt,
      city: a.facility.city
    })),
    timestamp: new Date().toISOString(),
  })
}
