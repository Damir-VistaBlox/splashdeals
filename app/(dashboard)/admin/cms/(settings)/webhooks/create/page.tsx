import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { WebhookForm } from "../_components/webhook-form";

export const metadata: Metadata = {
  title: "Novi vebhuk | CMS | Splashdeals",
};

export default async function CreateWebhookPage() {
  await requireAdmin();
  await connection();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Novi vebhuk</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kreiraj novi vebhuk koji će slati obaveštenja na spoljni URL.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/cms/webhooks">
            <Icon name="arrow_back" className="size-4" />
            Nazad
          </Link>
        </Button>
      </div>
      <WebhookForm mode="create" />
    </div>
  );
}
