"use client";
import { Icon } from "@/components/ui/Icon";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTime24h, DAYS_SR } from "@/lib/utils/date-time";

import type { OperatingHours } from "@prisma/client";

interface OperationalPortalProps {
  hours: OperatingHours[];
}

/**
 * ⏰ OperationalPortal Island (Client)
 * Handles client-side date-time calculations to avoid SSG/SSR hydration mismatches.
 * Uses shared utilities for consistent 24h notation.
 */
export function OperationalPortal({ hours = [] }: OperationalPortalProps) {
  const [todayIdx, setTodayIdx] = useState<number | null>(null);
  // Collapsed by default on mobile (full week is still in the DOM for SEO/CLS-stability —
  // just visually clipped) — always fully expanded from `sm:` up.
  const [expanded, setExpanded] = useState(false);
  const sortedHours = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const todayHours = todayIdx !== null ? sortedHours.find((h) => h.dayOfWeek === todayIdx) : null;

  useEffect(() => {
    // Ensure this calculation only runs on the client to avoid Next.js time-errors
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayIdx(new Date().getDay());
  }, []);

  return (
    <Card className="border-border from-background via-muted/65 rounded-[1.85rem] border bg-gradient-to-br to-white/65 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[3rem] sm:p-8">
      <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
        <div>
          <div className="text-primary mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
            <Icon name="schedule" className="text-[15px]" /> Operativne informacije
          </div>
          <h3 className="text-foreground flex items-center gap-3 text-lg font-black tracking-tighter uppercase italic sm:gap-4 sm:text-3xl">
            <Icon name="schedule" className="text-primary text-[20px] sm:text-[24px]" /> Radno Vreme
          </h3>
        </div>
        {todayHours ? (
          <div
            className={cn(
              "rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.16em] uppercase",
              todayHours.isClosed
                ? "border-destructive/25 bg-destructive/10 text-destructive"
                : "border-primary/25 bg-primary/10 text-primary",
            )}
          >
            {todayHours.isClosed ? "Zatvoreno danas" : "Otvoreno danas"}
          </div>
        ) : null}
      </div>

      <div className="relative">
        <div
          className={cn(
            "space-y-1 overflow-hidden transition-[max-height] duration-300 ease-out sm:!max-h-none",
            expanded ? "max-h-[30rem]" : "max-h-[3.35rem]",
          )}
        >
          {sortedHours.map((h: OperatingHours) => (
            <div
              key={h.id}
              className={cn(
                "flex items-center justify-between rounded-2xl p-3 transition-colors",
                h.dayOfWeek === todayIdx
                  ? "bg-primary/10 border-primary/20 text-foreground border font-black shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                  : "text-muted-foreground border border-transparent font-bold opacity-72",
              )}
            >
              <span className="text-[10px] tracking-widest uppercase">
                {DAYS_SR[h.dayOfWeek]}
              </span>
              <span className="font-mono text-sm tracking-tight">
                {h.isClosed ? (
                  <span className="text-destructive">Zatvoreno</span>
                ) : (
                  <>
                    <time dateTime={h.openTime}>{formatTime24h(h.openTime)}</time> –{" "}
                    <time dateTime={h.closeTime}>{formatTime24h(h.closeTime)}</time>
                  </>
                )}
              </span>
            </div>
          ))}
          {!sortedHours.length && (
            <p className="text-muted-foreground py-4 text-center italic">
              Raspored dostupan na licu mesta.
            </p>
          )}
        </div>
        {!expanded && sortedHours.length > 1 && (
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t to-transparent sm:hidden" />
        )}
      </div>

      {sortedHours.length > 1 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-primary hover:bg-primary/5 mt-2 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl border border-primary/15 text-[11px] font-black tracking-[0.14em] uppercase transition-colors sm:hidden"
          aria-expanded={expanded}
        >
          {expanded ? "Sakrij nedeljni raspored" : "Prikaži ceo nedeljni raspored"}
          <Icon name={expanded ? "expand_less" : "expand_more"} className="text-[16px]" />
        </button>
      )}
    </Card>
  );
}

interface CurrentOperationalStatusProps {
  hours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
}

/**
 * 🕓 CurrentOperationalStatus Island (Client)
 */
export function CurrentOperationalStatus({ hours = [] }: CurrentOperationalStatusProps) {
  const [status, setStatus] = useState<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  } | null>(null);

  useEffect(() => {
    const todayId = new Date().getDay();
    const todayHours = hours?.find?.((h) => h.dayOfWeek === todayId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (todayHours) setStatus(todayHours);
  }, [hours]);

  if (!status) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border px-5 py-2.5 backdrop-blur-md transition-colors",
        status.isClosed
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : "border-primary/20 bg-primary/10 text-primary",
      )}
    >
      <Icon name="schedule" className="text-[16px]" />
      <span className="font-mono text-xs font-black tracking-widest uppercase">
        {status.isClosed ? (
          "Zatvoreno Danas"
        ) : (
          <>
            <time dateTime={status.openTime}>{formatTime24h(status.openTime)}</time> –{" "}
            <time dateTime={status.closeTime}>{formatTime24h(status.closeTime)}</time>
          </>
        )}
      </span>
    </div>
  );
}
