"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileNameAction } from "@/app/(server)/actions/account-profile";
import { toast } from "sonner";

export function ProfileNameForm({
  initialName,
  labels,
}: {
  initialName: string;
  labels: {
    name: string;
    hint: string;
    validation: string;
    save: string;
    saving: string;
    success: string;
    error: string;
    characters_left: string;
  };
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const remaining = 80 - name.length;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
          setError(labels.validation);
          return;
        }
        setError(null);
        startTransition(async () => {
          const result = await updateProfileNameAction(trimmedName);
          if (!result.success) {
            toast.error(result.error || labels.error);
            return;
          }
          toast.success(labels.success);
          router.refresh();
        });
      }}
    >
      <div className="space-y-2.5">
        <div className="space-y-1">
          <Label htmlFor="profile-name">{labels.name}</Label>
          <p className="text-muted-foreground text-xs leading-relaxed">{labels.hint}</p>
        </div>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="h-12 rounded-2xl"
          required
        />
        <div className="flex items-center justify-between gap-3">
          {error ? <p className="text-destructive text-xs font-medium">{error}</p> : <span />}
          <p className="text-muted-foreground text-xs">
            {labels.characters_left}: {remaining}
          </p>
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="h-12 min-h-12 rounded-full px-5">
        {isPending ? labels.saving : labels.save}
      </Button>
    </form>
  );
}
