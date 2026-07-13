"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <Icon name="error" className="text-destructive size-12" />
      <div className="space-y-2">
        <h2 className="text-xl font-black tracking-tight uppercase">Došlo je do greške</h2>
        <p className="text-muted-foreground max-w-md text-sm font-medium">
          {error.message || "Neočekivana greška u admin panelu."}
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <Icon name="refresh" className="mr-1 size-4" />
          Pokušaj ponovo
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">
            <Icon name="dashboard" className="mr-1 size-4" />
            Kontrolna tabla
          </Link>
        </Button>
      </div>
    </div>
  );
}
