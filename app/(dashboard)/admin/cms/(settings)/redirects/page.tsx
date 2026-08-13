import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { listRedirectsAction } from "@/app/(server)/actions/redirects";
import { RedirectManager } from "./_components/redirect-manager";
import { connection } from "next/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menadžer preusmerenja | CMS | Splashdeals",
};

export default async function RedirectsPage() {
  await requireAdmin();
  await connection();

  const result = await listRedirectsAction();
  const redirects = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Menadžer preusmerenja</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Upravljajte 301/302 preusmerenjima. Organizujte ih po izvornom URL-u.
        </p>
      </div>

      <RedirectManager initialRedirects={redirects} />
    </div>
  );
}
