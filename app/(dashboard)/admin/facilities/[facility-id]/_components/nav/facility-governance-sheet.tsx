"use client";

import { Icon } from "@/components/ui/Icon";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { FacilityStatus } from "@prisma/client";
import { FACILITY_STATUS_DESCRIPTION, FACILITY_STATUS_LABEL } from "@/lib/facility/status-labels";

interface FacilityGovernanceSheetProps {
  facility: {
    id: string;
    name: string;
    status: FacilityStatus;
  };
}

/**
 * Advanced admin info sheet — lifecycle status is controlled exclusively via
 * FacilityStatusControl (nav/list). This sheet explains layers and deep-links ops.
 */
export function FacilityGovernanceSheet({ facility }: FacilityGovernanceSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const opsHref = `/admin/facilities/${facility.id}/operations`;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted/30 gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
        >
          <Icon name="settings" className="text-[16px]" />
          Napredno upravljanje
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-background/95 border-border/50 w-full overflow-y-auto p-8 shadow-2xl backdrop-blur-2xl sm:max-w-[440px]">
        <SheetHeader className="border-border/50 border-b pb-8">
          <SheetTitle className="flex items-center gap-2 text-xl font-black tracking-tighter">
            <Icon name="gpp_maybe" className="text-primary text-[20px]" />
            Sistemsko upravljanje
          </SheetTitle>
          <SheetDescription className="text-xs font-bold tracking-widest uppercase opacity-50">
            Objašnjenje operativnih slojeva — status se menja preko čipa u navigaciji.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-8">
          <div className="border-border/50 bg-muted/20 space-y-2 rounded-xl border p-4">
            <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
              Trenutni lifecycle status
            </p>
            <p className="text-foreground text-sm font-black tracking-wide">
              {FACILITY_STATUS_LABEL[facility.status]}
            </p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {FACILITY_STATUS_DESCRIPTION[facility.status]}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
              Tri sloja operativnosti
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-[11px] leading-relaxed">
              <li>
                <strong className="text-foreground">Status objekta</strong> — Aktivan / Nacrt /
                Zatvoren / Hitno gašenje (kontrola u navigaciji).
              </li>
              <li>
                <strong className="text-foreground">Privremena zatvaranja</strong> — kalendarski
                blackout; status može ostati Aktivan.
              </li>
              <li>
                <strong className="text-foreground">Radno vreme</strong> — nedeljni dani sa
                &quot;zatvoreno&quot; zastavicom.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              className="h-11 justify-start gap-2 text-[10px] font-black tracking-widest uppercase"
            >
              <Link href={`${opsHref}#closures`} onClick={() => setIsOpen(false)}>
                <Icon name="event_busy" className="text-[14px]" />
                Privremena zatvaranja
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 justify-start gap-2 text-[10px] font-black tracking-widest uppercase"
            >
              <Link href={`${opsHref}#hours`} onClick={() => setIsOpen(false)}>
                <Icon name="schedule" className="text-[14px]" />
                Radno vreme
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
