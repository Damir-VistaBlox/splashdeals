"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/Icon"

export default function NavigationError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <Icon name="error" className="size-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Došlo je do greške</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Nije moguće učitati meni. Pokušajte ponovo.
      </p>
      <Button onClick={reset}>
        <Icon name="refresh" className="size-4 mr-1.5" />
        Pokušaj ponovo
      </Button>
    </div>
  )
}
