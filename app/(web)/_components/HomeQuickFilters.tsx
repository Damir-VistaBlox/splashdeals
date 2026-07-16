import Link from "next/link";

type HomeDict = Record<string, string>;

export function HomeQuickFilters({ dict }: { dict: HomeDict }) {
  // Mobile: keep two high-intent filters only; desktop shows all four.
  const items = [
    { href: "#savings", label: dict.filter_discount, mobile: true },
    { href: "#ops-open", label: dict.filter_open_today, mobile: true },
    { href: "#intent", label: dict.filter_family, mobile: false },
    { href: "#regions", label: dict.region_title, mobile: false },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            item.mobile
              ? "text-muted-foreground hover:text-foreground hover:bg-muted/40 inline-flex h-12 min-h-12 items-center justify-center rounded-full px-4 text-[11px] font-bold tracking-wide uppercase"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40 hidden h-12 min-h-12 items-center justify-center rounded-full px-4 text-[11px] font-bold tracking-wide uppercase md:inline-flex"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
