"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { processImageToWebP } from "@/lib/media"
import { validateAction } from "@/lib/actions/validator"
import { validateFacilityAccess, requireSuperAdmin } from "@/lib/auth-guards"
import { handleServerActionError } from "@/lib/server-action-error"

const deleteGlobalAmenitySchema = z.object({
  amenityId: z.string(),
  facilityId: z.string(),
})

const updateFacilityAmenitiesSchema = z.object({
  facilityId: z.string(),
  data: z.array(z.object({
    amenityId: z.string(),
    checked: z.boolean(),
    value: z.string().nullable().optional(),
    displayOrder: z.number().optional(),
    name: z.string().optional(),
    category: z.string().nullable().optional(),
    icon: z.string().optional(),
    type: z.enum(["QUANTIFIABLE", "BOOLEAN", "TEXT"]).optional(),
    isNew: z.boolean().optional(),
    imageUrl: z.string().nullable().optional(),
    scheduledAt: z.string().nullable().optional(),
    isFeatured: z.boolean().optional(),
  })),
  lastUpdatedAt: z.string().nullable().optional(),
})

const copyAmenitiesSchema = z.object({
  sourceFacilityId: z.string(),
  targetFacilityId: z.string(),
})

const uploadAmenityImageSchema = z.object({
  facilityId: z.string(),
  amenityId: z.string(),
})

/**
 * Delete a custom amenity from the global registry.
 */
