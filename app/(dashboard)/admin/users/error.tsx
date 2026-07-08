"use client";
import { Icon } from "@/components/ui/Icon";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Users Section Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="border-border/50 bg-background/50 relative z-10 w-full max-w-xl space-y-8 p-8 text-center md:p-12">
        <div className="bg-muted/50 border-border text-muted-foreground relative inline-flex h-20 w-20 items-center justify-center rounded-full border">
          <Icon name="gpp_maybe" className="size-10 stroke-[1.5]" />
        </div>
        <div className="space-y-3">
          <h1 className="text-foreground text-3xl leading-none font-black tracking-tighter uppercase italic">
            Korisnici <span className="text-muted-foreground">Greška</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
            Došlo je do greške prilikom učitavanja korisnika.
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
            <Link href="/admin/users">
              <Icon name="arrow_back" className="size-4" />
              Nazad na korisnike
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
