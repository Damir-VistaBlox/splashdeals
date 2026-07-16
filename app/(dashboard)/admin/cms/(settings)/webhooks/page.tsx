import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import type { Metadata } from "next";
import { loadCmsWebhooks } from "@/app/(dashboard)/admin/cms/_data/cms-loaders";
import { WebhooksListClient } from "./_components/webhooks-list-client";

export const metadata: Metadata = {
  title: "Vebhukovi | CMS | Splashdeals",
};

export default async function WebhooksPage() {
  await requireAdmin();
  await connection();
  const webhooks = await loadCmsWebhooks();
  return <WebhooksListClient webhooks={webhooks} />;
}
