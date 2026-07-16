"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { testWebhookAction } from "@/app/(server)/actions/webhooks";
import { WebhookForm } from "./webhook-form";
import { WEBHOOK_EVENT_LABELS, type WebhookDetail, type WebhookLogRow } from "./webhook-types";

export function WebhookEditClient({
  webhook,
  logs: initialLogs,
}: {
  webhook: WebhookDetail;
  logs: WebhookLogRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTest = useCallback(() => {
    startTransition(async () => {
      const result = await testWebhookAction(webhook.id);
      if (result.success) {
        toast.success(`Vebhuk testiran — status: ${result.data?.statusCode ?? "N/A"}`);
      } else {
        toast.error(result.error || "Greška pri testiranju");
      }
      router.refresh();
    });
  }, [webhook.id, router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Izmeni vebhuk</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Izmeni podešavanja vebhuka i pregledaj istoriju poziva.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleTest} disabled={isPending}>
            <Icon name="play_arrow" className="mr-1 size-4" />
            Testiraj
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/cms/webhooks">
              <Icon name="arrow_back" className="size-4" />
              Nazad
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Status:</span>
        {webhook.isActive ? (
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary dark:border-primary/40 dark:bg-primary/10"
          >
            Aktivan
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-destructive/40 bg-destructive/10 text-destructive"
          >
            Deaktiviran zbog grešaka
          </Badge>
        )}
      </div>

      <WebhookForm mode="edit" webhook={webhook} />

      <div className="rounded-lg border">
        <div className="border-b px-6 py-4">
          <h3 className="text-sm font-semibold">Istorija poziva</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Događaj</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>HTTP kod</TableHead>
              <TableHead>Vreme</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-24 text-center text-sm">
                  Nema zabeleženih poziva.
                </TableCell>
              </TableRow>
            ) : (
              initialLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <span className="text-sm">{WEBHOOK_EVENT_LABELS[log.event] || log.event}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        log.status === "success"
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                      }
                    >
                      {log.status === "success" ? "Uspešno" : "Neuspešno"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-muted-foreground text-xs">{log.responseCode ?? "-"}</code>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.createdAt).toLocaleString("sr-RS")}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
