import { NextResponse } from "next/server"
import { prisma } from "@/server/lib/prisma"
import { authenticateRequest } from "@/server/lib/api-key-auth"
import { requireSuperAdmin } from "@/server/lib/auth-guards"
import { upsertTicketSchema } from "@/server/lib/validations/ticket"
import { handleServerActionError } from "@/server/lib/server-action-error"

/**
 * 🎟️ Tickets API - List & Create
 */
export async function GET(request: Request) {
  try {
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { searchParams } = new URL(request.url)
    const facilityId = searchParams.get("facilityId")
    
    const tickets = await prisma.ticket.findMany({
      where: facilityId ? { facilityId } : {},
      orderBy: { updatedAt: "desc" },
      include: {
        facility: {
          select: { name: true }
        }
      }
    })
    return NextResponse.json(tickets)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}

export async function POST(request: Request) {
  try {
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const json = await request.json()
    const validated = upsertTicketSchema.parse(json)
    
    // Convert dates if provided as strings
    const saleStart = validated.saleStart ? new Date(validated.saleStart) : null
    const saleEnd = validated.saleEnd ? new Date(validated.saleEnd) : null

    const ticket = await prisma.ticket.create({
      data: {
        ...validated,
        saleStart,
        saleEnd,
        id: undefined // Ensure we don't try to use the optional ID from schema
      }
    })
    
    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
