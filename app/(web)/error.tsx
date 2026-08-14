"use client";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getClientDictionary } from "@/lib/client-dictionaries";

export default function GlobalWebError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dict, setDict] = useState<Record<string, unknown> | null>(null);

  // Safe dictionary accessor for deeply nested keys
  const t = (...keys: string[]): string => {
    if (!dict) return "";
    let current: unknown = dict;
    for (const key of keys) {
      if (current && typeof current === "object")
        current = (current as Record<string, unknown>)[key];
      else return "";
    }
    return typeof current === "string" ? current : "";
  };

  useEffect(() => {
    console.error("Global Web Error:", error);
    let mounted = true;
    getClientDictionary().then((d) => {
      if (mounted) setDict(d as Record<string, unknown>);
    });
    return () => {
      mounted = false;
    };
  }, [error]);

  return (
    <div className="mobile-route-frame bg-background selection:bg-primary/20 text-foreground relative overflow-hidden px-4 py-6 sm:px-6 md:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-[radial-gradient(circle_at_top,rgba(14,165,198,0.14),transparent_68%)]" />

      <div className="relative z-10 flex min-h-[calc(100dvh-var(--safe-area-top)-2rem)] items-center justify-center">
        <Card className="bg-card/82 border-primary/10 shadow-soft w-full max-w-xl backdrop-blur-sm">
          <CardHeader className="items-center gap-5 p-6 pb-0 text-center sm:p-8 sm:pb-0 md:p-10 md:pb-0">
            <div className="bg-primary/10 text-primary border-primary/20 inline-flex h-20 w-20 items-center justify-center rounded-full border sm:h-24 sm:w-24">
              <Icon name="error" className="stroke-[1.5] text-[40px] sm:text-[48px]" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-foreground text-3xl leading-none font-black tracking-tight uppercase sm:text-4xl">
                {t("errors", "title") || "Došlo je do greške"}
              </CardTitle>
              <p className="text-primary text-sm font-black tracking-[0.28em] uppercase">
                {t("errors", "highlight") || "Privremeni prekid"}
              </p>
              <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed sm:text-base">
                {t("errors", "subtitle") ||
                  "Nešto je pošlo po zlu pri učitavanju ove stranice. Pokušajte ponovo ili se vratite na početnu."}
              </p>
              {error.digest ? (
                <p className="text-muted-foreground/80 font-mono text-[10px] tracking-[0.24em] uppercase">
                  Digest {error.digest}
                </p>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-5 text-center sm:p-8 md:p-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                onClick={reset}
                variant="outline"
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl px-6 text-xs font-black tracking-[0.22em] uppercase"
              >
                <Icon name="refresh" className="text-[16px]" />
                {t("errors", "try_again") || "Pokušaj ponovo"}
              </Button>
              <Link
                href="/"
                className="bg-primary hover:bg-primary/90 text-background shadow-primary/10 flex min-h-11 items-center justify-center gap-2 rounded-2xl px-6 text-xs font-black tracking-[0.22em] uppercase shadow-lg transition-colors"
              >
                <Icon name="home" className="text-[16px]" />
                {t("errors", "back_home") || "Nazad na početnu"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
