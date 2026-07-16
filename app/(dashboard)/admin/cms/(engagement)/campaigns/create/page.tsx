import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import type { Metadata } from "next";
import { loadCmsFacilities } from "@/app/(dashboard)/admin/cms/_data/cms-loaders";
import { CampaignForm } from "../_components/campaign-form";

export const metadata: Metadata = {
  title: "Nova kampanja | CMS | Splashdeals",
};

export default async function CreateCampaignPage() {
  await requireAdmin();
  await connection();
  const facilities = await loadCmsFacilities();
  return <CampaignForm mode="create" facilities={facilities} />;
}
