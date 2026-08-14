import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, type CategorySlug } from "@/lib/routing/categories";

type HomeDict = Record<string, string>;

const HERO_CATEGORY_SLUGS: CategorySlug[] = ["akva-parkovi", "banje", "bazeni", "wellness-i-spa"];

export function HomeHero({ dict }: { dict: HomeDict }) {
  const heroQuickLinks = [{ href: "#inventory", label: dict.inventory_cta }];
  const heroTrustPoints = [
    dict.trust_1_title || "Sigurna kupovina",
    dict.trust_2_title || "Brza isporuka",
  ];
  const heroPillClassName =
    "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground inline-flex h-11 min-h-11 items-center justify-center rounded-full px-4 text-[11px] font-black tracking-[0.1em] uppercase shadow-[0_10px_24px_rgba(231,179,75,0.16)] transition-all duration-150 hover:-translate-y-0.5 sm:px-5 sm:text-[10px]";
  const mobilePillClassName =
    "bg-secondary/92 text-secondary-foreground hover:bg-primary hover:text-primary-foreground inline-flex h-11 min-h-11 items-center justify-center rounded-full px-4 text-[10px] font-black tracking-[0.08em] uppercase shadow-[0_8px_18px_rgba(231,179,75,0.14)] transition-colors";

  return (
    <div className="relative z-0 w-full overflow-hidden pb-7 sm:pb-20">
      <section className="mx-auto max-w-7xl px-3 pt-1 sm:hidden">
        <div className="section-shell overflow-hidden rounded-[1.9rem] px-4 pt-[5rem] pb-4">
          <div className="pointer-events-none absolute top-5 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-sky-200/45 blur-[54px]" />
          <div className="pointer-events-none absolute -right-10 bottom-12 h-28 w-28 rounded-full bg-cyan-300/20 blur-[58px]" />
          <div className="pointer-events-none absolute inset-x-4 top-[4.35rem] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="relative z-10">
            <nav aria-label={dict.categories_aria || "Kategorije i brzi filteri"}>
              <ul className="no-scrollbar -mx-1 mb-3 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [-webkit-overflow-scrolling:touch]">
                {HERO_CATEGORY_SLUGS.map((slug) => (
                  <li key={slug} className="shrink-0 snap-start">
                    <Link href={`/${slug}`} className={mobilePillClassName}>
                      {CATEGORIES[slug].name}
                    </Link>
                  </li>
                ))}

                {heroQuickLinks.map((item) => (
                  <li key={item.href} className="shrink-0 snap-start">
                    <Link href={item.href} className={mobilePillClassName}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {dict.price_promise ? (
              <Badge
                variant="outline"
                className="border-primary/20 text-primary mb-3 rounded-full bg-white/84 px-3.5 py-1 text-[10px] font-black tracking-[0.16em] uppercase shadow-sm"
              >
                {dict.price_promise}
              </Badge>
            ) : null}

            <p className="text-primary mb-2 text-[10px] font-black tracking-[0.22em] uppercase">
              Digitalne karte bez čekanja
            </p>

            <h1 className="from-foreground to-foreground/72 mb-3 bg-gradient-to-b via-sky-950 bg-clip-text text-[2.7rem] leading-[0.86] font-black tracking-[-0.09em] text-transparent">
              {dict.title_digital}
              <br />
              <span className="splash-gradient bg-clip-text text-transparent italic">
                {dict.title_splash}
              </span>
            </h1>

            <p className="text-muted-foreground mb-4 max-w-[20rem] text-[0.98rem] leading-relaxed font-medium">
              {dict.subtitle}
            </p>

            <div className="mb-4 flex flex-col gap-2.5">
              <Button
                asChild
                className="group h-13 min-h-13 w-full rounded-full px-6 text-[15px] font-black shadow-[0_20px_38px_rgba(6,182,212,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_42px_rgba(6,182,212,0.28)]"
              >
                <Link
                  href="#inventory"
                  className="flex h-full w-full items-center justify-center gap-2"
                >
                  {dict.facilities_btn}
                  <Icon
                    name="arrow_forward"
                    className="text-[18px] transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>
            </div>

            <div className="surface-glass rounded-[1.45rem] p-3 shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <span className="text-primary block text-[10px] font-black tracking-[0.18em] uppercase">
                    Zašto Splashdeals
                  </span>
                  <span className="text-muted-foreground block pt-1 text-[11px] font-medium">
                    Kupovina optimizovana za telefon i brz ulaz.
                  </span>
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {heroTrustPoints.map((point) => (
                  <li
                    key={point}
                    className="surface-subtle flex min-h-[4.75rem] flex-col items-start justify-between rounded-[1.05rem] border border-white/70 px-3 py-2.5"
                  >
                    <span className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      <Icon name="verified" className="text-[15px]" />
                    </span>
                    <span className="text-[10px] leading-tight font-black tracking-[0.08em] uppercase">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto hidden max-w-7xl px-3 pt-1 sm:block sm:px-6 sm:pt-10 md:px-8">
        <div className="section-shell overflow-hidden rounded-[1.75rem] px-4 py-5 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="animate-fade-up relative z-10 flex flex-col items-center text-center">
            <div className="pointer-events-none absolute top-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[72px] sm:h-44 sm:w-44 sm:blur-[80px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/35 to-transparent sm:h-40" />
            {dict.price_promise ? (
              <Badge
                variant="outline"
                className="border-primary/20 text-primary mb-3 rounded-full bg-white/82 px-3 py-1 text-[9px] font-black tracking-[0.16em] uppercase shadow-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-[10px]"
              >
                {dict.price_promise}
              </Badge>
            ) : null}

            <h1 className="from-foreground to-foreground/72 mb-2 max-w-4xl bg-gradient-to-b via-sky-950 bg-clip-text text-[clamp(2.2rem,7.2vw,6.6rem)] leading-[0.9] font-black tracking-[-0.07em] text-transparent sm:mb-5">
              {dict.title_digital} <br className="hidden sm:block" />
              <span className="splash-gradient bg-clip-text text-transparent italic">
                {dict.title_splash}
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-4 max-w-[18rem] text-[0.92rem] leading-relaxed font-medium sm:mb-9 sm:max-w-2xl sm:text-[clamp(1rem,2.4vw,1.15rem)]">
              {dict.subtitle}
            </p>

            <div className="mb-2 flex w-full max-w-md flex-col items-stretch gap-2 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                asChild
                className="group h-12.5 min-h-12.5 w-full rounded-full px-8 text-[15px] font-black shadow-[0_20px_38px_rgba(6,182,212,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(6,182,212,0.28)] sm:h-13 sm:min-h-13 sm:w-auto sm:min-w-[248px] sm:px-11 sm:text-sm"
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
            </div>

            <ul className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:mb-8 sm:gap-3">
              {heroTrustPoints.map((point) => (
                <li
                  key={point}
                  className="surface-subtle text-foreground inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black tracking-[0.14em] uppercase sm:px-4"
                >
                  <Icon name="verified" className="text-primary text-[15px]" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-1 w-full max-w-5xl sm:mt-0">
              <div className="surface-glass hidden rounded-[1.5rem] p-5 sm:block lg:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
                      Kreni odmah
                    </span>
                  </div>
                  <Link
                    href="/akva-parkovi"
                    className="bg-primary/10 text-primary shrink-0 rounded-full px-3 py-2 text-[10px] font-black tracking-[0.14em] uppercase"
                  >
                    Sve ponude
                  </Link>
                </div>
                <nav
                  aria-label={dict.categories_aria || "Kategorije i brzi filteri"}
                  className="mx-auto w-full max-w-4xl"
                >
                  <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5">
                    {HERO_CATEGORY_SLUGS.map((slug) => (
                      <li key={slug}>
                        <Link href={`/${slug}`} className={heroPillClassName}>
                          {CATEGORIES[slug].name}
                        </Link>
                      </li>
                    ))}

                    {heroQuickLinks.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={heroPillClassName}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
