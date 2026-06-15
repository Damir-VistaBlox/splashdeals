import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateRequest } from "@/lib/api-key-auth"
import { requireSuperAdmin, validateFacilityAccess } from "@/lib/auth-guards"
import { updateFacilityStatusSchema } from "@/lib/validations/facility"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🏢 Facility Status API - Patch Status
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
    const validated = updateFacilityStatusSchema.parse({
      ...json,
      facilityId,
    })

    // 4. Update Database
    const facility = await prisma.facility.update({
      where: { id: facilityId },
      data: {
        status: validated.status
      }
    })

    return NextResponse.json(facility)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
