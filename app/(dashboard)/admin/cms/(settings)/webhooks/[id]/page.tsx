import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadCmsWebhookDetail } from "@/app/(dashboard)/admin/cms/_data/cms-loaders";
import { WebhookEditClient } from "../_components/webhook-edit-client";

export const metadata: Metadata = {
  title: "Izmeni vebhuk | CMS | Splashdeals",
};

export default async function EditWebhookPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  await connection();
  const { id } = await params;
  const detail = await loadCmsWebhookDetail(id);
  if (!detail) notFound();

  return <WebhookEditClient webhook={detail.webhook} logs={detail.logs} />;
}
