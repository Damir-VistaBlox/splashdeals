import Link from "next/link";
import { FacilityProfileForm } from "./_components/facility-profile-form";
import { CityLabels } from "./_components/city-labels";
import { FacilityOwnersWidget } from "./_components/facility-owners-widget";
import { prisma } from "@/app/(server)/lib/prisma";
import { getFacilityAdminShell } from "../_lib/get-facility-admin";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/app/(server)/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "facility-id": string }>;
}): Promise<Metadata> {
  const { "facility-id": facilityId } = await params;
  const facility = await getFacilityAdminShell(facilityId);
  return {
    title: `${facility?.name || "Objekat"} — Profil | Splashdeals Admin`,
    description: `Profil, upravljanje i SEO za ${facility?.name || "ovaj objekat"}.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ "facility-id": string }>;
}) {
  const { "facility-id": facilityId } = await params;
  await connection();

  const [facility, transactionCount, session] = await Promise.all([
    prisma.facility.findUnique({
      where: { id: facilityId },
      include: {
        hours: { orderBy: { dayOfWeek: "asc" } },
        closures: { orderBy: { startDate: "asc" } },
      },
    }),
    prisma.transaction.count({
      where: { facilityId },
    }),
    auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  if (!facility) notFound();

  const userRole = session?.user?.role || "GUEST";

  return (
    <div className="flex flex-col gap-5">
      <section className="border-border/60 bg-card/95 relative overflow-hidden rounded-[30px] border p-5 shadow-sm md:p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_60%)] lg:block" />
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-4">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-border bg-muted/50 mt-1 rounded-2xl p-0"
            >
              <Link href={`/admin/facilities/${facilityId}`} aria-label="Nazad na pregled objekta">
                <Icon name="keyboard_arrow_left" className="size-4" />
              </Link>
            </Button>
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
                <span className="size-2 rounded-full bg-sky-500" />
                Profil objekta
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-black tracking-tight uppercase">
                  Profil i SEO
                </h1>
                <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
                  Uredite javni identitet objekta, lokacijske podatke, vizuelne elemente i
                  signalizaciju za pretragu iz jednog radnog prikaza.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Status
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">
                {facility.status}
              </div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Grad
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">
                {facility.city}
              </div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Transakcije
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">
                {transactionCount}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FacilityProfileForm
        facility={facility}
        userRole={userRole}
        transactionCount={transactionCount}
      />
      <div className="border-border/60 bg-card/95 rounded-[28px] border p-6 shadow-sm">
        <CityLabels facilityId={facilityId} />
      </div>
      <FacilityOwnersWidget facilityId={facilityId} />
    </div>
  );
}
