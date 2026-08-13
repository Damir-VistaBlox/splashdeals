import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeCategoryRail } from "./HomeCategoryRail";
import { HomeQuickFilters } from "./HomeQuickFilters";

type HomeDict = Record<string, string>;

export function HomeHero({ dict }: { dict: HomeDict }) {
  return (
    <div className="relative z-0 w-full overflow-hidden pb-12 sm:pb-20">
      <section className="relative mx-auto max-w-7xl px-3 pt-6 sm:px-6 sm:pt-10 md:px-8">
        <div className="section-shell overflow-hidden rounded-[2rem] px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="animate-fade-up relative z-10 flex flex-col items-center text-center">
            <div className="pointer-events-none absolute top-0 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[80px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/35 to-transparent" />
            {dict.price_promise ? (
              <Badge
                variant="outline"
                className="border-primary/20 text-primary mb-5 rounded-full bg-white/82 px-4 py-2 text-[10px] font-black tracking-[0.16em] uppercase shadow-sm sm:mb-6"
              >
                {dict.price_promise}
              </Badge>
            ) : null}

            <h1 className="from-foreground to-foreground/72 mb-4 max-w-4xl bg-gradient-to-b via-sky-950 bg-clip-text text-[clamp(3rem,8.5vw,6.6rem)] leading-[0.92] font-black tracking-[-0.065em] text-transparent sm:mb-5">
              {dict.title_digital} <br className="hidden sm:block" />
              <span className="splash-gradient bg-clip-text text-transparent italic">
                {dict.title_splash}
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-[clamp(1rem,2.4vw,1.15rem)] leading-relaxed font-medium sm:mb-9">
              {dict.subtitle}
            </p>

            <div className="mb-4 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                asChild
                className="group h-13 min-h-13 w-full rounded-full px-10 text-sm font-black shadow-[0_18px_36px_rgba(6,182,212,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(6,182,212,0.28)] sm:w-auto sm:min-w-[248px] sm:px-11"
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
                className="text-foreground h-13 min-h-13 w-full rounded-full border-white/75 bg-white/78 px-8 text-[11px] font-black tracking-[0.14em] uppercase shadow-sm sm:w-auto"
              >
                <Link href="/how-it-works">{dict.how_it_works}</Link>
              </Button>
            </div>

            <p className="text-muted-foreground mb-8 text-[11px] font-bold tracking-[0.1em] uppercase sm:mb-12">
              Brza kupovina. Jasna ponuda. Ulaznice za nekoliko sekundi.
            </p>

            <div className="public-panel w-full max-w-5xl rounded-[1.75rem] p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex flex-col items-center gap-2 sm:mb-5">
                <span className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
                  Kreni odmah
                </span>
                <p className="text-foreground text-sm font-bold sm:text-base">
                  Izaberi kategoriju ili preskoči pravo na brze filtere.
                </p>
              </div>
              <HomeCategoryRail ariaLabel={dict.categories_aria} />
              <div className="mx-auto mt-5 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-slate-200/90 to-transparent sm:mt-6" />
              <div className="mt-4 flex flex-col items-center gap-3 sm:mt-5">
                <span className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                  Najbrži put do prave ponude
                </span>
                <HomeQuickFilters dict={dict} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
