import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 🌊 SEO Ticket Redirect API
 * 
 * Legacy UUID/Slug ticket URLs → 301 Permanent Redirect to new nested slug URLs.
 * Consolidates redirections with no i18n locale prefixes.
 */

// 🏁 LEGACY UUID REGISTRY
// Maps known orphaned UUIDs from old seeds (found in GSC) to current facility slugs.
const LEGACY_UUID_MAPPING: Record<string, string> = {
  "a05a8c06-1ea8-4d10-b76c-92bad27ffba2": "petroland",
  "02cdc8e7-b0fa-40aa-8880-ead0fe853597": "hollywoodland",
  "0d449ad9-1fe5-4e1f-be61-08a0356d4168": "aquapark-jagodina",
  "1bfabba7-828b-43fd-b7e2-522d4802cfc2": "srebrno-jezero",
  "2723aa99-907c-4fd1-8408-892f76bfa954": "banja-junakovic",
  "6f4ec365-deef-417f-9eeb-f49b2e2c564a": "cair-nis",
  "bc81f58b-d12b-4c15-a6a1-d4e76322663e": "aquapark-izvor"
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  
  if (!id) {
    return NextResponse.redirect(
      new URL("/facilities", request.url),
      { status: 301 }
    );
  }

  const isUuid = UUID_REGEX.test(id);

  try {
    if (isUuid) {
      // 1. Check legacy hardcoded mappings first (legitimate redirects)
      const legacySlug = LEGACY_UUID_MAPPING[id];
      if (legacySlug) {
        const mappedFacility = await prisma.facility.findUnique({
          where: { slug: legacySlug },
          select: { slug: true, category: true }
        });
        
        if (mappedFacility) {
          const catSlug = mappedFacility.category.toLowerCase().replace(/\s+/g, "-");
          const newUrl = `/facilities/${catSlug}/${mappedFacility.slug}`;
          return NextResponse.redirect(new URL(newUrl, request.url), { status: 301 });
        }
      }

      // 2. Try finding by UUID (old pattern)
      const ticket = await prisma.ticket.findUnique({
        where: { id },
        select: { slug: true },
      });

      if (ticket) {
        // Ticket found by UUID → old URL, should be removed from index
        return NextResponse.json(
          { error: "Gone", message: "This ticket URL format is deprecated. Use the slug-based URL instead." },
          { status: 410 }
        );
      }
    }

    // 3. Fallback: try finding by slug
    const ticketBySlug = await prisma.ticket.findUnique({
      where: { slug: id },
      select: { slug: true, facility: { select: { slug: true, category: true } } },
    });

    if (ticketBySlug?.slug) {
      const catSlug = ticketBySlug.facility.category.toLowerCase().replace(/\s+/g, "-");
      const newUrl = `/facilities/${catSlug}/${ticketBySlug.facility.slug}#deals`;
      return NextResponse.redirect(new URL(newUrl, request.url), { status: 301 });
    }

    // 4. Fallback: Check if the ID belongs to a Facility directly (Legacy mismatch)
    const facility = await prisma.facility.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }]
      },
      select: { id: true, slug: true, category: true }
    });

    if (facility) {
      // If it was queried by UUID ID, return 410 Gone
      if (isUuid && facility.id === id) {
        return NextResponse.json(
          { error: "Gone", message: "This facility URL format is deprecated." },
          { status: 410 }
        );
      }

      // If it was queried by slug, redirect 301 to the new slug url
      const catSlug = facility.category.toLowerCase().replace(/\s+/g, "-");
      const newUrl = `/facilities/${catSlug}/${facility.slug}`;
      return NextResponse.redirect(new URL(newUrl, request.url), { status: 301 });
    }

    // 5. Not found — return 410 Gone instead of redirecting to /facilities
    return NextResponse.json(
      { error: "Gone", message: "This URL is no longer available." },
      { status: 410 }
    );
  } catch (error) {
    console.error("Redirect resolution error:", error);
    // Graceful fallback to avoid app crash
    return NextResponse.json(
      { error: "Internal Server Error", message: "An error occurred while resolving this link." },
      { status: 500 }
    );
  }
}
