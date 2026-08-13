import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaGallery } from "./_components/media-gallery";
import { prisma } from "@/app/(server)/lib/prisma";
import { getFacilityAdminShell } from "../_lib/get-facility-admin";
import { connection } from "next/server";
import { MediaPurpose } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

const PAGE_SIZE = 50;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "facility-id": string }>;
}): Promise<Metadata> {
  const { "facility-id": facilityId } = await params;
  const facility = await getFacilityAdminShell(facilityId);
  return {
    title: `${facility?.name || "Objekat"} — Mediji | Splashdeals Admin`,
    description: `Galerija i brending za ${facility?.name || "ovaj objekat"}.`,
  };
}

export default async function MediaPage({
  params,
  searchParams,
}: {
  params: Promise<{ "facility-id": string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { "facility-id": facilityId } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;
  await connection();

  const facility = await getFacilityAdminShell(facilityId);
  if (!facility) return notFound();

  const [mediaItems, totalCount] = await Promise.all([
    prisma.facilityMedia.findMany({
      where: { facilityId, purpose: { not: MediaPurpose.TICKET } },
      orderBy: { order: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.facilityMedia.count({
      where: { facilityId, purpose: { not: MediaPurpose.TICKET } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-8 duration-500">
      <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-2xl border p-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-muted/50 h-8 w-8 rounded-lg p-0"
            >
              <Link href={`/admin/facilities/${facilityId}`}>
                <Icon name="keyboard_arrow_left" className="size-4" />
              </Link>
            </Button>
            <h1 className="text-foreground text-2xl font-black tracking-tight">
              Medijska biblioteka
            </h1>
          </div>
          <p className="text-muted-foreground ml-11 text-[10px] font-bold tracking-[0.2em] uppercase">
            Fotografije, video i SEO ALT oznake za {facility.name}
          </p>
        </div>
        <div className="border-primary/20 bg-primary/10 rounded-full border px-4 py-1.5">
          <span className="text-primary text-[10px] font-black tracking-widest uppercase">
            Vizuelni sloj
          </span>
        </div>
      </div>

      <MediaGallery
        facilityId={facilityId}
        initialMedia={mediaItems}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
