"use server";

import { prisma } from "@/server/lib/prisma";

export async function searchPlaces(query: string) {
  if (!query || query.length < 2) return [];
  return prisma.populatedPlace.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    take: 10,
  });
}

export async function getFacilityLabels(facilityId: string) {
  return prisma.facilityLabel.findMany({
    where: { facilityId },
    include: { place: true },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
}

export async function addLabel(facilityId: string, placeId: string) {
  const exists = await prisma.facilityLabel.findUnique({
    where: { facilityId_placeId: { facilityId, placeId } },
  });
  if (exists) return exists;
  return prisma.facilityLabel.create({
    data: { facilityId, placeId },
    include: { place: true },
  });
}

export async function removeLabel(id: string) {
  return prisma.facilityLabel.delete({ where: { id } });
}

export async function updateLabel(id: string, data: { label?: string; isPrimary?: boolean }) {
  return prisma.facilityLabel.update({
    where: { id },
    data,
    include: { place: true },
  });
}

export async function setPrimaryLabel(facilityId: string, labelId: string) {
  // Unset all primary for this facility, then set the chosen one
  await prisma.facilityLabel.updateMany({
    where: { facilityId, isPrimary: true },
    data: { isPrimary: false },
  });
  return prisma.facilityLabel.update({
    where: { id: labelId },
    data: { isPrimary: true },
    include: { place: true },
  });
}
