"use client";

import * as React from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  addFacilityClosureAction,
  removeFacilityClosureAction,
} from "@/app/(server)/actions/closures";

interface Closure {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  reason: string | null;
  isEmergency: boolean;
}

interface FacilityClosuresSectionProps {
  facilityId: string;
  initialClosures: Closure[];
}

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfLocalDayIso(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

function endOfLocalDayIso(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
}

function applyPreset(preset: "today" | "weekend" | "next_week"): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  if (preset === "today") {
    const s = toDateInputValue(now);
    return { startDate: s, endDate: s };
  }
  if (preset === "weekend") {
    // Next Saturday–Sunday (or this weekend if today is Sat/Sun)
    const day = now.getDay();
    const toSat = day === 6 ? 0 : day === 0 ? -1 : 6 - day;
    const sat = new Date(now);
    sat.setDate(now.getDate() + toSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return { startDate: toDateInputValue(sat), endDate: toDateInputValue(sun) };
  }
  // next_week: next Monday–Sunday
  const day = now.getDay();
  const daysUntilMon = day === 0 ? 1 : 8 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + daysUntilMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { startDate: toDateInputValue(mon), endDate: toDateInputValue(sun) };
}

function bucketClosure(c: Closure, now = new Date()): "active" | "upcoming" | "past" {
  const start = new Date(c.startDate).getTime();
  const end = new Date(c.endDate).getTime();
  const t = now.getTime();
  if (t >= start && t <= end) return "active";
  if (t < start) return "upcoming";
  return "past";
}

export function FacilityClosuresSection({
  facilityId,
  initialClosures,
}: FacilityClosuresSectionProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState(false);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  async function handleAdd() {
    if (!startDate || !endDate) {
      toast.error("Unesite datum početka i završetka.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("Datum završetka mora biti na ili posle datuma početka.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addFacilityClosureAction({
        facilityId,
        startDate: startOfLocalDayIso(startDate),
        endDate: endOfLocalDayIso(endDate),
        reason: reason || null,
      });

      if (result.success) {
        toast.success("Privremeno zatvaranje dodato.");
        setStartDate("");
        setEndDate("");
        setReason("");
        setIsAdding(false);
        router.refresh();
      } else {
        toast.error((result as { error?: string }).error || "Greška pri dodavanju zatvaranja.");
      }
    } catch {
      toast.error("Greška pri dodavanju zatvaranja.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(closureId: string) {
    setRemovingId(closureId);
    try {
      const result = await removeFacilityClosureAction(closureId, facilityId);
      if (result.success) {
        toast.success("Zatvaranje uklonjeno.");
        router.refresh();
      } else {
        toast.error(result.error || "Greška pri uklanjanju zatvaranja.");
      }
    } catch {
      toast.error("Greška pri uklanjanju zatvaranja.");
    } finally {
      setRemovingId(null);
    }
  }

  const sorted = [...initialClosures].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <Card id="closures" className="border-border/50 bg-background/40 scroll-mt-20 space-y-4 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Icon name="event_busy" className="text-destructive size-3.5" />
          <div>
            <h3 className="text-foreground/70 text-[10px] font-black tracking-widest uppercase">
              Privremena zatvaranja
            </h3>
            <p className="text-muted-foreground mt-0.5 max-w-xl text-[10px] leading-relaxed">
              Kalendarski blackout ne menja status objekta. Za trajno skidanje sa tržišta koristite
              „Zatvori objekat“ u status čipu. Za hitni stop skeniranja — „Hitno gašenje“.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 px-2 text-[9px] font-black tracking-widest uppercase"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Icon name="add" className="text-[10px]" />
          {isAdding ? "Otkaži" : "Dodaj zatvaranje"}
        </Button>
      </header>

      {isAdding && (
        <div className="border-border/50 bg-muted/20 space-y-4 rounded-lg border p-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["today", "Danas"],
                ["weekend", "Vikend"],
                ["next_week", "Sledeća nedelja"],
              ] as const
            ).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 text-[9px] font-black tracking-widest uppercase"
                onClick={() => {
                  const p = applyPreset(key);
                  setStartDate(p.startDate);
                  setEndDate(p.endDate);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="closure-start"
                className="text-[10px] font-bold tracking-wider uppercase"
              >
                Datum početka
              </Label>
              <Input
                id="closure-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="closure-end"
                className="text-[10px] font-bold tracking-wider uppercase"
              >
                Datum završetka
              </Label>
              <Input
                id="closure-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="closure-reason"
              className="text-[10px] font-bold tracking-wider uppercase"
            >
              Razlog (opciono)
            </Label>
            <Textarea
              id="closure-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Planirano održavanje, sezonsko zatvaranje..."
              className="h-16 resize-none text-xs"
              maxLength={200}
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            disabled={isSubmitting}
            onClick={handleAdd}
          >
            {isSubmitting ? (
              <Icon name="progress_activity" className="size-3.5 animate-spin" />
            ) : (
              <Icon name="check" className="size-3.5" />
            )}
            Sačuvaj zatvaranje
          </Button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <Icon name="event_busy" className="text-muted-foreground/40 size-6" />
          <p className="text-muted-foreground text-xs font-medium">Nema zakazanih zatvaranja</p>
          <p className="text-muted-foreground/70 max-w-sm text-[10px] leading-relaxed">
            Dodajte periode održavanja ili sezonskog zatvaranja. Status objekta ostaje nepromenjen
            (obično Aktivan).
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((closure) => {
            const bucket = bucketClosure(closure);
            return (
              <div
                key={closure.id}
                className="border-border/50 bg-background/40 flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground text-[11px] font-bold">
                      {new Date(closure.startDate).toLocaleDateString("sr-RS")}
                    </span>
                    <span className="text-muted-foreground text-[9px]">→</span>
                    <span className="text-foreground text-[11px] font-bold">
                      {new Date(closure.endDate).toLocaleDateString("sr-RS")}
                    </span>
                    <span
                      className={
                        bucket === "active"
                          ? "bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase"
                          : bucket === "upcoming"
                            ? "bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase"
                            : "bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase"
                      }
                    >
                      {bucket === "active"
                        ? "Aktivno"
                        : bucket === "upcoming"
                          ? "Predstojeće"
                          : "Prošlo"}
                    </span>
                    {closure.isEmergency && (
                      <span className="bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase">
                        Hitno (legacy)
                      </span>
                    )}
                  </div>
                  {closure.reason && (
                    <p className="text-muted-foreground text-[10px]">{closure.reason}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                  onClick={() => handleRemove(closure.id)}
                  disabled={removingId === closure.id}
                  aria-label="Ukloni zatvaranje"
                >
                  {removingId === closure.id ? (
                    <Icon name="progress_activity" className="size-3.5 animate-spin" />
                  ) : (
                    <Icon name="delete" className="size-3.5" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
