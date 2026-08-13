import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/(dashboard)/admin/_common/TableSkeleton";
import { AdminPageShell } from "@/app/(dashboard)/admin/_common/AdminPageShell";
import { requireSuperAdmin } from "@/app/(server)/lib/auth-guards";
import { getCustomerCounts } from "@/app/(server)/lib/data/admin";
import { CustomersTable } from "./_components/customers-table";

export const metadata: Metadata = {
  title: "Kupci | Splashdeals Admin",
  description: "Upravljanje korisničkim nalozima kupaca, aktivnim kartama i istorijom kupovine.",
};

export default async function CustomersManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  await connection();
  const { page, limit, search } = await searchParams;
  await requireSuperAdmin({ redirect: true });

  const counts = await getCustomerCounts();

  const stats = [
    {
      label: "Ukupno naloga",
      value: counts.total,
      color: "text-foreground",
      glow: "border-border bg-muted/10",
    },
    {
      label: "Aktivne karte",
      value: counts.withActiveTickets,
      color: "text-primary",
      glow: "border-primary/10 bg-primary/[0.02]",
    },
    {
      label: "Sa prometom",
      value: counts.withTransactions,
      color: "text-amber-400",
      glow: "border-amber-500/10 bg-amber-500/[0.02]",
    },
  ];

  return (
    <AdminPageShell
      title="Kupci"
      subtitle="Operativni pregled baze kupaca, njihove aktivnosti kupovine i aktivnih ulaznica iz jednog administrativnog toka."
      stats={stats}
      statsGridCols="md:grid-cols-3 lg:grid-cols-3"
    >
      <Suspense key={`${page}-${limit}-${search}`} fallback={<TableSkeleton />}>
        <CustomersTable page={page} limit={limit} search={search} />
      </Suspense>
    </AdminPageShell>
  );
}
