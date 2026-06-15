import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateRequest } from "@/lib/api-key-auth"
import { requireSuperAdmin, validateFacilityAccess } from "@/lib/auth-guards"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🏢 Facility Closures API - Delete
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string, closureId: string }> }
) {
  try {
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { id: facilityId, closureId } = await params
    await validateFacilityAccess(facilityId, user)

    await prisma.facilityClosure.delete({
      where: { 
        id: closureId,
        facilityId // Ensure closure belongs to this facility
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
