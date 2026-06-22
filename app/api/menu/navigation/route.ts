import { prisma } from "@/server/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const menus = await prisma.navigationMenu.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: [{ column: "asc" }, { sortOrder: "asc" }],
          include: {
            items: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    })

    return NextResponse.json({ menus })
  } catch (error) {
    console.error("[navigation-api] Failed to fetch menus:", error)
    return NextResponse.json({ menus: [] }, { status: 500 })
  }
}
