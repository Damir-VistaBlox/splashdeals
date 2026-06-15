"use server"

import { prisma } from "@/lib/prisma"
import { FacilityStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { 
  updateFacilityGovernanceSchema, 
  type UpdateFacilityGovernanceValues,
  updateFacilityStatusSchema,
  type UpdateFacilityStatusValues,
  updateFacilityOperationsSchema,
  type UpdateFacilityOperationsValues,
} from "@/lib/validations/facility"
import { validateFacilityAccess } from "@/lib/auth-guards"



import { handleServerActionError } from "@/lib/server-action-error"

export async function updateFacilityStatusAction(rawValues: UpdateFacilityStatusValues) {
  try {
    const validatedFields = updateFacilityStatusSchema.parse(rawValues)
    const { facilityId, status } = validatedFields

    await validateFacilityAccess(facilityId)
    await prisma.facility.update({
      where: { id: facilityId },
      data: { status },
    })

    revalidatePath(`/admin/facilities/${facilityId}`, "layout")
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}

export async function updateFacilityGovernanceAction(rawValues: UpdateFacilityGovernanceValues) {
  try {
    const validatedFields = updateFacilityGovernanceSchema.parse(rawValues)

    const { 
      facilityId, 
      name,
      description, 
      slug, 
      city, 
      streetName, 
      streetNumber, 
      postalCode, 
      targetCityIds,
      metaTitle,
      metaDescription,
      logoUrl,
      publicPhone,
      publicEmail,
      socialLinks,
      emergencyMessage,
      status,
      hours,
      seoArticle,
      transitGuide
    } = validatedFields

    await validateFacilityAccess(facilityId)
    await prisma.$transaction(async (tx) => {
      // 1. Update basic record
      await tx.facility.update({
        where: { id: facilityId },
        data: { 
          name,
          description, 
          slug, 
          city, 
          streetName, 
          streetNumber, 
          postalCode,
          metaTitle,
          metaDescription,
          logoUrl,
          publicPhone,
          publicEmail,
          socialLinks: socialLinks as Record<string, string | null | undefined>,
          emergencyMessage,
          status: status as FacilityStatus,
          seoArticle,
          transitGuide
        },
      })

      // 2. Update Marketplace Tags (Junction Table)
      // strategy: Wipe and rebuild the relationship for atomic consistency
      await tx.facilityCity.deleteMany({
        where: { facilityId }
      })

      if (targetCityIds.length > 0) {
        await tx.facilityCity.createMany({
          data: targetCityIds.map(cityId => ({
            facilityId,
            cityId,
            isPrimary: false // Can be extended later for prioritized sorting
          }))
        })
      }

      // 3. Clear existing hours for this facility and replace with new ones
      await tx.operatingHours.deleteMany({
        where: { facilityId }
      })

      await tx.operatingHours.createMany({
        data: hours.map(h => ({
          facilityId,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        }))
      })
    })

    revalidatePath(`/admin/facilities/${facilityId}`, "layout")
    revalidatePath(`/${facilityId}`, "layout") // Revalidate public views as well if cached
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}

export async function updateFacilityOperationsAction(rawValues: UpdateFacilityOperationsValues) {
  try {
    const validatedFields = updateFacilityOperationsSchema.parse(rawValues)
    const { facilityId, hours } = validatedFields

    await validateFacilityAccess(facilityId)
    await prisma.$transaction(async (tx) => {
      // Clear existing hours for this facility and replace with new ones
      await tx.operatingHours.deleteMany({
        where: { facilityId }
      })

      await tx.operatingHours.createMany({
        data: hours.map(h => ({
          facilityId,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        }))
      })
    })

    revalidatePath(`/admin/facilities/${facilityId}`, "layout")
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}

export async function updateFacilitySocialLinksAction(facilityId: string, socialLinks: Record<string, string>) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.facility.update({
      where: { id: facilityId },
      data: { socialLinks }
    })
    
    revalidatePath(`/admin/facilities/${facilityId}`, "layout")
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}

export async function updateFacilityContactAction(
  facilityId: string,
  contact: { publicPhone: string; publicEmail: string }
) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.facility.update({
      where: { id: facilityId },
      data: { publicPhone: contact.publicPhone, publicEmail: contact.publicEmail }
    })

    revalidatePath(`/admin/facilities/${facilityId}`, "layout")
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}

export async function checkSlugAvailabilityAction(slug: string, excludeFacilityId: string) {
  "use server"
  if (!slug || slug.length < 2) return { isAvailable: true } // Skip checking tiny slugs
  
  try {
    const existing = await prisma.facility.findFirst({
      where: {
        slug: slug.toLowerCase(),
        NOT: { id: excludeFacilityId }
      },
      select: { id: true }
    })
    
    return { isAvailable: !existing }
  } catch (error) {
    return { isAvailable: false, error: "Validation failure" }
  }
}

export async function updateFacilityLogoAction(facilityId: string, logoUrl: string) {
  "use server"
  try {
    await validateFacilityAccess(facilityId)
    await prisma.facility.update({
      where: { id: facilityId },
      data: { logoUrl }
    })
    
    revalidatePath(`/admin/facilities/${facilityId}`, "layout")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}