export async function deleteGlobalAmenity(amenityId: string, facilityId: string) {
  try {
    const validation = await validateAction(deleteGlobalAmenitySchema, { amenityId, facilityId })
    if (!validation.success) throw new Error(validation.error)

    await validateFacilityAccess(facilityId)

    const amenity = await prisma.amenity.findUnique({
      where: { id: amenityId },
      select: { isSeeded: true }
    })

    if (!amenity) throw new Error("Amenity not found")
    if (amenity.isSeeded) throw new Error("Cannot delete seeded infrastructure")

    await prisma.amenity.delete({
      where: { id: amenityId }
    })

    revalidatePath(`/admin/facilities/${facilityId}/amenities`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * Fetch all available amenities and the ones already assigned to a facility.
 */
export async function getFacilityAmenities(facilityId: string) {
  try {
    const [allAmenities, facilityAmenities, totalFacilities, globalAssignments, facility] = await Promise.all([
      prisma.amenity.findMany({ orderBy: { name: 'asc' } }),
      prisma.facilityAmenity.findMany({
        where: { facilityId },
        orderBy: { displayOrder: 'asc' }
      }),
      prisma.facility.count(),
      prisma.facilityAmenity.findMany({
        select: {
          amenityId: true,
          facility: {
            select: { name: true }
          }
        }
      }),
      prisma.facility.findUnique({
        where: { id: facilityId },
        select: { city: true, updatedAt: true }
      })
    ])

    const coverageMap: Record<string, string[]> = {}
    globalAssignments.forEach(ga => {
      if (!coverageMap[ga.amenityId]) coverageMap[ga.amenityId] = []
      coverageMap[ga.amenityId].push(ga.facility.name)
    })

    return { 
      success: true,
      facilityCity: facility?.city || "",
      lastUpdatedAt: facility?.updatedAt?.toISOString() || null,
      allAmenities: allAmenities.map(a => ({
        ...a,
        coverage: coverageMap[a.id] || [],
        totalFacilities
      })), 
      facilityAmenities 
    }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * Bulk update facility amenities.
 */
export async function updateFacilityAmenities(
  facilityId: string, 
  data: z.infer<typeof updateFacilityAmenitiesSchema>["data"],
  lastUpdatedAt?: string | null
) {
  try {
    const validation = await validateAction(updateFacilityAmenitiesSchema, { facilityId, data, lastUpdatedAt })
    if (!validation.success) throw new Error(validation.error)
    
    await validateFacilityAccess(facilityId)
    const userId = validation.userId

    if (lastUpdatedAt) {
      const facility = await prisma.facility.findUnique({
        where: { id: facilityId },
        select: { updatedAt: true }
      })
      
      if (facility && facility.updatedAt.toISOString() !== lastUpdatedAt) {
        throw new Error("CONFLICT: This facility was modified by another admin while you were editing.")
      }
    }

    const currentAmenities = await prisma.facilityAmenity.findMany({
      where: { facilityId }
    })

    await prisma.$transaction(async (tx) => {
      for (const item of validation.data.data) {
        const existing = currentAmenities.find(a => a.amenityId === item.amenityId)
        let finalAmenityId = item.amenityId;

        if (item.isNew && item.name) {
          const newAmenity = await tx.amenity.create({
            data: {
              name: item.name,
              icon: item.icon || "Sparkles",
              category: item.category || "General",
              type: item.type || "BOOLEAN"
            }
          });
          finalAmenityId = newAmenity.id;
        }

        const auditEntries: { action: string, oldValue?: string | null, newValue?: string | null }[] = []

        if (item.checked) {
          if (!existing) {
            auditEntries.push({ action: "ENABLE", newValue: item.value || "ACTIVE" })
          } else {
            if (existing.value !== item.value) {
              auditEntries.push({ action: "VALUE_CHANGE", oldValue: existing.value, newValue: item.value })
            }
            if (existing.scheduledAt?.toISOString() !== item.scheduledAt) {
              auditEntries.push({ action: "SCHEDULE", oldValue: existing.scheduledAt?.toISOString(), newValue: item.scheduledAt })
            }
            if (existing.isFeatured !== item.isFeatured) {
              auditEntries.push({ action: "PROMOTION", oldValue: existing.isFeatured ? "FEATURED" : "STANDARD", newValue: item.isFeatured ? "FEATURED" : "STANDARD" })
            }
          }

          await tx.facilityAmenity.upsert({
            where: {
              facilityId_amenityId: {
                facilityId,
                amenityId: finalAmenityId,
              }
            },
            update: { 
              value: item.value,
              displayOrder: item.displayOrder ?? 0,
              imageUrl: item.imageUrl,
              scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null,
              isFeatured: item.isFeatured ?? false,
              isActive: true,
              updatedAt: new Date()
            },
            create: {
              facilityId,
              amenityId: finalAmenityId,
              value: item.value,
              displayOrder: item.displayOrder ?? 0,
              imageUrl: item.imageUrl,
              scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : null,
              isFeatured: item.isFeatured ?? false,
              isActive: true
            }
          })
        } else if (existing) {
          auditEntries.push({ action: "DISABLE", oldValue: existing.value || "ACTIVE" })
          await tx.facilityAmenity.delete({
            where: {
              facilityId_amenityId: {
                facilityId,
                amenityId: finalAmenityId,
              }
            }
          })
        }

        if (auditEntries.length > 0) {
          await tx.amenityAuditLog.createMany({
            data: auditEntries.map(entry => ({
              facilityId,
              amenityId: finalAmenityId,
              userId,
              ...entry
            }))
          })
        }
      }
    })

    revalidatePath(`/admin/facilities/${facilityId}/amenities`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * Copy amenities from one facility to another.
 */
export async function copyAmenitiesFromFacility(sourceFacilityId: string, targetFacilityId: string) {
  try {
    const validation = await validateAction(copyAmenitiesSchema, { sourceFacilityId, targetFacilityId })
    if (!validation.success) throw new Error(validation.error)

    await validateFacilityAccess(targetFacilityId)

    const sourceAmenities = await prisma.facilityAmenity.findMany({
      where: { facilityId: sourceFacilityId }
    })

    await prisma.$transaction(async (tx) => {
      await tx.facilityAmenity.deleteMany({
        where: { facilityId: targetFacilityId }
      })

      if (sourceAmenities.length > 0) {
        await tx.facilityAmenity.createMany({
          data: sourceAmenities.map(sa => ({
            facilityId: targetFacilityId,
            amenityId: sa.amenityId,
            value: sa.value,
            displayOrder: sa.displayOrder,
            imageUrl: sa.imageUrl,
            scheduledAt: sa.scheduledAt,
            isActive: sa.isActive
          }))
        })
      }
    })

    revalidatePath(`/admin/facilities/${targetFacilityId}/amenities`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * Retrieve the audit trail.
 */
export async function getAmenityHistoryAction(facilityId: string, amenityId: string) {
  try {
    const history = await prisma.amenityAuditLog.findMany({
      where: { facilityId, amenityId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    return { success: true, data: history }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * Get all orphaned custom amenities.
 */
export async function getOrphanedAmenities() {
  try {
    await requireSuperAdmin()
    return await prisma.amenity.findMany({
      where: {
        facilities: { none: {} },
        isSeeded: false
      },
      orderBy: { name: "asc" }
    })
  } catch (error) {
    return []
  }
}

/**
 * Purge all orphaned amenities.
 */
export async function purgeOrphanedAmenities() {
  try {
    await requireSuperAdmin()

    const orphans = await prisma.amenity.findMany({
      where: {
        facilities: { none: {} },
        isSeeded: false
      }
    })
    
    if (orphans.length === 0) return { success: true, count: 0 }

    const result = await prisma.amenity.deleteMany({
      where: {
        id: { in: orphans.map(o => o.id) }
      }
    })

    return { success: true, count: result.count }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * High-fidelity image upload for amenities.
 */
export async function uploadAmenityImageAction(facilityId: string, amenityId: string, formData: FormData) {
  try {
    const validation = await validateAction(uploadAmenityImageSchema, { facilityId, amenityId })
    if (!validation.success) throw new Error(validation.error)

    await validateFacilityAccess(facilityId)

    const file = formData.get("file") as File
    if (!file) throw new Error("No asset provided")

    const buffer = await file.arrayBuffer()
    const optimized = await processImageToWebP(Buffer.from(buffer))
    
    const blob = await put(`amenities/${facilityId}/${amenityId}-${Date.now()}.webp`, optimized, {
      access: "public",
      contentType: "image/webp"
    })

    await prisma.facilityAmenity.update({
      where: {
        facilityId_amenityId: { facilityId, amenityId }
      },
      data: { imageUrl: blob.url }
    })

    return { success: true, url: blob.url }
  } catch (error) {
    return handleServerActionError(error)
  }
}

/**
 * Cron Action: Process scheduled amenity activations.
 * Flips amenities from 'Scheduled' to 'Active' status once their time has come.
 */
export async function processScheduledAmenities() {
  try {
    const now = new Date()

    // 1. Find all amenities scheduled to activate at or before now
    const toActivate = await prisma.facilityAmenity.findMany({
      where: {
        scheduledAt: {
          lte: now
        }
      }
    })

    if (toActivate.length === 0) {
      return { success: true, count: 0 }
    }

    // 2. Perform transaction to activate them, clear scheduledAt, and write audit logs
    const result = await prisma.$transaction(async (tx) => {
      // Update each amenity
      for (const item of toActivate) {
        await tx.facilityAmenity.update({
          where: {
            facilityId_amenityId: {
              facilityId: item.facilityId,
              amenityId: item.amenityId
            }
          },
          data: {
            isActive: true,
            scheduledAt: null
          }
        })

        // Log the activation audit trail
        await tx.amenityAuditLog.create({
          data: {
            facilityId: item.facilityId,
            amenityId: item.amenityId,
            action: "ENABLE",
            oldValue: "SCHEDULED",
            newValue: item.value || "ACTIVE",
            userId: null // system process
          }
        })
      }

      return { success: true, count: toActivate.length }
    })

    return result
  } catch (error) {
    console.error("Failed to process scheduled amenities:", error)
    throw error
  }
}
