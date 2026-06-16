import { NextResponse } from "next/server"
import { prisma } from "@/server/lib/prisma"
import { authenticateRequest } from "@/server/lib/api-key-auth"
import { requireSuperAdmin, validateFacilityAccess } from "@/server/lib/auth-guards"
import { handleServerActionError } from "@/server/lib/server-action-error"
import { z } from "zod"

const reorderSchema = z.object({
  orderedTicketIds: z.array(z.string().uuid()),
})

/**
 * 🎫 Ticket Group Reorder API
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { id: groupId } = await params
    
    const json = await request.json()
    const { orderedTicketIds } = reorderSchema.parse(json)

    const group = await prisma.ticketGroup.findUnique({
      where: { id: groupId },
      select: { facilityId: true }
    })

    if (!group) {
      return NextResponse.json({ error: "Ticket group not found" }, { status: 404 })
    }

    await validateFacilityAccess(group.facilityId, user)

    // Update orders in a transaction
    await prisma.$transaction(
      orderedTicketIds.map((id, index) => 
        prisma.ticket.update({
          where: { id, groupId }, // Security: ensure ticket belongs to this group
          data: { displayOrder: index }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
