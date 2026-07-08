import { Icon } from "@/components/ui/Icon";
import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/(dashboard)/admin/_common/TableSkeleton";
import { AdminMetricCard } from "@/app/(dashboard)/admin/_common/AdminMetricCard";
import { UsersList } from "./_components/users-list";
import { requireSuperAdmin } from "@/server/lib/auth-guards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserCounts } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Korisnici | Splashdeals Admin",
  description: "Manage administrative access and roles for Splashdeals.",
};

export default async function UsersManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  await connection();
  const { page, limit } = await searchParams;
  await requireSuperAdmin({ redirect: true });

  const counts = await getUserCounts();

  const stats = [
    {
      label: "Ukupno administratora",
      value: counts.total,
      color: "text-foreground",
      glow: "border-border bg-muted/10",
    },
    {
      label: "Super administratori",
      value: counts.superAdmins,
      color: "text-primary",
      glow: "border-primary/10 bg-primary/[0.02]",
    },
    {
      label: "Osoblje",
      value: counts.staff,
      color: "text-amber-400",
      glow: "border-amber-500/10 bg-amber-500/[0.02]",
    },
  ];

  return (
    <div className="bg-background border-border/50 relative flex min-h-[calc(100vh-4rem)] w-full flex-col gap-8 overflow-hidden rounded-2xl border p-4 md:p-6">
      {/* Immersive Ambient Glow */}
      <div className="pointer-events-none absolute top-0 right-0 -mt-64 -mr-64 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-2xl font-black tracking-tight uppercase italic">
            Korisnici
          </h1>
          <p className="text-muted-foreground mt-1.5 text-xs font-medium tracking-wider uppercase opacity-80">
            Control administrative access, assign roles, and audit security accounts.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 shrink-0 rounded-xl px-6 text-[11px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
        >
          <Link href="/admin/users/new">
            <Icon name="person_add" className="mr-2 size-4" />
            Novi administrator
          </Link>
        </Button>
      </div>

      <div className="relative z-10 grid gap-4 md:grid-cols-3 lg:grid-cols-3">
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
        <Suspense key={`${page}-${limit}`} fallback={<TableSkeleton />}>
          <UsersList page={page} limit={limit} />
        </Suspense>
      </div>
    </div>
  );
}
