"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import Link from "next/link";
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
  const revenueLabel = `${stats.totalRevenue.toLocaleString("sr-RS")} RSD`;
  const customerLabel = stats.totalCustomers.toLocaleString("sr-RS");
  const transactions = recentActivity ?? [];
  const recentTotal = transactions.reduce((sum, act) => sum + act.totalAmount, 0);
  const healthItems = [
    {
      label: "Aktivni objekti",
      value: `${stats.activeFacilities}`,
      detail: stats.activeFacilities > 0 ? "Mreža dostupna za prodaju" : "Nema aktivnih objekata",
      tone: "emerald",
    },
    {
      label: "Katalog",
      value: `${stats.activeTickets}`,
      detail: stats.activeTickets > 0 ? "Ponuda je objavljena" : "Katalog čeka dopunu",
      tone: "amber",
    },
    {
      label: "Kupci",
      value: customerLabel,
      detail: "Aktivna baza korisnika i naloga",
      tone: "sky",
    },
  ] as const;
  const quickActions = [
    {
      href: "/admin/facilities",
      label: "Objekti",
      detail: "Pregled registra, statusa i operativnih izmena",
      icon: "store",
    },
    {
      href: "/admin/facilities/new",
      label: "Dodaj objekat",
      detail: "Pokreni onboarding novog partnera i lokacije",
      icon: "add_business",
    },
    {
      href: "/admin/media",
      label: "Mediji",
      detail: "Upravljaj slikama, ALT tekstovima i vizuelnim resursima",
      icon: "photo_library",
    },
    {
      href: "/admin/cms/posts",
      label: "CMS",
      detail: "Objave, strane i urednički tokovi",
      icon: "article",
    },
  ];

  return (
    <div
      className="bg-background flex flex-1 flex-col p-4 md:p-6"
      aria-label="Pregled administrativne kontrolne table"
    >
      <div className="@container/main flex w-full flex-1 flex-col gap-4">
        <h1 className="sr-only">Pregled Splashdeals administratorske kontrolne table</h1>

        <section className="border-border/60 bg-card/95 relative overflow-hidden rounded-[28px] border p-5 shadow-sm md:p-6">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_60%)] lg:block" />
          <div className="relative z-10 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
                <span className="bg-primary size-2 rounded-full" />
                Kontrolni centar
              </div>
              <div className="space-y-3">
                <div className="text-foreground max-w-3xl text-2xl font-black tracking-tight md:text-3xl">
                  Dnevni pregled prodaje, operativa i uredničkog toka na jednom mestu.
                </div>
                <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                  Administrativni prikaz je osmišljen za brze odluke: prvo vidi stanje platforme,
                  zatim otvori sekciju koja traži pažnju.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="border-border/60 bg-background/80 rounded-2xl border px-4 py-3">
                  <div className="text-muted-foreground text-[9px] font-bold tracking-[0.18em] uppercase">
                    Ukupan promet
                  </div>
                  <div className="text-foreground mt-1 font-mono text-lg font-black">
                    {revenueLabel}
                  </div>
                </div>
                <div className="border-border/60 bg-background/80 rounded-2xl border px-4 py-3">
                  <div className="text-muted-foreground text-[9px] font-bold tracking-[0.18em] uppercase">
                    Poslednje transakcije
                  </div>
                  <div className="text-foreground mt-1 font-mono text-lg font-black">
                    {recentTotal.toLocaleString("sr-RS")} RSD
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {healthItems.map((item) => (
                <div
                  key={item.label}
                  className="border-border/60 bg-background/75 rounded-2xl border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-muted-foreground text-[9px] font-bold tracking-[0.18em] uppercase">
                      {item.label}
                    </div>
                    <span
                      className={
                        item.tone === "emerald"
                          ? "rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] font-black tracking-[0.18em] text-emerald-500 uppercase"
                          : item.tone === "amber"
                            ? "rounded-full bg-amber-500/10 px-2 py-1 text-[8px] font-black tracking-[0.18em] text-amber-500 uppercase"
                            : "rounded-full bg-sky-500/10 px-2 py-1 text-[8px] font-black tracking-[0.18em] text-sky-500 uppercase"
                      }
                    >
                      Live
                    </span>
                  </div>
                  <div className="text-foreground mt-3 text-2xl font-black tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-muted-foreground mt-1 text-[11px] leading-5">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionCards stats={stats} />

        <section
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
          aria-label="Brze administrativne akcije"
        >
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="border-border/60 bg-card/90 hover:border-primary/25 hover:bg-background group rounded-3xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
                    <Icon name={action.icon} className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-foreground text-sm font-black uppercase">
                      {action.label}
                    </div>
                    <div className="text-muted-foreground text-[11px] leading-5 font-medium">
                      {action.detail}
                    </div>
                  </div>
                </div>
                <div className="border-border/60 text-muted-foreground rounded-full border px-2 py-1 text-[8px] font-black tracking-[0.18em] uppercase">
                  Open
                </div>
              </div>
              <div className="text-primary flex items-center gap-2 text-[10px] font-black tracking-[0.18em] uppercase">
                <span>Otvori sekciju</span>
                <Icon
                  name="arrow_outward"
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <ChartAreaInteractive />
          </div>

          <div className="border-border/60 bg-card/90 flex min-h-[400px] flex-col rounded-[28px] border p-5 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Icon name="monitor_heart" className="text-primary size-3.5" />
                Skorašnje transakcije
              </div>
              <div className="bg-primary/10 border-primary/20 flex items-center gap-1.5 rounded-full border px-2 py-0.5">
                <div className="bg-primary h-1 w-1 animate-pulse rounded-full" />
                <span className="text-primary text-[9px] font-black tracking-tight uppercase">
                  Aktivno
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((act) => (
                  <div
                    key={act.id}
                    className="group hover:bg-muted/20 hover:border-border/50 relative flex items-start gap-3 rounded-2xl border border-transparent p-3 transition-all"
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
                      Nema novih događaja
                    </h3>
                    <p className="text-muted-foreground/80 text-[9px] leading-relaxed font-bold uppercase">
                      Nije zabeležena nova prodaja u poslednjem satu.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-border/50 mt-6 space-y-3 border-t pt-6">
              <div className="text-muted-foreground text-[9px] font-bold tracking-[0.2em] uppercase">
                Status sistema
              </div>
              <div className="bg-muted/10 border-border/50 flex items-center justify-between rounded-xl border p-2.5">
                <span className="text-muted-foreground text-[9px] font-bold uppercase">
                  Gateway
                </span>
                <span className="font-mono text-[9px] text-emerald-400 uppercase">Operativan</span>
              </div>
              <div className="bg-muted/10 border-border/50 flex items-center justify-between rounded-xl border p-2.5">
                <span className="text-muted-foreground text-[9px] font-bold uppercase">
                  Okruženje
                </span>
                <span className="text-primary font-mono text-[9px] uppercase">SD-ADMIN</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border bg-muted/5 mt-4 flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed p-8 text-center">
          <Icon name="database" className="text-muted-foreground/40 size-6" />
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Operativno stanje
            </h3>
            <p className="text-muted-foreground/80 text-[10px] font-bold uppercase">
              Administrativni prikaz je sinhronizovan sa primarnim čvorom.
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
