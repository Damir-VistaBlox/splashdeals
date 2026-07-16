"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FacilityStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateFacilityStatusAction } from "@/app/(server)/actions/governance";
import { FACILITY_STATUS_CONSEQUENCES, FACILITY_STATUS_LABEL } from "@/lib/facility/status-labels";

interface FacilityStatusControlProps {
  facilityId: string;
  status: FacilityStatus;
  /** Used for emergency type-to-confirm; falls back to generic confirm if omitted. */
  facilityName?: string;
  compact?: boolean;
  /** Optional deep-link to operations closures section. */
  operationsHref?: string;
}

type PendingAction = "CLOSED" | "EMERGENCY_SHUTDOWN" | "ACTIVE" | "DRAFT" | null;

export function FacilityStatusControl({
  facilityId,
  status,
  facilityName,
  compact = true,
  operationsHref,
}: FacilityStatusControlProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [confirmName, setConfirmName] = useState("");

  const label = FACILITY_STATUS_LABEL[status];

  const applyStatus = (nextStatus: FacilityStatus) => {
    if (nextStatus === status) {
      setPendingAction(null);
      setConfirmName("");
      return;
    }
    startTransition(async () => {
      const result = await updateFacilityStatusAction({
        facilityId,
        status: nextStatus,
      });

      if (result.success) {
        toast.success(`Objekat je sada: ${FACILITY_STATUS_LABEL[nextStatus]}`);
        setPendingAction(null);
        setConfirmName("");
        router.refresh();
      } else {
        toast.error(result.error || "Prebacivanje statusa nije uspelo");
      }
    });
  };

  const requestStatus = (next: FacilityStatus) => {
    if (next === status) return;
    if (next === "CLOSED" || next === "EMERGENCY_SHUTDOWN") {
      setPendingAction(next);
      setConfirmName("");
      return;
    }
    if (status === "EMERGENCY_SHUTDOWN" || status === "CLOSED") {
      // Reopen / draft from closed states — still confirm lightly
      setPendingAction(next);
      setConfirmName("");
      return;
    }
    applyStatus(next);
  };

  const confirmPending = () => {
    if (!pendingAction) return;
    if (pendingAction === "EMERGENCY_SHUTDOWN" && facilityName) {
      if (confirmName !== facilityName) {
        toast.error("Ime za verifikaciju se ne podudara.");
        return;
      }
    }
    applyStatus(pendingAction);
  };

  const chipClass = cn(
    "h-auto rounded-md border px-2.5 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase",
    status === "ACTIVE" && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    status === "DRAFT" && "border-warning/30 bg-warning/10 text-warning hover:bg-warning/20",
    status === "CLOSED" && "bg-muted/10 text-muted-foreground border-muted/30 hover:bg-muted/20",
    status === "EMERGENCY_SHUTDOWN" &&
      "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15",
  );

  const dialogTitle =
    pendingAction === "CLOSED"
      ? "Zatvori objekat?"
      : pendingAction === "EMERGENCY_SHUTDOWN"
        ? "Hitno gašenje?"
        : pendingAction === "ACTIVE"
          ? "Ponovo otvori objekat?"
          : pendingAction === "DRAFT"
            ? "Vrati u nacrt?"
            : "";

  const consequences = pendingAction ? FACILITY_STATUS_CONSEQUENCES[pendingAction] : [];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Status: ${label}. Promeni status`}
            className={chipClass}
          >
            <span className="flex items-center gap-1.5">
              {isPending ? (
                <Icon name="progress_activity" className="animate-spin text-[12px]" />
              ) : (
                <Icon
                  name={
                    status === "EMERGENCY_SHUTDOWN"
                      ? "warning"
                      : status === "CLOSED"
                        ? "block"
                        : "bolt"
                  }
                  className="text-[12px]"
                />
              )}
              {compact ? label : `Status: ${label}`}
              <Icon name="expand_more" className="text-[12px] opacity-70" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Operativni status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {status !== "ACTIVE" && (
            <DropdownMenuItem onClick={() => requestStatus("ACTIVE")}>
              Postavi na aktivan
            </DropdownMenuItem>
          )}
          {status !== "DRAFT" && (
            <DropdownMenuItem onClick={() => requestStatus("DRAFT")}>
              Postavi na nacrt
            </DropdownMenuItem>
          )}
          {status !== "CLOSED" && (
            <DropdownMenuItem onClick={() => requestStatus("CLOSED")}>
              Zatvori objekat…
            </DropdownMenuItem>
          )}
          {status !== "EMERGENCY_SHUTDOWN" && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => requestStatus("EMERGENCY_SHUTDOWN")}
            >
              Hitno gašenje…
            </DropdownMenuItem>
          )}
          {operationsHref ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={operationsHref}>Privremena zatvaranja…</Link>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingAction(null);
            setConfirmName("");
          }
        }}
      >
        <DialogContent
          className="bg-background border-border max-w-md rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base font-black tracking-wider uppercase">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
              {facilityName ? (
                <>
                  Objekat: <strong className="text-foreground">{facilityName}</strong>
                </>
              ) : (
                "Potvrdite promenu operativnog statusa."
              )}
            </DialogDescription>
          </DialogHeader>

          <ul className="text-muted-foreground list-disc space-y-1.5 py-2 pl-5 text-[11px] leading-relaxed">
            {consequences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {pendingAction === "EMERGENCY_SHUTDOWN" && facilityName ? (
            <div className="space-y-2 border-t pt-4">
              <label className="text-muted-foreground text-[10px] font-black tracking-wider uppercase">
                Za potvrdu unesite ime objekta{" "}
                <span className="text-foreground">&quot;{facilityName}&quot;</span>
              </label>
              <Input
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={facilityName}
                className="h-10 text-xs"
                disabled={isPending}
              />
            </div>
          ) : null}

          <DialogFooter className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                setPendingAction(null);
                setConfirmName("");
              }}
              className="h-10 text-[9px] font-black tracking-widest uppercase"
            >
              Otkaži
            </Button>
            <Button
              type="button"
              disabled={
                isPending ||
                (pendingAction === "EMERGENCY_SHUTDOWN" &&
                  !!facilityName &&
                  confirmName !== facilityName)
              }
              onClick={confirmPending}
              className={cn(
                "h-10 text-[9px] font-black tracking-widest uppercase",
                pendingAction === "EMERGENCY_SHUTDOWN" || pendingAction === "CLOSED"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "",
              )}
            >
              {isPending ? (
                <Icon name="progress_activity" className="animate-spin text-[14px]" />
              ) : pendingAction === "CLOSED" ? (
                "Zatvori objekat"
              ) : pendingAction === "EMERGENCY_SHUTDOWN" ? (
                "Pokreni hitno gašenje"
              ) : pendingAction === "ACTIVE" ? (
                "Otvori"
              ) : (
                "Vrati u nacrt"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** @deprecated Prefer FacilityStatusControl — kept for import compatibility. */
export { FacilityStatusControl as StatusToggle };
