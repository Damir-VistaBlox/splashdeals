import "server-only";

import { prisma } from "@/server/lib/prisma";
import { requireFacilityOwner } from "@/server/lib/auth-guards";

export async function getOwnerFacilitiesAction() {
  const user = await requireFacilityOwner();
  if (user.role === "SUPER_ADMIN") {
    return prisma.facility.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, slug: true, city: true },
    });
  }
  return prisma.facility.findMany({
    where: { owners: { some: { userId: user.id } }, status: "ACTIVE" },
    select: { id: true, name: true, slug: true, city: true },
  });
}

export async function getOwnerTicketPricesAction(facilityId: string) {
  await requireFacilityOwner(facilityId);
  return prisma.ticketPrice.findMany({
    where: {
      ticketType: { category: { facilityId }, isActive: true },
      isActive: true,
    },
    include: {
      ticketType: {
        select: {
          title: true,
          category: { select: { title: true } },
        },
      },
    },
    orderBy: [{ ticketType: { displayOrder: "asc" } }, { displayOrder: "asc" }],
  });
}

export async function updateTicketPriceAction(
  priceId: string,
  data: { price?: number; isActive?: boolean },
  facilityId: string,
) {
  await requireFacilityOwner(facilityId);
  return prisma.ticketPrice.update({ where: { id: priceId }, data });
}

export async function getOwnerSalesAction(facilityId: string, days: number = 30) {
  await requireFacilityOwner(facilityId);
  const since = new Date(Date.now() - days * 86400000);
  return prisma.transaction.findMany({
    where: { facilityId, createdAt: { gte: since }, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      totalAmount: true,
      createdAt: true,
      issuedTickets: { select: { id: true } },
    },
  });
}
