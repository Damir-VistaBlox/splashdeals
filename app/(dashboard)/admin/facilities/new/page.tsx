import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OnboardFacilityForm } from "./_components/onboard-facility-form";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireSuperAdmin } from "@/app/(server)/lib/auth-guards";

export const metadata: Metadata = {
  title: "Novi objekat | Splashdeals Admin",
  description: "Registrujte novi akva park ili objekat u Splashdeals mrežu partnera.",
};

export default async function NewFacilityPage() {
  await connection();
  await requireSuperAdmin({ redirect: true });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 md:p-6">
      <section className="animate-in fade-in slide-in-from-left-4 border-border/60 bg-card/95 relative overflow-hidden rounded-[30px] border p-5 shadow-sm duration-500 md:p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_60%)] lg:block" />
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="border-border bg-muted/50 mt-1 rounded-2xl backdrop-blur-sm"
            >
              <Link href="/admin/facilities" aria-label="Nazad na objekte">
                <Icon name="keyboard_arrow_left" className="text-[16px]" />
              </Link>
            </Button>
            <div className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
                <span className="size-2 rounded-full bg-emerald-500" />
                Onboarding objekta
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-black tracking-tight uppercase">
                  Novi objekat
                </h1>
                <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
                  Registrujte novi akva park, bazen ili termalno kupalište i pripremite ga za
                  katalog, medije i prodaju kroz jedan vođeni tok.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Korak 1
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">Identitet</div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Korak 2
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">Lokacija</div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Korak 3
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">Objava</div>
            </div>
          </div>
        </div>
      </section>

      <OnboardFacilityForm />
    </div>
  );
}
