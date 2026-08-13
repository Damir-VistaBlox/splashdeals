import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { AdminMetricCard } from "./AdminMetricCard";
import Link from "next/link";
import type { ReactNode } from "react";

export interface StatItem {
  label: string;
  value: number;
  color: string;
  glow: string;
  href?: string;
}

interface AdminPageShellProps {
  title: string;
  subtitle: string;
  cta?: { label: string; href: string; icon: string };
  stats?: StatItem[];
  statsGridCols?: string;
  glowColor?: string;
  children: ReactNode;
}

export function AdminPageShell({
  title,
  subtitle,
  cta,
  stats = [],
  statsGridCols = "md:grid-cols-2 lg:grid-cols-4",
  glowColor = "bg-primary/5",
  children,
}: AdminPageShellProps) {
  return (
    <div className="bg-background border-border/50 relative flex min-h-[calc(100vh-4rem)] w-full flex-col gap-8 overflow-hidden rounded-[30px] border p-4 md:p-6">
      <div
        className={`pointer-events-none absolute top-0 right-0 -mt-64 -mr-64 h-[500px] w-[500px] rounded-full blur-[120px] ${glowColor}`}
      />
      <div className="bg-accent/5 pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[400px] w-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div className="space-y-3">
          <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
            <span className="bg-primary size-2 rounded-full" />
            Admin pregled
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight uppercase italic">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1.5 max-w-3xl text-sm leading-6 md:text-[15px]">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {stats.length > 0 ? (
            <div className="border-border/60 bg-background/70 flex min-w-[180px] items-center justify-between rounded-2xl border px-4 py-3">
              <div>
                <div className="text-muted-foreground text-[9px] font-bold tracking-[0.18em] uppercase">
                  Moduli u prikazu
                </div>
                <div className="text-foreground mt-1 text-lg font-black">{stats.length}</div>
              </div>
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl">
                <Icon name="dashboard" className="text-[18px]" />
              </div>
            </div>
          ) : null}

          {cta && (
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25 hover:shadow-primary/40 h-11 shrink-0 rounded-2xl px-6 text-[11px] font-black tracking-widest uppercase shadow-lg transition-colors hover:shadow-xl"
            >
              <Link href={cta.href}>
                <Icon name={cta.icon} className="mr-2 text-[16px]" />
                {cta.label}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {stats.length > 0 ? (
        <div className={`relative z-10 grid gap-4 ${statsGridCols}`}>
          {stats.map((stat) => (
            <AdminMetricCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              glow={stat.glow}
              href={stat.href}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 mt-4">{children}</div>
    </div>
  );
}
