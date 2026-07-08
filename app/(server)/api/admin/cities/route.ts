import { NextResponse } from "next/server";
import { prisma } from "@/server/lib/prisma";
import { authenticateRequest } from "@/server/lib/api-key-auth";
import { requireSuperAdmin } from "@/server/lib/auth-guards";
import { handleServerActionError } from "@/server/lib/server-action-error";
import { z } from "zod";

const citySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

/**
 * 🏙️ Cities API - List & Create
 */
export async function GET(request: Request) {
  try {
    // Cities are public info, but management list might need auth
    await authenticateRequest(request).catch(() => requireSuperAdmin());

    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { facilities: true },
        },
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    const result = handleServerActionError(error);
    return NextResponse.json(result, { status: result.error ? 400 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    await authenticateRequest(request).catch(() => requireSuperAdmin());

    const json = await request.json();
    const validated = citySchema.parse(json);

    const city = await prisma.city.create({
      data: validated,
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    const result = handleServerActionError(error);
    return NextResponse.json(result, { status: result.error ? 400 : 500 });
  }
}
