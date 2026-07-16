import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import type { Metadata } from "next";
import { OrphanedMediaClient } from "./_components/orphaned-media-client";

export const metadata: Metadata = {
  title: "Neiskorišćeni mediji | CMS | Splashdeals",
};

export default async function OrphanedMediaPage() {
  await requireAdmin();
  await connection();
  return <OrphanedMediaClient />;
}
