"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FacilityStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateFacilityStatusAction } from "@/app/(server)/actions/governance";

interface StatusToggleProps {
  facilityId: string;
  status: FacilityStatus;
  compact?: boolean;
}

const STATUS_LABEL: Record<FacilityStatus, string> = {
  ACTIVE: "Aktivan",
  DRAFT: "Nacrt",
  CLOSED: "Zatvoren",
  EMERGENCY_SHUTDOWN: "Vanredno",
};

export function StatusToggle({ facilityId, status, compact }: StatusToggleProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const applyStatus = (nextStatus: FacilityStatus) => {
    if (nextStatus === status) return;
    startTransition(async () => {
      const result = await updateFacilityStatusAction({
        facilityId,
        status: nextStatus,
      });

      if (result.success) {
        toast.success(`Objekat je sada: ${STATUS_LABEL[nextStatus]}`);
        router.refresh();
      } else {
        toast.error(result.error || "Prebacivanje statusa nije uspelo");
      }
    });
  };

  const toggleActiveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyStatus(status === "ACTIVE" ? "DRAFT" : "ACTIVE");
  };

  // CLOSED / EMERGENCY — recovery menu (M13)
  if (status !== "DRAFT" && status !== "ACTIVE") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Status: ${STATUS_LABEL[status]}. Promeni status`}
            className={cn(
              "h-auto rounded-md border px-2.5 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase",
              status === "EMERGENCY_SHUTDOWN"
                ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15"
                : "bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/20",
            )}
          >
            {isPending ? (
              <Icon name="progress_activity" className="mr-1 animate-spin text-[12px]" />
            ) : null}
            {STATUS_LABEL[status]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Promeni status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => applyStatus("ACTIVE")}>
            Postavi na aktivan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyStatus("DRAFT")}>Postavi na nacrt</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const label = STATUS_LABEL[status];
  const nextHint = status === "ACTIVE" ? "Postavi na nacrt" : "Objavi (aktivno)";

  if (compact) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={toggleActiveDraft}
        title={nextHint}
        aria-label={`${label}. ${nextHint}`}
        className={cn(
          "group relative h-auto rounded-md border px-2.5 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase transition-colors",
          status === "ACTIVE"
            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            : "border-warning/30 bg-warning/10 text-warning hover:bg-warning/20",
        )}
      >
        <span className="flex items-center gap-1.5">
          {isPending ? (
            <Icon name="progress_activity" className="animate-spin text-[12px]" />
          ) : (
            <Icon
              name="bolt"
              className={cn("text-[12px]", status === "ACTIVE" ? "text-primary" : "text-warning")}
            />
          )}
          {label}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={toggleActiveDraft}
      aria-label={nextHint}
      className="border-border/50 bg-muted/10 hover:bg-muted/30 h-8 gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
    >
      {isPending ? (
        <Icon name="progress_activity" className="animate-spin text-[12px]" />
      ) : status === "ACTIVE" ? (
        <Icon name="bolt" className="text-warning text-[12px]" />
      ) : (
        <Icon name="bolt" className="text-primary text-[12px]" />
      )}
      {status === "ACTIVE" ? "Postavi na nacrt" : "Objavi"}
    </Button>
  );
}
