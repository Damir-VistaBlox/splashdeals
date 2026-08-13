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
      subtext: "Prodaja i naplata",
      color: "cyan",
    },
    {
      title: "Aktivni objekti",
      value: stats?.activeFacilities || 0,
      description: "Mreža objekata",
      icon: <Icon name="monitor_heart" className="text-[14px]" />,
      trend: "Aktivno",
      subtext: "Objekti u prodaji",
      color: "emerald",
    },
    {
      title: "Ukupno kupaca",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      description: "Korisnička baza",
      icon: <Icon name="group" className="text-[14px]" />,
      trend: "+4.2%",
      subtext: "Registrovani korisnici",
      color: "sky",
    },
    {
      title: "Aktivan katalog",
      value: stats?.activeTickets || 0,
      description: "Ponuda",
      icon: <Icon name="package_2" className="text-[14px]" />,
      trend: "Dostupno",
      subtext: "Tipovi i varijante",
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {displayStats.map((item, index) => (
        <div
          key={index}
          className="group border-border/60 bg-card/95 hover:border-primary/20 hover:bg-background relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 outline-none focus-within:ring-2 focus-within:ring-cyan-500/20"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="text-muted-foreground flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase">
              <div
                className={cn(
                  "border-border/50 bg-muted/30 rounded-2xl border p-2 transition-colors duration-300",
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
              className="border-border bg-background/80 h-6 rounded-full px-2.5 text-[8px] font-bold tracking-[0.18em] text-cyan-400 uppercase transition-all"
            >
              {item.trend}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-foreground font-mono text-2xl font-black tracking-tight">
                {item.value}
              </div>
              <div className="text-muted-foreground/70 text-right text-[9px] font-bold tracking-[0.16em] uppercase">
                {item.title}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3">
              <div className="text-muted-foreground text-[10px] font-bold tracking-[0.16em] uppercase">
                {item.subtext}
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase opacity-70">
                <span className="bg-primary/70 size-1.5 rounded-full" />
                <span>U fokusu</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
