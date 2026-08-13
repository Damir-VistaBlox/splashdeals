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
      title: "Ukupan promet",
      value: `${(stats?.totalRevenue || 0).toLocaleString("sr-RS")} RSD`,
      description: "Platformski promet",
      icon: <Icon name="credit_card" className="text-[14px]" />,
      trend: "+12.5%",
      subtext: "Transakcije",
      color: "cyan",
    },
    {
      title: "Aktivni objekti",
      value: stats?.activeFacilities || 0,
      description: "Mreža objekata",
      icon: <Icon name="monitor_heart" className="text-[14px]" />,
      trend: "Aktivno",
      subtext: "Operativno",
      color: "emerald",
    },
    {
      title: "Ukupno kupaca",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      description: "Korisnička baza",
      icon: <Icon name="group" className="text-[14px]" />,
      trend: "+4.2%",
      subtext: "Nalozi",
      color: "sky",
    },
    {
      title: "Aktivan katalog",
      value: stats?.activeTickets || 0,
      description: "Ponuda",
      icon: <Icon name="package_2" className="text-[14px]" />,
      trend: "Dostupno",
      subtext: "Varijante",
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((item, index) => (
        <div
          key={index}
          className="group border-border/60 bg-card/95 hover:border-border/80 hover:bg-muted/40 relative rounded-2xl border p-4 shadow-sm transition-all duration-300 outline-none focus-within:ring-2 focus-within:ring-cyan-500/20"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase">
              <div
                className={cn(
                  "border-border/50 bg-muted/20 rounded-lg border p-1.5 transition-colors duration-300",
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
              className="border-border bg-background/80 h-5 px-2 text-[8px] font-bold tracking-[0.18em] text-cyan-400 uppercase transition-all"
            >
              {item.trend}
            </Badge>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-foreground font-mono text-xl font-bold tracking-tight">
              {item.value}
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase opacity-70">
              <span>{item.subtext}</span>
            </div>
          </div>
          <div className="text-muted-foreground group-hover:text-foreground/80 mt-1 truncate text-[10px] font-bold tracking-[0.18em] uppercase transition-colors">
            {item.title}
          </div>
        </div>
      ))}
    </div>
  );
}
