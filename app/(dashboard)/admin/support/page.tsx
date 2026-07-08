import { Icon } from "@/components/ui/Icon";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Podrška | Splashdeals Admin",
  description: "Customer support logs and escalation management.",
};

export default function SupportPage() {
  return (
    <div className="bg-background border-border/50 relative flex min-h-[calc(100vh-4rem)] w-full flex-col gap-8 overflow-hidden rounded-2xl border p-4 md:p-6">
      <div className="pointer-events-none absolute top-0 right-0 -mt-64 -mr-64 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10">
        <h1 className="text-foreground text-2xl font-black tracking-tight uppercase italic">
          Podrška
        </h1>
        <p className="text-muted-foreground mt-1.5 text-xs font-medium tracking-wider uppercase opacity-80">
          Track and manage customer support tickets and escalations.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-muted/50 border-border mb-6 rounded-full border p-5">
          <Icon name="support" className="text-muted-foreground text-[40px]" />
        </div>
        <h2 className="text-foreground/80 mb-2 text-lg font-bold">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Customer support log management is under development. Tickets and escalations will appear
          here.
        </p>
        <Button
          asChild
          variant="outline"
          className="border-border hover:bg-muted/30 text-foreground mt-8 h-11 rounded-xl px-8 text-[11px] font-bold tracking-widest uppercase"
        >
          <Link href="/admin">
            <Icon name="arrow_back" className="mr-2 text-[16px]" />
            Nazad na kontrolnu tablu
          </Link>
        </Button>
      </div>
    </div>
  );
}
