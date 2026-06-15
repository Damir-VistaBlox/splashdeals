import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth-guards"
import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 🔑 API Key Revocation
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin()
    const { id } = params

    await prisma.apiKey.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const result = handleServerActionError(error)
    return NextResponse.json(result, { status: result.error ? 400 : 500 })
  }
}
