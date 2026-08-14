"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { useEffect, useState } from "react";
import { getClientDictionary } from "@/lib/client-dictionaries";
import type { Dict } from "@/lib/types";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dict, setDict] = useState<Dict | null>(null);

  useEffect(() => {
    console.error("Account route error:", error);

    getClientDictionary().then(setDict);
  }, [error]);

  const t = dict?.account;
  const title = t?.error_title || "Došlo je do greške";
  const description =
    t?.error_description ||
    "Nismo mogli da učitamo ovu stranicu. Pokušajte ponovo ili se vratite na početak naloga.";
  const retryLabel = t?.error_retry || "Pokušaj ponovo";
  const digestLabel = t?.error_digest || "Greška ID";

  return (
    <div className="mobile-route-frame flex items-center justify-center px-4 py-6 sm:px-6">
      <div className="bg-card/82 border-border shadow-soft flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] border px-6 py-8 text-center backdrop-blur-sm">
        <div className="bg-destructive/10 text-destructive flex h-16 w-16 items-center justify-center rounded-3xl">
          <Icon name="error_outline" className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight uppercase">{title}</h2>
          <p className="text-muted-foreground text-sm font-medium">{description}</p>
          {error.digest ? (
            <p className="text-muted-foreground/80 font-mono text-[10px] tracking-[0.24em] uppercase">
              {digestLabel} {error.digest}
            </p>
          ) : null}
        </div>
        <Button onClick={reset} variant="default" className="h-11 min-h-11 w-full sm:w-auto">
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}
