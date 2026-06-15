"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { FacilityStatus } from "@prisma/client"
import { facilitySchema, type FacilityFormValues } from "@/lib/validations/facility"
import { requireSuperAdmin } from "@/lib/auth-guards"

import { handleServerActionError } from "@/lib/server-action-error"

export async function bulkUpdateFacilityStatusAction(ids: string[], status: FacilityStatus) {
  try {
    await requireSuperAdmin()
    await prisma.facility.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
      },
    })

    revalidatePath("/admin/facilities")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function createFacilityAction(data: FacilityFormValues) {
  try {
    const validatedFields = facilitySchema.parse(data)
    const { name, slug, category, city, streetName, streetNumber, postalCode, status } = validatedFields

    await requireSuperAdmin()
    const facility = await prisma.facility.create({
      data: {
        name,
        slug,
        category,
        city,
        streetName,
        streetNumber,
        postalCode,
        status,
      },
    })

    revalidatePath("/admin/facilities")
    return { success: true, id: facility.id }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}

export async function deleteFacilityAction(id: string) {
  try {
    await requireSuperAdmin()

    // 🛡️ Cascade Guardrail: Verify zero historical transactions exist before purging
    const transactionCount = await prisma.transaction.count({
      where: { facilityId: id },
    })

    if (transactionCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete facility because it has ${transactionCount} active or historical transaction records. Please set its status to CLOSED instead.` 
      }
    }

    await prisma.facility.delete({
      where: { id },
    })

    revalidatePath("/admin/facilities")
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error)
  }
}
