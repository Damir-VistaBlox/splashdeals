"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import { ChartAreaInteractive } from "@/app/(dashboard)/admin/_common/chart-area-interactive";
import { SectionCards } from "@/components/shared/section-cards";

interface RecentActivity {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string | Date;
  city: string;
}

interface DashboardStats {
  totalRevenue: number;
  activeFacilities: number;
  totalCustomers: number;
  activeTickets: number;
}

export function DashboardClient({
  stats,
  recentActivity,
}: {
  stats: DashboardStats;
  recentActivity?: RecentActivity[];
}) {
  return (
    <div
      className="bg-background flex flex-1 flex-col p-4 md:p-6"
      aria-label="Admin Dashboard Overview"
    >
      <div className="@container/main flex w-full flex-1 flex-col gap-4">
        <h1 className="sr-only">Splashdeals Admin Dashboard Overview</h1>

        <SectionCards stats={stats} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <ChartAreaInteractive />
          </div>

          <div className="border-border/50 bg-muted/20 flex min-h-[400px] flex-col rounded-lg border p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Icon name="monitor_heart" className="text-primary size-3.5" />
                Puls aktivnosti
              </div>
              <div className="bg-primary/10 border-primary/20 flex items-center gap-1.5 rounded-full border px-2 py-0.5">
                <div className="bg-primary h-1 w-1 animate-pulse rounded-full" />
                <span className="text-primary text-[9px] font-black tracking-tight uppercase">
                  Uživo
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((act) => (
                  <div
                    key={act.id}
                    className="group hover:bg-muted/20 hover:border-border/50 relative flex items-start gap-3 rounded-lg border border-transparent p-2.5 transition-all"
                  >
                    <div className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono text-[11px] font-bold tracking-tight">
                          {act.totalAmount.toLocaleString()} RSD
                        </span>
                        <span className="rounded border border-emerald-500/10 bg-emerald-500/5 px-1.5 py-0.5 text-[9px] font-bold tracking-tighter text-emerald-400 uppercase">
                          {act.status}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 truncate text-[9px] font-bold tracking-widest uppercase">
                        <span className="text-primary/60 font-mono">@{act.city}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {new Date(act.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-12 text-center">
                  <div className="relative">
                    <Icon name="monitor_heart" className="text-muted-foreground/40 size-8" />
                    <div className="absolute inset-0 h-8 w-8 animate-ping text-cyan-500/20" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
                      Tok miruje
                    </h3>
                    <p className="text-muted-foreground/80 text-[9px] leading-relaxed font-bold uppercase">
                      Nema transakcija u poslednjem satu.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-border/50 mt-6 space-y-3 border-t pt-6">
              <div className="text-muted-foreground text-[9px] font-bold tracking-[0.2em] uppercase">
                Status sistema
              </div>
              <div className="bg-muted/10 border-border/50 flex items-center justify-between rounded-md border p-2">
                <span className="text-muted-foreground text-[9px] font-bold uppercase">
                  Gateway
                </span>
                <span className="font-mono text-[9px] text-emerald-400 uppercase">Na mreži</span>
              </div>
              <div className="bg-muted/10 border-border/50 flex items-center justify-between rounded-md border p-2">
                <span className="text-muted-foreground text-[9px] font-bold uppercase">
                  Okruženje
                </span>
                <span className="text-primary font-mono text-[9px] uppercase">SD-2026-BETA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border bg-muted/5 mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <Icon name="database" className="text-muted-foreground/40 size-6" />
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Operativni red
            </h3>
            <p className="text-muted-foreground/80 text-[10px] font-bold uppercase">
              Stvarni operativni pogon sinhronizovan je sa primarnim čvorom.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] font-black tracking-widest text-emerald-500 uppercase">
              Primarni čvor
            </div>
            <div className="bg-primary/10 border-primary/20 text-primary rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase">
              v2.4.1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
