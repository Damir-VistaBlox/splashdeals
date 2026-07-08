"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

export default function PostsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Posts Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <Icon name="error" className="text-destructive size-10" />
      <h2 className="text-lg font-semibold">Greška</h2>
      <p className="text-muted-foreground text-sm">{error.message || "Neočekivana greška."}</p>
      <button onClick={reset} className="text-primary text-sm hover:underline">
        Pokušaj ponovo
      </button>
    </div>
  );
}
