import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin, validateFacilityAccess } from "@/lib/auth-guards"
import { authenticateRequest } from "@/lib/api-key-auth"
import { upsertTicketSchema } from "@/lib/validations/ticket"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🎟️ Ticket API - Detail, Update, Delete
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        facility: {
          select: { name: true }
        },
        group: true
      }
    })
    
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    await validateFacilityAccess(ticket.facilityId, user)
    
    return NextResponse.json(ticket)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.ticket.findUnique({
      where: { id },
      select: { facilityId: true }
    })
    if (!existing) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    await validateFacilityAccess(existing.facilityId, user)

    const json = await request.json()
    const validated = upsertTicketSchema.partial().parse(json)
    
    // Convert dates if provided as strings
    const saleStart = validated.saleStart ? new Date(validated.saleStart) : undefined
    const saleEnd = validated.saleEnd ? new Date(validated.saleEnd) : undefined

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...validated,
        saleStart,
        saleEnd
      }
    })
    
    return NextResponse.json(ticket)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.ticket.findUnique({
      where: { id },
      select: { facilityId: true }
    })
    if (!existing) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    await validateFacilityAccess(existing.facilityId, user)
    
    await prisma.ticket.delete({
      where: { id }
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
