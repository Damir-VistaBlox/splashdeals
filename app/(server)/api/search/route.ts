import { NextResponse } from "next/server";
import { prisma } from "@/app/(server)/lib/prisma";

/**
 * 🔍 Public Search API
 * Returns facilities matching the query (by name or city).
 * Used by GlobalSearch and search page components.
 *
 * GET /api/search?q=lazaro
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const facilities = await prisma.facility.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        category: true,
      },
      take: 10,
    });

    const results = facilities.map((f) => ({
      id: f.id,
      href: `/${f.slug}`,
      type: "facility" as const,
      title: f.name,
      subtitle: f.city,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json([]);
  }
}
