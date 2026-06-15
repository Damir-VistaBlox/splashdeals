import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SectionCardsProps {
  stats?: {
    totalRevenue: number
    activeFacilities: number
    totalCustomers: number
    activeTickets: number
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  const displayStats = [
    {
      title: "Total Revenue",
      value: `${(stats?.totalRevenue || 0).toLocaleString('sr-RS')} RSD`,
      description: "Platform Volume",
      icon: <Icon name="credit_card" className="text-[14px]" />,
      trend: "+12.5%",
      subtext: "Stripe",
      color: "cyan"
    },
    {
      title: "Active Facilities",
      value: stats?.activeFacilities || 0,
      description: "Facility Hub",
      icon: <Icon name="monitor_heart" className="text-[14px]" />,
      trend: "Optimal",
      subtext: "Live",
      color: "emerald"
    },
    {
      title: "Total Users",
      value: (stats?.totalCustomers || 0).toLocaleString(),
      description: "User Base",
      icon: <Icon name="group" className="text-[14px]" />,
      trend: "+4.2%",
      subtext: "Accounts",
      color: "sky"
    },
    {
      title: "Active Catalog",
      value: stats?.activeTickets || 0,
      description: "Offerings",
      icon: <Icon name="package_2" className="text-[14px]" />,
      trend: "Unlimited",
      subtext: "Variants",
      color: "amber"
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((item, index) => (
        <div 
          key={index} 
          className="relative rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 group focus-within:ring-2 focus-within:ring-cyan-500/20 outline-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <div className={cn(
                "p-1.5 rounded-lg bg-white/[0.03] border border-white/5 transition-colors duration-300",
                item.color === "cyan" && "text-cyan-400 group-hover:text-cyan-300",
                item.color === "emerald" && "text-emerald-400 group-hover:text-emerald-300",
                item.color === "sky" && "text-sky-400 group-hover:text-sky-300",
                item.color === "amber" && "text-amber-400 group-hover:text-amber-300",
              )}>
                {item.icon}
              </div>
              {item.description}
            </div>
            <Badge variant="outline" className="h-4 border-white/5 bg-white/5 text-[8px] text-cyan-400 px-1.5 font-bold uppercase tracking-tighter transition-all">
              {item.trend}
            </Badge>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-bold text-white tracking-tight font-mono">
              {item.value}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-tighter opacity-60">
              <span>{item.subtext}</span>
            </div>
          </div>
          <div className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate group-hover:text-slate-400 transition-colors">{item.title}</div>
        </div>
      ))}
    </div>
  )
}
