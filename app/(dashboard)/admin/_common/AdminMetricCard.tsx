import { cn } from "@/lib/utils";
import Link from "next/link";

interface AdminMetricCardProps {
  label: string;
  value: number;
  color: string;
  glow: string;
  href?: string;
}

export function AdminMetricCard({ label, value, color, glow, href }: AdminMetricCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-[9px] font-black tracking-[0.25em] uppercase">
            {label}
          </p>
          <p className={cn("text-3xl font-black tracking-tight", color)}>{value}</p>
        </div>
        <span className="text-muted-foreground/70 bg-background/70 border-border/60 rounded-full border px-2 py-1 text-[9px] font-bold tracking-[0.18em] uppercase">
          {href ? "Detalji" : "Pregled"}
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "focus-visible:ring-primary/40 block rounded-2xl border p-5 shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none",
          glow,
        )}
        aria-label={`Filtriraj: ${label}`}
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-lg backdrop-blur-md transition-colors duration-200",
        glow,
      )}
    >
      {body}
    </div>
  );
}
