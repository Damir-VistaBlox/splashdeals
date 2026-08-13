import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { CMS_NAV } from "./_lib/cms-nav";
import { loadCmsHubStats } from "./_data/cms-loaders";

export const metadata: Metadata = {
  title: "CMS | Splashdeals Admin",
  description: "Upravljajte blog postovima, stranicama i sadržajem.",
};

export default async function CMSHubPage() {
  await requireAdmin();
  await connection();

  const stats = await loadCmsHubStats();

  const hubLinks = CMS_NAV.filter((item) => item.hub);
  const statCards: Array<{ label: string; value: number; href?: string }> = [
    { label: "Objave", value: stats.posts, href: "/admin/cms/posts" },
    { label: "Zakazane", value: stats.scheduled, href: "/admin/cms/posts?status=scheduled" },
    { label: "Strane", value: stats.pages, href: "/admin/cms/pages" },
    { label: "Kategorije", value: stats.categories, href: "/admin/cms/categories" },
    { label: "Oznake", value: stats.tags, href: "/admin/cms/tags" },
    { label: "Kuponi / kampanje", value: stats.campaigns, href: "/admin/cms/campaigns" },
    { label: "Recenzije", value: stats.reviews, href: "/admin/cms/reviews" },
    { label: "Preusmeravanja", value: stats.redirects, href: "/admin/cms/redirects" },
    { label: "Vebhukovi", value: stats.webhooks, href: "/admin/cms/webhooks" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_0.9fr]">
        <Card className="border-border/60 bg-muted/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
              <Icon name="space_dashboard" className="text-[18px]" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight uppercase">
                CMS pregled
              </h2>
              <p className="text-muted-foreground text-sm">
                Brzi pristup modulima sadržaja, navigaciji i alatima za javni sloj sajta.
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Kuponi i kampanje u ovom prostoru odnose se na marketplace akcije. Email kampanje i
            liste ostaju u Listmonk operativnom toku.
          </p>
        </Card>

        <Card className="border-border/60 bg-background/70 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="bolt" className="text-primary text-[18px]" />
            <span className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Brze akcije
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/cms/posts/new"
              className="hover:border-primary/30 bg-muted/30 rounded-xl border border-transparent px-3 py-3 text-xs font-bold uppercase transition-colors"
            >
              Nova objava
            </Link>
            <Link
              href="/admin/cms/pages/new"
              className="hover:border-primary/30 bg-muted/30 rounded-xl border border-transparent px-3 py-3 text-xs font-bold uppercase transition-colors"
            >
              Nova strana
            </Link>
            <Link
              href="/admin/cms/navigation"
              className="hover:border-primary/30 bg-muted/30 rounded-xl border border-transparent px-3 py-3 text-xs font-bold uppercase transition-colors"
            >
              Navigacija
            </Link>
            <Link
              href="/admin/media"
              className="hover:border-primary/30 bg-muted/30 rounded-xl border border-transparent px-3 py-3 text-xs font-bold uppercase transition-colors"
            >
              Mediji
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => {
          const body = (
            <Card className="hover:border-primary/40 border-border/50 bg-background/70 p-4 transition-colors">
              <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight">{stat.value}</p>
            </Card>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block">
              {body}
            </Link>
          ) : (
            body
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hubLinks.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="hover:border-primary/40 border-border/50 flex items-center gap-3 p-4 transition-colors">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name={item.icon} className="text-[20px]" />
              </div>
              <div className="min-w-0">
                <div className="group-hover:text-primary text-sm font-bold tracking-wide uppercase transition-colors">
                  {item.label}
                </div>
                <div className="text-muted-foreground text-[11px] font-medium">
                  {item.statKey ? "Aktivan operativni modul" : "Navigacija i alati"}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
