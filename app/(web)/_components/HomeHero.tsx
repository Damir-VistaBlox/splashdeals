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
        <div className="section-shell overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 sm:py-16">
          <div className="animate-fade-up relative z-10 flex flex-col items-center text-center">
            <div className="pointer-events-none absolute top-0 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[80px]" />
            {dict.price_promise ? (
              <Badge
                variant="outline"
                className="border-primary/25 text-primary mb-5 rounded-full bg-white/75 px-4 py-2 text-[11px] font-black tracking-[0.24em] uppercase shadow-sm sm:mb-7 sm:text-[10px]"
              >
                {dict.price_promise}
              </Badge>
            ) : null}

            <h1 className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b via-sky-950 bg-clip-text text-[clamp(2.8rem,11vw,8.8rem)] leading-[0.88] font-black tracking-[-0.08em] text-transparent sm:mb-8">
              {dict.title_digital} <br className="hidden sm:block" />
              <span className="splash-gradient bg-clip-text text-transparent italic">
                {dict.title_splash}
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-[clamp(1rem,3vw,1.35rem)] leading-relaxed font-medium sm:mb-10">
              {dict.subtitle}
            </p>

            <div className="mb-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mb-12 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                asChild
                className="h-13 min-h-13 w-full rounded-full px-10 text-sm font-black shadow-[0_16px_32px_rgba(6,182,212,0.22)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto sm:min-w-[240px] sm:px-12"
              >
                <Link
                  href="#inventory"
                  className="flex h-full w-full items-center justify-center gap-2"
                >
                  {dict.facilities_btn}
                  <Icon name="arrow_forward" className="text-[20px]" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-13 min-h-13 w-full rounded-full border-white/70 bg-white/70 px-8 text-xs font-black tracking-widest uppercase shadow-sm sm:w-auto"
              >
                <Link href="/how-it-works">{dict.how_it_works}</Link>
              </Button>
            </div>

            <div className="public-panel w-full max-w-5xl rounded-[1.75rem] p-4 sm:p-5">
              <HomeCategoryRail ariaLabel={dict.categories_aria} />
              <div className="mt-5 sm:mt-6">
                <HomeQuickFilters dict={dict} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
