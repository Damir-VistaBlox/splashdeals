import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionCardsProps {
  stats?: {
    totalRevenue: number;
    activeFacilities: number;
    totalCustomers: number;
    activeTickets: number;
  };
}

export function SectionCards({ stats }: SectionCardsProps) {
  const displayStats = [
    {
      title: "Total Revenue",
      value: `${(stats?.totalRevenue || 0).toLocaleString("sr-RS")} RSD`,
      description: "Platform Volume",
      icon: <Icon name="credit_card" className="text-[14px]" />,
      trend: "+12.5%",
      subtext: "Stripe",
      color: "cyan",
    },
    {
      title: "Active Facilities",
      value: stats?.activeFacilities || 0,
      description: "Facility Hub",
      icon: <Icon name="monitor_heart" className="text-[14px]" />,
      trend: "Optimal",
      subtext: "Live",
      color: "emerald",
    },
    {
      title: "Total Users",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      description: "User Base",
      icon: <Icon name="group" className="text-[14px]" />,
      trend: "+4.2%",
      subtext: "Accounts",
      color: "sky",
    },
    {
      title: "Active Catalog",
      value: stats?.activeTickets || 0,
      description: "Offerings",
      icon: <Icon name="package_2" className="text-[14px]" />,
      trend: "Unlimited",
      subtext: "Variants",
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((item, index) => (
        <div
          key={index}
          className="group relative rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition-all duration-300 outline-none focus-within:ring-2 focus-within:ring-cyan-500/20 hover:border-white/10 hover:bg-white/[0.05]"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-slate-500 uppercase">
              <div
                className={cn(
                  "rounded-lg border border-white/5 bg-white/[0.03] p-1.5 transition-colors duration-300",
                  item.color === "cyan" && "text-cyan-400 group-hover:text-cyan-300",
                  item.color === "emerald" && "text-emerald-400 group-hover:text-emerald-300",
                  item.color === "sky" && "text-sky-400 group-hover:text-sky-300",
                  item.color === "amber" && "text-amber-400 group-hover:text-amber-300",
                )}
              >
                {item.icon}
              </div>
              {item.description}
            </div>
            <Badge
              variant="outline"
              className="h-4 border-white/5 bg-white/5 px-1.5 text-[8px] font-bold tracking-tighter text-cyan-400 uppercase transition-all"
            >
              {item.trend}
            </Badge>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-mono text-xl font-bold tracking-tight text-white">
              {item.value}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-tighter text-slate-500 uppercase opacity-60">
              <span>{item.subtext}</span>
            </div>
          </div>
          <div className="mt-1 truncate text-[10px] font-bold tracking-wide text-slate-500 uppercase transition-colors group-hover:text-slate-400">
            {item.title}
          </div>
        </div>
      ))}
    </div>
  );
}
