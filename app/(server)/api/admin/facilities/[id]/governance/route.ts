import { NextResponse } from "next/server"
import { prisma } from "@/server/lib/prisma"
import { authenticateRequest } from "@/server/lib/api-key-auth"
import { requireSuperAdmin, validateFacilityAccess } from "@/server/lib/auth-guards"
import { updateFacilityGovernanceSchema } from "@/server/lib/validations/facility"
import { handleServerActionError } from "@/server/lib/server-action-error"

/**
 * 🏢 Facility Governance API - Patch Profile
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate (API Key or Session)
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { id: facilityId } = await params

    // 2. Authorize
    await validateFacilityAccess(facilityId, user)

    // 3. Validate Payload
    const json = await request.json()
    const validated = updateFacilityGovernanceSchema.parse({
      ...json,
      facilityId, // Ensure ID from URL matches
    })

    // 4. Update Database
    const facility = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const updated = await tx.facility.update({
        where: { id: facilityId },
        data: {
          name: validated.name,
          slug: validated.slug,
          description: validated.description,
          descriptionSr: validated.descriptionSr,
          city: validated.city,
          streetName: validated.streetName,
          streetNumber: validated.streetNumber,
          postalCode: validated.postalCode,
          publicPhone: validated.publicPhone,
          publicEmail: validated.publicEmail,
          socialLinks: validated.socialLinks as any,
          metaTitle: validated.metaTitle,
          metaDescription: validated.metaDescription,
          logoUrl: validated.logoUrl,
          emergencyContact: validated.emergencyContact,
          seoArticle: validated.seoArticle,
          transitGuide: validated.transitGuide,
          status: validated.status,
        }
      })

      // Sync operating hours if provided
      if (validated.hours) {
        await tx.operatingHours.deleteMany({
          where: { facilityId }
        })
        await tx.operatingHours.createMany({
          data: validated.hours.map(h => ({
            facilityId,
            dayOfWeek: h.dayOfWeek,
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: h.isClosed
          }))
        })
      }

      // Sync marketplace cities if provided
      if (validated.targetCityIds) {
        await tx.facilityCity.deleteMany({
          where: { facilityId }
        })
        await tx.facilityCity.createMany({
          data: validated.targetCityIds.map(cityId => ({
            facilityId,
            cityId,
            isPrimary: false
          }))
        })
      }

      return updated
    })

    return NextResponse.json(facility)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
