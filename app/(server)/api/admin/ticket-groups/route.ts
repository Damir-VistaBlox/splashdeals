import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateRequest } from "@/lib/api-key-auth"
import { requireSuperAdmin, validateFacilityAccess } from "@/lib/auth-guards"
import { ticketGroupSchema } from "@/lib/validations/ticket"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🎫 Ticket Groups API - List & Create
 */
export async function GET(request: Request) {
  try {
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { searchParams } = new URL(request.url)
    const facilityId = searchParams.get("facilityId")

    if (!facilityId) {
      return NextResponse.json({ error: "facilityId is required" }, { status: 400 })
    }

    await validateFacilityAccess(facilityId, user)

    const groups = await prisma.ticketGroup.findMany({
      where: { facilityId },
      orderBy: { displayOrder: "asc" },
      include: {
        tickets: {
          orderBy: { displayOrder: "asc" }
        }
      }
    })

    return NextResponse.json(groups)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticateRequest(request).catch(() => requireSuperAdmin())
    const json = await request.json()
    const validated = ticketGroupSchema.parse(json)

    await validateFacilityAccess(validated.facilityId, user)

    const group = await prisma.ticketGroup.create({
      data: {
        facilityId: validated.facilityId,
        title: validated.title,
        titleSr: validated.titleSr,
        description: validated.description,
        descriptionSr: validated.descriptionSr,
        displayOrder: validated.displayOrder,
        isActive: validated.isActive,
        slug: validated.slug,
      }
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
