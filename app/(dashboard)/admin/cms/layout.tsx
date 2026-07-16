import Link from "next/link";
import type { ReactNode } from "react";

const CMS_NAV = [
  { href: "/admin/cms/posts", label: "Objave" },
  { href: "/admin/cms/pages", label: "Strane" },
  { href: "/admin/cms/categories", label: "Kategorije" },
  { href: "/admin/cms/tags", label: "Oznake" },
  { href: "/admin/cms/campaigns", label: "Kampanje" },
  { href: "/admin/cms/reviews", label: "Recenzije" },
  { href: "/admin/cms/activity", label: "Aktivnost" },
  { href: "/admin/cms/navigation", label: "Navigacija" },
  { href: "/admin/cms/redirects", label: "Preusmeravanja" },
  { href: "/admin/cms/webhooks", label: "Vebhukovi" },
  { href: "/admin/cms/tools", label: "Alati" },
] as const;

/**
 * CMS section chrome — secondary nav for desktop admin.
 * Route groups under cms/ do not appear in the URL.
 */
export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <nav
        aria-label="CMS navigacija"
        className="border-border/60 bg-muted/20 no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-xl border p-1"
      >
        {CMS_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground hover:bg-background hover:text-foreground shrink-0 rounded-lg px-3 py-2 text-xs font-bold tracking-wide whitespace-nowrap uppercase transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
