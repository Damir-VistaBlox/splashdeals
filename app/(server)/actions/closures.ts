"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { handleServerActionError } from "@/lib/server-action-error"
import { validateFacilityAccess } from "@/lib/auth-guards"

const closureSchema = z.object({
  facilityId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().max(200).nullish(),
})

export async function addFacilityClosureAction(data: z.infer<typeof closureSchema>) {
  try {
    const validated = closureSchema.parse(data)
    await validateFacilityAccess(validated.facilityId)
    const closure = await prisma.facilityClosure.create({
      data: {
        facilityId: validated.facilityId,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        reason: validated.reason || "Scheduled maintenance or blackout period",
      },
    })

    revalidatePath(`/admin/facilities/${validated.facilityId}`)
    return { success: true, data: closure }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function removeFacilityClosureAction(closureId: string, facilityId: string) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.facilityClosure.delete({
      where: { id: closureId },
    })

    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}
