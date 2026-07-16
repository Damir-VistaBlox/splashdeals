import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "CMS alati | Splashdeals",
};

const TOOLS = [
  {
    href: "/admin/cms/broken-links",
    title: "Pokvareni linkovi",
    desc: "Pronađi i ispravi neispravne interne/eksterne linkove u sadržaju.",
    icon: "link_off",
  },
  {
    href: "/admin/cms/not-found-logs",
    title: "404 logovi",
    desc: "Pregled najčešćih 404 putanja sa javnog sajta.",
    icon: "search_off",
  },
  {
    href: "/admin/cms/orphaned-media",
    title: "Neiskorišćeni mediji",
    desc: "Mediji koji nisu vezani ni za jednu objavu ili stranu.",
    icon: "image_not_supported",
  },
  {
    href: "/admin/cms/embed",
    title: "Embed kodovi",
    desc: "Upravljanje ugradivim widget kodovima.",
    icon: "code",
  },
  {
    href: "/admin/cms/api-docs",
    title: "API dokumentacija",
    desc: "Pregled CMS/API endpointa za integracije.",
    icon: "menu_book",
  },
  {
    href: "/admin/media",
    title: "Medija biblioteka",
    desc: "Centralna biblioteka medija (izvan CMS grupe ruta).",
    icon: "photo_library",
  },
] as const;

export default async function CmsToolsHubPage() {
  await requireAdmin();
  await connection();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CMS alati</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Operativni alati za sadržaj, SEO i medije.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <Card className="border-border hover:border-primary/40 h-full p-5 transition-colors">
              <div className="bg-primary/10 text-primary mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                <Icon name={tool.icon} className="text-[22px]" />
              </div>
              <h2 className="group-hover:text-primary mb-1 text-sm font-black tracking-wide uppercase transition-colors">
                {tool.title}
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed">{tool.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
