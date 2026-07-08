"use client";
import { Icon } from "@/components/ui/Icon";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Forbidden Page Error:", error);
  }, [error]);

  return (
    <div className="bg-background text-foreground relative flex min-h-screen items-center justify-center p-6">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
        <div className="bg-muted/10 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      </div>
      <Card className="border-border/50 bg-background/50 relative z-10 w-full max-w-xl space-y-8 p-8 text-center md:p-12">
        <div className="bg-muted/50 border-border text-muted-foreground relative inline-flex h-20 w-20 items-center justify-center rounded-full border">
          <Icon name="gpp_maybe" className="size-10 stroke-[1.5]" />
        </div>
        <div className="space-y-3">
          <h1 className="text-foreground text-3xl leading-none font-black tracking-tighter uppercase italic">
            Access <br />
            <span className="text-muted-foreground">Error</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
            Došlo je do greške prilikom provere vaših dozvola. Molimo pokušajte ponovo.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={reset}
            variant="outline"
            className="h-11 rounded-xl text-[10px] font-black tracking-widest uppercase"
          >
            <Icon name="refresh" className="size-4" />
            Pokušaj ponovo
          </Button>
          <Button
            asChild
            variant="secondary"
            className="h-11 rounded-xl text-[10px] font-black tracking-widest uppercase"
          >
            <Link href="/admin/dashboard">
              <Icon name="home" className="size-4" />
              Kontrolna tabla
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
