import { Icon } from "@/components/ui/Icon";
import { connection } from "next/server";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/(dashboard)/admin/_common/TableSkeleton";
import { AdminMetricCard } from "@/app/(dashboard)/admin/_common/AdminMetricCard";
import { FacilitiesList } from "./_components/facilities-list";
import { getFacilityCounts } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Objekti | Splashdeals Admin",
  description: "Globalni direktorijum akva parkova i operativnih konfiguracija.",
};

export default async function FacilitiesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  await connection();
  const { q, page, limit } = await searchParams;

  const counts = await getFacilityCounts();

  const stats = [
    {
      label: "Ukupno",
      value: counts.total,
      color: "text-foreground",
      glow: "border-border bg-muted/10",
    },
    {
      label: "Aktivni",
      value: counts.active,
      color: "text-primary",
      glow: "border-primary/10 bg-primary/[0.02]",
    },
    {
      label: "Nacrti",
      value: counts.draft,
      color: "text-amber-400",
      glow: "border-amber-500/10 bg-amber-500/[0.02]",
    },
    {
      label: "Zatvoreni",
      value: counts.closed,
      color: "text-muted-foreground",
      glow: "border-muted/10 bg-muted/5",
    },
  ];

  return (
    <div className="bg-background border-border/50 relative flex min-h-[calc(100vh-4rem)] w-full flex-col gap-8 overflow-hidden rounded-2xl border p-4 md:p-6">
      {/* Immersive Ambient Glow */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 -mt-64 -mr-64 h-[500px] w-[500px] rounded-full blur-[120px]" />
      <div className="bg-accent/5 pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[400px] w-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-2xl font-black tracking-tight uppercase italic">
            Objekti
          </h1>
          <p className="text-muted-foreground mt-1.5 text-xs font-medium tracking-wider uppercase opacity-80">
            Manage all waterpark entities, onboard new locations, and overview global status.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 shrink-0 rounded-xl px-6 text-[11px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
        >
          <Link href="/admin/facilities/new">
            <Icon name="add" className="mr-2 text-[16px]" />
            Novi objekat
          </Link>
        </Button>
      </div>

      <div className="relative z-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AdminMetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            glow={stat.glow}
          />
        ))}
      </div>

      <div className="relative z-10 mt-4">
        <Suspense key={`${q}-${page}-${limit}`} fallback={<TableSkeleton />}>
          <FacilitiesList q={q} page={page} limit={limit} />
        </Suspense>
      </div>
    </div>
  );
}
