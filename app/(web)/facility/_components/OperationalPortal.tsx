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
  const sortedHours = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  useEffect(() => {
    // Ensure this calculation only runs on the client to avoid Next.js time-errors
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayIdx(new Date().getDay());
  }, []);

  return (
    <Card className="border-border from-background via-muted/65 rounded-[3rem] border bg-gradient-to-br to-white/65 p-8 shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-primary mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
            <Icon name="schedule" className="text-[15px]" /> Operativne informacije
          </div>
          <h3 className="text-foreground flex items-center gap-4 text-xl font-black tracking-tighter uppercase italic md:text-3xl">
            <Icon name="schedule" className="text-primary text-[24px]" /> Radno Vreme
          </h3>
        </div>
        {todayIdx !== null ? (
          <div className="rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[10px] font-black tracking-[0.16em] text-slate-600 uppercase">
            Danas
          </div>
        ) : null}
      </div>
      <div className="space-y-1">
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
            <span className="text-[10px] tracking-widest uppercase">{DAYS_SR[h.dayOfWeek]}</span>
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
