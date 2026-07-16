import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import { prisma } from "@/app/(server)/lib/prisma";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "CMS | Splashdeals Admin",
  description: "Upravljajte blog postovima, stranicama i sadržajem.",
};

const LINKS = [
  { href: "/admin/cms/posts", label: "Objave", icon: "article" },
  { href: "/admin/cms/pages", label: "Strane", icon: "description" },
  { href: "/admin/cms/campaigns", label: "Kampanje", icon: "local_offer" },
  { href: "/admin/cms/webhooks", label: "Vebhukovi", icon: "webhook" },
  { href: "/admin/cms/navigation", label: "Navigacija", icon: "menu" },
  { href: "/admin/cms/tools", label: "Alati", icon: "build" },
] as const;

export default async function CMSHubPage() {
  await requireAdmin();
  await connection();

  const [posts, pages, campaigns, webhooks] = await Promise.all([
    prisma.blogPost.count(),
    prisma.page.count(),
    prisma.campaign.count().catch(() => 0),
    prisma.webhook.count().catch(() => 0),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CMS pregled</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Brzi pristup modulima sadržaja i operativnim alatima.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Objave", value: posts },
          { label: "Strane", value: pages },
          { label: "Kampanje", value: campaigns },
          { label: "Vebhukovi", value: webhooks },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="hover:border-primary/40 flex items-center gap-3 p-4 transition-colors">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name={item.icon} className="text-[20px]" />
              </div>
              <span className="group-hover:text-primary text-sm font-bold tracking-wide uppercase transition-colors">
                {item.label}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
