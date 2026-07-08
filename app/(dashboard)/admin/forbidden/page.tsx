import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ograničen pristup | Splashdeals Admin",
  description: "Your administrative clearance does not permit access to this sector.",
};

export default function ForbiddenPage() {
  return (
    <div className="bg-background flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-red-500/20 blur-[60px]" />
        <div className="bg-muted relative rounded-2xl border border-red-500/50 p-6 shadow-2xl">
          <Icon name="gpp_maybe" className="size-12 text-red-500" />
        </div>
      </div>

      <h1 className="text-foreground mb-4 text-4xl font-black tracking-tighter uppercase italic">
        Ograničen pristup
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed font-medium">
        Your current administrative clearance does not permit access to this sector. Please contact
        a Super Admin if you believe this is an error.
      </p>

      <Button asChild variant="outline" size="lg" className="rounded-xl">
        <Link href="/admin/dashboard">
          <Icon name="arrow_back" className="mr-2 size-4" />
          Nazad na kontrolnu tablu
        </Link>
      </Button>
    </div>
  );
}
