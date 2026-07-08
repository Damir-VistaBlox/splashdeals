"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { deleteFacilityAction } from "@/server/actions/facilities";

interface DangerZoneProps {
  facilityId: string;
  facilityName: string;
  userRole: string;
  transactionCount: number;
}

/**
 * ⚠️ DangerZone Component (Aquastream UI Pro Max)
 *
 * Implements high-friction, Super Admin-gated deletion with cascade transaction safeguards.
 * Respects strict color-ban rules (Absolutely NO purple/indigo/violet).
 */
export function DangerZone({
  facilityId,
  facilityName,
  userRole,
  transactionCount,
}: DangerZoneProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmName, setConfirmName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const hasTransactions = transactionCount > 0;

  const handleDelete = () => {
    if (confirmName !== facilityName) {
      toast.error("Verification name does not match.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteFacilityAction(facilityId);
        if (result.success) {
          toast.success("Facility successfully purged");
          setIsOpen(false);
          router.push("/admin/facilities");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to purge facility");
        }
      } catch (error: unknown) {
        console.error("Failed to delete facility:", error instanceof Error ? error.message : error);
        toast.error("An anomaly occurred during deletion.");
      }
    });
  };

  return (
    <Card className="space-y-6 border-rose-500/20 bg-rose-950/5 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-rose-500/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-rose-500/10 p-2">
            <Icon name="warning" className="text-[16px] text-rose-400" />
          </div>
          <div>
            <h3 className="text-foreground text-xs font-black tracking-wider uppercase">
              Danger Zone
            </h3>
            <p className="mt-0.5 text-[9px] font-bold tracking-widest text-rose-400/60 uppercase">
              Catastrophic Actions & Registry Purges
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!isSuperAdmin ? (
          <div className="bg-background/40 border-border/50 flex items-start gap-3 rounded-xl border p-4">
            <Icon name="lock" className="text-muted-foreground mt-0.5 shrink-0 text-[16px]" />
            <div className="space-y-1">
              <p className="text-foreground/80 text-xs font-black tracking-wider uppercase">
                Administrative Guard Active
              </p>
              <p className="text-muted-foreground text-[10px] leading-normal font-medium">
                Your role classification ({userRole}) does not possess elevated privileges required
                to delete facility nodes. Contact a Super Administrator to execute purges.
              </p>
            </div>
          </div>
        ) : hasTransactions ? (
          <div className="bg-background/40 flex items-start gap-3 rounded-xl border border-rose-500/10 p-4">
            <Icon name="lock" className="mt-0.5 shrink-0 text-[16px] text-rose-400" />
            <div className="space-y-1">
              <p className="text-xs font-black tracking-wider text-rose-400 uppercase">
                Deletion Locked
              </p>
              <p className="text-muted-foreground text-[10px] leading-relaxed font-medium">
                This facility is linked to{" "}
                <strong className="text-foreground">
                  {transactionCount} active or historical transaction records
                </strong>{" "}
                in the system ledger. Hard deletion is disabled to preserve accounting audits. Set
                the facility status to <strong className="text-foreground">CLOSED</strong> instead.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-background/40 flex flex-col justify-between gap-4 rounded-xl border border-rose-500/10 p-4 md:flex-row md:items-center">
            <div className="max-w-xl space-y-1">
              <p className="text-foreground text-xs font-black tracking-wider uppercase">
                Purge Facility Node
              </p>
              <p className="text-muted-foreground text-[10px] leading-normal font-medium">
                Permanently delete <strong className="text-foreground/80">{facilityName}</strong>{" "}
                along with all associated tickets, operating hours, amenities, closures, and staff
                assignments. This action is absolute and cannot be undone.
              </p>
            </div>

            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) setConfirmName("");
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 shrink-0 rounded-xl border-rose-500/20 bg-rose-500/10 px-6 text-[9px] font-black tracking-widest text-rose-400 uppercase transition-all duration-300 hover:bg-rose-500 hover:text-slate-950"
                >
                  <Icon name="delete" className="mr-2 size-3.5" />
                  Purge Node
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-background border-border text-foreground max-w-md rounded-2xl p-6 outline-none">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Icon name="warning" className="size-5 shrink-0" />
                    <DialogTitle className="text-base font-black tracking-wider uppercase">
                      Absolute Purge Registry
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-muted-foreground text-xs leading-normal">
                    This action is <strong className="text-rose-400 uppercase">destructive</strong>{" "}
                    and will completely wipe{" "}
                    <strong className="text-foreground">{facilityName}</strong> from the database.
                    It will immediately cascade to delete:
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                  <ul className="text-muted-foreground list-disc space-y-1 pl-5 font-mono text-[9px] tracking-wider uppercase">
                    <li>All pricing schemas & active tickets</li>
                    <li>Schedules, hours & closure exceptions</li>
                    <li>Media associations & gallery images</li>
                    <li>Staff assignments & local registry records</li>
                  </ul>

                  <div className="border-border/50 space-y-2 border-t pt-4">
                    <label className="text-muted-foreground text-[10px] font-black tracking-wider uppercase">
                      To confirm, type the exact facility name{" "}
                      <span className="text-foreground select-none">
                        &quot;{facilityName}&quot;
                      </span>{" "}
                      below:
                    </label>
                    <Input
                      value={confirmName}
                      onChange={(e) => setConfirmName(e.target.value)}
                      placeholder={facilityName}
                      className="bg-muted/30 border-border text-foreground h-10 rounded-lg px-3 text-xs focus:border-rose-500/50"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setConfirmName("");
                    }}
                    className="border-border/50 bg-muted/30 hover:bg-muted/50 text-foreground h-10 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending || confirmName !== facilityName}
                    className="text-foreground flex h-10 min-w-[120px] items-center justify-center rounded-xl bg-rose-600 text-[9px] font-black tracking-widest uppercase transition-all hover:bg-rose-500 disabled:bg-rose-950/20 disabled:text-rose-900/50"
                  >
                    {isPending ? (
                      <Icon name="progress_activity" className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <Icon name="delete" className="mr-2 size-3.5" />
                        Purge Facility
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </Card>
  );
}
