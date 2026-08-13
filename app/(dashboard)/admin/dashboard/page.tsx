import { connection } from "next/server";
import { DashboardClient } from "./_components/DashboardClient";
import type { Metadata } from "next";
import { getAdminDashboardStats, getRecentActivity } from "@/app/(server)/lib/data/admin";

export const metadata: Metadata = {
  title: "Kontrolni centar | Splashdeals Admin",
  description:
    "Centralni operativni pregled prodaje, objekata i sadržaja na platformi Splashdeals.",
};

export default async function DashboardPage() {
  await connection();

  const [stats, recentActivity] = await Promise.all([
    getAdminDashboardStats(),
    getRecentActivity(),
  ]);

  return <DashboardClient stats={stats} recentActivity={recentActivity} />;
}
