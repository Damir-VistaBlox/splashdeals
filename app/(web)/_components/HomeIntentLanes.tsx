import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

type HomeDict = Record<string, string>;

const LANES = [
  {
    href: "/akva-parkovi",
    titleKey: "intent_family_title",
    descKey: "intent_family_desc",
    icon: "group",
  },
  {
    href: "/akva-parkovi",
    titleKey: "intent_weekend_title",
    descKey: "intent_weekend_desc",
    icon: "wb_sunny",
  },
  {
    href: "/banje",
    titleKey: "intent_thermal_title",
    descKey: "intent_thermal_desc",
    icon: "water_drop",
  },
  { href: "/bazeni", titleKey: "intent_pools_title", descKey: "intent_pools_desc", icon: "pool" },
] as const;

export function HomeIntentLanes({ dict }: { dict: HomeDict }) {
  return (
    <section
      id="intent"
      className="mx-auto max-w-7xl scroll-mt-28 px-3 py-8 sm:px-6 sm:py-16 md:px-12"
    >
      <div className="mb-5 text-center sm:mb-10">
        <p className="text-primary mb-2 text-[10px] font-black tracking-[0.2em] uppercase">
          Brži izbor
        </p>
        <h2 className="mb-2 text-[1.8rem] leading-none font-black tracking-tighter uppercase italic sm:text-4xl">
          {dict.intent_title}
        </h2>
        <p className="text-muted-foreground text-[14px] font-medium">{dict.intent_subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {LANES.map((lane) => (
          <Link key={lane.titleKey + lane.href} href={lane.href} className="group">
            <Card
              variant="glass"
              className="border-border hover:border-primary/40 h-full rounded-[1.45rem] border-white/70 p-4 transition-all duration-200 hover:shadow-[0_20px_38px_rgba(15,23,42,0.08)] sm:p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <Icon name={lane.icon} className="text-[22px]" />
                </div>
                <span className="text-muted-foreground/80 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-white/70 bg-white/72 px-2 text-[10px] font-black tracking-[0.14em] uppercase">
                  <Icon name="north_east" className="text-[14px]" />
                </span>
              </div>
              <h3 className="group-hover:text-primary mb-1.5 text-[11px] leading-tight font-black tracking-[0.12em] uppercase transition-colors sm:text-sm">
                {dict[lane.titleKey]}
              </h3>
              <p className="text-muted-foreground text-[12px] leading-relaxed sm:text-xs">
                {dict[lane.descKey]}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
