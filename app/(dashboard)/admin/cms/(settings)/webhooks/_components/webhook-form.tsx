"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  createWebhookAction,
  updateWebhookAction,
  WEBHOOK_EVENTS,
} from "@/app/(server)/actions/webhooks";
import { WEBHOOK_EVENT_LABELS, type WebhookDetail } from "./webhook-types";

type Props = {
  mode: "create" | "edit";
  webhook?: WebhookDetail | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function WebhookForm({ mode, webhook, onSuccess, onCancel }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const selected = new Set(webhook?.events ?? []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const name = formData.get("name") as string;
      const url = formData.get("url") as string;
      const events = WEBHOOK_EVENTS.filter((ev) => formData.get(`event_${ev}`) === "on");

      startTransition(async () => {
        const result =
          mode === "create"
            ? await createWebhookAction({ name, url, events })
            : await updateWebhookAction(webhook!.id, { name, url, events });

        if (result.success) {
          toast.success(mode === "create" ? "Vebhuk kreiran" : "Vebhuk ažuriran");
          onSuccess?.();
          router.refresh();
          if (mode === "create" && !onSuccess) {
            router.push("/admin/cms/webhooks");
          }
        } else {
          toast.error(result.error || "Greška pri čuvanju");
        }
      });
    },
    [mode, webhook, router, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-lg border p-6">
        <h3 className="text-sm font-semibold">Osnovne informacije</h3>
        <div className="space-y-1.5">
          <Label htmlFor="webhook-name">Naziv</Label>
          <Input
            id="webhook-name"
            name="name"
            defaultValue={webhook?.name ?? ""}
            placeholder="npr. Slack obaveštenja"
            required
            className="max-w-md"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="webhook-url">URL</Label>
          <Input
            id="webhook-url"
            name="url"
            type="url"
            defaultValue={webhook?.url ?? ""}
            placeholder="https://hooks.slack.com/services/..."
            required
            className="max-w-lg"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-6">
        <h3 className="text-sm font-semibold">Događaji</h3>
        <p className="text-muted-foreground text-xs">
          Izaberite događaje za koje želite da primate obaveštenja.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WEBHOOK_EVENTS.map((event) => (
            <Label
              key={event}
              className="has-[:checked]:border-primary has-[:checked]:bg-primary/5 flex items-start gap-3 rounded-md border p-3"
            >
              <Checkbox name={`event_${event}`} value="on" defaultChecked={selected.has(event)} />
              <div>
                <span className="text-sm font-medium">{WEBHOOK_EVENT_LABELS[event] || event}</span>
                <p className="text-muted-foreground text-xs">{event}</p>
              </div>
            </Label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          <Icon name={mode === "create" ? "add" : "save"} className="mr-1 size-4" />
          {mode === "create" ? "Kreiraj vebhuk" : "Sačuvaj izmene"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Odustani
          </Button>
        ) : null}
      </div>
    </form>
  );
}
