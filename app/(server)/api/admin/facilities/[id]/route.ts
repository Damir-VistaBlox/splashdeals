import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth-guards"
import { authenticateRequest } from "@/lib/api-key-auth"
import { facilitySchema } from "@/lib/validations/facility"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🏢 Facility API - Detail, Update, Delete
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { id } = await params
    
    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        tickets: true,
        ticketGroups: true,
        hours: true,
        amenities: {
          include: { amenity: true }
        }
      }
    })
    
    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }
    
    return NextResponse.json(facility)
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
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { id } = await params
    const json = await request.json()

    // Explicitly reject governance and sub-resource fields to guide programmatic callers
    const disallowedFields = [
      "description", "descriptionSr", "publicPhone", "publicEmail", 
      "socialLinks", "hours", "amenities", "targetCityIds", 
      "logoUrl", "emergencyMessage", "seoArticle", "transitGuide", 
      "lat", "lng"
    ]
    const foundDisallowed = Object.keys(json).filter(key => disallowedFields.includes(key))
    if (foundDisallowed.length > 0) {
      return NextResponse.json(
        { error: `Koristite namenske /governance, /operations, /geocode ili /amenities endpointe za ažuriranje polja: ${foundDisallowed.join(", ")}` },
        { status: 400 }
      )
    }

    const validated = facilitySchema.partial().parse(json)
    
    const facility = await prisma.facility.update({
      where: { id },
      data: validated
    })
    
    return NextResponse.json(facility)
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
    await authenticateRequest(request).catch(() => requireSuperAdmin())
    const { id } = await params
    
    await prisma.facility.delete({
      where: { id }
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
