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
              ? "text-muted-foreground hover:text-foreground hover:bg-muted/55 inline-flex h-10 min-h-10 items-center justify-center rounded-full border border-white/60 bg-white/52 px-4 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/55 hidden h-10 min-h-10 items-center justify-center rounded-full border border-white/60 bg-white/52 px-4 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors md:inline-flex"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
