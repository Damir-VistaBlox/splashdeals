import { cn } from "@/lib/utils";

interface AdminMetricCardProps {
  label: string;
  value: number;
  color: string;
  glow: string;
}

export function AdminMetricCard({ label, value, color, glow }: AdminMetricCardProps) {
  return (
    <div className={cn("space-y-1.5 rounded-2xl border p-5 shadow-lg backdrop-blur-md", glow)}>
      <p className="text-muted-foreground text-[9px] font-black tracking-[0.25em] uppercase">
        {label}
      </p>
      <p className={cn("text-3xl font-black tracking-tight italic", color)}>{value}</p>
    </div>
  );
}
