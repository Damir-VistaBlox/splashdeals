import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stranica nije pronađena | Splashdeals Admin",
  description: "Tražena stranica registra objekata ne postoji.",
};

export default function FacilitiesNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="text-primary/40 text-6xl font-bold">404</div>
      <h2 className="text-primary text-xl font-semibold">Stranica nije pronađena</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        Stranica koju tražite ne postoji u okviru sekcije za objekte.
      </p>
      <div className="mt-2 flex gap-3">
        <Button asChild variant="default">
          <Link href="/admin/facilities">Nazad na objekte</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Kontrolna tabla</Link>
        </Button>
      </div>
    </div>
  );
}
