import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeCategoryRail } from "./HomeCategoryRail";
import { HomeQuickFilters } from "./HomeQuickFilters";

type HomeDict = Record<string, string>;

export function HomeHero({ dict }: { dict: HomeDict }) {
  return (
    <div className="relative z-0 w-full overflow-hidden pb-8 sm:pb-20">
      <section className="relative mx-auto max-w-7xl px-3 pt-4 sm:px-6 sm:pt-10 md:px-8">
        <div className="section-shell overflow-hidden rounded-[1.75rem] px-4 py-5 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="animate-fade-up relative z-10 flex flex-col items-center text-center">
            <div className="pointer-events-none absolute top-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[72px] sm:h-44 sm:w-44 sm:blur-[80px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/35 to-transparent sm:h-40" />
            {dict.price_promise ? (
              <Badge
                variant="outline"
                className="border-primary/20 text-primary mb-2.5 rounded-full bg-white/82 px-3 py-1 text-[9px] font-black tracking-[0.16em] uppercase shadow-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-[10px]"
              >
                {dict.price_promise}
              </Badge>
            ) : null}

            <h1 className="from-foreground to-foreground/72 mb-2 max-w-4xl bg-gradient-to-b via-sky-950 bg-clip-text text-[clamp(2.15rem,6.8vw,6.6rem)] leading-[0.9] font-black tracking-[-0.07em] text-transparent sm:mb-5">
              {dict.title_digital} <br className="hidden sm:block" />
              <span className="splash-gradient bg-clip-text text-transparent italic">
                {dict.title_splash}
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-3 max-w-[15.5rem] text-[0.92rem] leading-relaxed font-medium sm:mb-9 sm:max-w-2xl sm:text-[clamp(1rem,2.4vw,1.15rem)]">
              {dict.subtitle}
            </p>

            <div className="mb-2 flex w-full max-w-md flex-col items-stretch gap-2 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                asChild
                className="group h-11.5 min-h-11.5 w-full rounded-full px-8 text-[14px] font-black shadow-[0_20px_38px_rgba(6,182,212,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(6,182,212,0.28)] sm:h-13 sm:min-h-13 sm:w-auto sm:min-w-[248px] sm:px-11 sm:text-sm"
              >
                <Link
                  href="#inventory"
                  className="flex h-full w-full items-center justify-center gap-2"
                >
                  {dict.facilities_btn}
                  <Icon
                    name="arrow_forward"
                    className="text-[20px] transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="text-muted-foreground sm:text-foreground hidden h-11 min-h-11 w-full rounded-full border-white/70 bg-white/72 px-8 text-[10px] font-black tracking-[0.16em] uppercase shadow-sm sm:inline-flex sm:h-13 sm:min-h-13 sm:w-auto sm:text-[11px]"
              >
                <Link href="/how-it-works">{dict.how_it_works}</Link>
              </Button>
            </div>

            <p className="text-muted-foreground mb-0 hidden max-w-[17rem] text-[10px] leading-relaxed font-bold tracking-[0.12em] uppercase sm:mb-12 sm:block sm:max-w-none sm:text-[11px]">
              Brza kupovina. Jasna ponuda. Ulaznice za nekoliko sekundi.
            </p>
          </div>
        </div>

        <div className="public-panel mt-3 w-full max-w-5xl rounded-[1.5rem] border border-white/70 p-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:mt-0 sm:p-5 lg:p-6">
          <div className="mb-2 flex flex-col items-center gap-1 sm:mb-5 sm:gap-2">
            <span className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
              Kreni odmah
            </span>
            <p className="text-foreground hidden max-w-[17rem] text-[15px] leading-tight font-black text-balance sm:block sm:max-w-none sm:text-base">
              Izaberi kategoriju ili preskoči pravo na brze filtere.
            </p>
          </div>
          <HomeCategoryRail ariaLabel={dict.categories_aria} />
          <div className="mx-auto mt-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-slate-200/90 to-transparent sm:mt-6" />
          <div className="mt-3 flex flex-col items-center gap-2.5 sm:mt-5">
            <span className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">
              Najbrži put do prave ponude
            </span>
            <HomeQuickFilters dict={dict} />
          </div>
        </div>
      </section>
    </div>
  );
}
