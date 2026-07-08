"use client";
import { Icon } from "@/components/ui/Icon";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SlotErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export function SlotError({ error, reset, title = "Segment nije učitan" }: SlotErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(`[Slot Error] ${title}:`, error);
  }, [error, title]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-red-500/10 bg-red-500/5 p-8">
      <div className="rounded-full bg-red-500/10 p-3">
        <Icon name="error" className="text-[24px] text-red-500" />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-foreground text-sm font-black tracking-widest uppercase">{title}</h3>
        <p className="text-muted-foreground max-w-[200px] text-xs font-medium">
          Došlo je do greške prilikom učitavanja podataka.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => reset()}
          className="h-8 border-red-500/20 text-[10px] font-black tracking-widest uppercase hover:bg-red-500/10"
        >
          <Icon name="undo" className="mr-2 text-[12px]" />
          Pokušaj ponovo
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-border/50 h-8 text-[10px] font-black tracking-widest uppercase"
        >
          <Link href=".">
            <Icon name="keyboard_arrow_left" className="mr-2 text-[12px]" />
            Nazad na pregled
          </Link>
        </Button>
      </div>
    </div>
  );
}
