import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadCmsCampaign, loadCmsFacilities } from "@/app/(dashboard)/admin/cms/_data/cms-loaders";
import { CampaignForm } from "../_components/campaign-form";

export const metadata: Metadata = {
  title: "Izmeni kampanju | CMS | Splashdeals",
};

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  await connection();
  const { id } = await params;
  const [campaign, facilities] = await Promise.all([loadCmsCampaign(id), loadCmsFacilities()]);
  if (!campaign) notFound();

  return <CampaignForm mode="edit" campaign={campaign} facilities={facilities} />;
}
