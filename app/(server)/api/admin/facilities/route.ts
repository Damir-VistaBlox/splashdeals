import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateRequest } from "@/lib/api-key-auth"
import { requireSuperAdmin } from "@/lib/auth-guards"
import { facilitySchema } from "@/lib/validations/facility"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🏢 Facilities API - List & Create
 */
export async function GET(request: Request) {
  try {
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const facilities = await prisma.facility.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { tickets: true }
        }
      }
    })
    return NextResponse.json(facilities)
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}

export async function POST(request: Request) {
  try {
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const json = await request.json()
    const validated = facilitySchema.parse(json)
    
    const facility = await prisma.facility.create({
      data: validated
    })
    
    return NextResponse.json(facility, { status: 201 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
