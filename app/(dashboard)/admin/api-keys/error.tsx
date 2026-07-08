"use client";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Link from "next/link";

export default function ApiKeysError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("API Keys Error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-6 md:p-10">
      <div className="bg-muted/30 border-border text-muted-foreground mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border">
        <Icon name="key" className="text-[40px]" />
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-black tracking-tighter uppercase italic">
          API ključevi <span className="text-muted-foreground">Greška</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xs text-sm">
          Nije moguće učitati API ključeve. Molimo pokušajte ponovo.
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3 pt-2">
        <Button
          onClick={reset}
          variant="outline"
          className="bg-muted/30 hover:bg-muted/50 border-border/50 flex w-full items-center justify-center gap-2 rounded-xl border px-8 py-4 text-[10px] font-black tracking-widest uppercase transition-all"
        >
          <Icon name="refresh" className="text-[16px]" />
          Pokušaj ponovo
        </Button>
        <Link
          href="/admin/api-keys"
          className="bg-muted/80 hover:bg-foreground/10 text-foreground flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-[10px] font-black tracking-widest uppercase transition-all"
        >
          <Icon name="key" className="text-[16px]" />
          API ključevi
        </Link>
      </div>
    </div>
  );
}
