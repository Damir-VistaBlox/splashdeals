import { NextResponse } from "next/server";
import { prisma } from "@/server/lib/prisma";
import { authenticateRequest } from "@/server/lib/api-key-auth";
import { requireSuperAdmin, validateFacilityAccess } from "@/server/lib/auth-guards";
import { handleServerActionError } from "@/server/lib/server-action-error";
import { z } from "zod";

const geocodeSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * 📍 Facility Geocoding API - Update Coordinates
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin());
    const { id: facilityId } = await params;
    await validateFacilityAccess(facilityId, user);

    const json = await request.json();
    const validated = geocodeSchema.parse(json);

    const facility = await prisma.facility.update({
      where: { id: facilityId },
      data: {
        lat: validated.lat,
        lng: validated.lng,
      },
    });

    return NextResponse.json({
      id: facility.id,
      lat: facility.lat,
      lng: facility.lng,
    });
  } catch (error) {
    const result = handleServerActionError(error);
    return NextResponse.json(result, { status: result.error ? 400 : 500 });
  }
}
