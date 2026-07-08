"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

export default function NavigationError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <Icon name="error" className="text-destructive mb-4 size-12" />
      <h2 className="mb-2 text-xl font-semibold">Došlo je do greške</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        Nije moguće učitati meni. Pokušajte ponovo.
      </p>
      <Button onClick={reset}>
        <Icon name="refresh" className="mr-1.5 size-4" />
        Pokušaj ponovo
      </Button>
    </div>
  );
}
