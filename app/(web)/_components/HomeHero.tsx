import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, type CategorySlug } from "@/lib/routing/categories";

type HomeDict = Record<string, string>;

const HERO_CATEGORY_SLUGS: CategorySlug[] = ["akva-parkovi", "banje", "bazeni", "wellness-i-spa"];

export function HomeHero({ dict }: { dict: HomeDict }) {
  const heroQuickLinks = [
    { href: "#savings", label: dict.filter_discount, tone: "subtle" as const },
    { href: "#inventory", label: dict.inventory_cta, tone: "subtle" as const },
  ];
  const heroPillClassName =
    "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground inline-flex h-11 min-h-11 items-center justify-center rounded-full px-4 text-[11px] font-black tracking-[0.1em] uppercase shadow-[0_10px_24px_rgba(231,179,75,0.16)] transition-all duration-150 hover:-translate-y-0.5 sm:px-5 sm:text-[10px]";

  return (
    <div className="relative z-0 w-full overflow-hidden pb-6 sm:pb-20">
      <section className="relative mx-auto max-w-7xl px-3 pt-1 sm:px-6 sm:pt-10 md:px-8">
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

            <p className="text-muted-foreground mx-auto mb-3 max-w-[18rem] text-[0.92rem] leading-relaxed font-medium sm:mb-9 sm:max-w-2xl sm:text-[clamp(1rem,2.4vw,1.15rem)]">
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
                        <Link
                          href={`/${slug}`}
                          className={heroPillClassName}
                        >
                          {CATEGORIES[slug].name}
                        </Link>
                      </li>
                    ))}

                    {heroQuickLinks.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={heroPillClassName}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <nav
                aria-label={dict.categories_aria || "Kategorije i brzi filteri"}
                className="mx-auto w-full max-w-4xl sm:hidden"
              >
                <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5">
                  {HERO_CATEGORY_SLUGS.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className={heroPillClassName}
                      >
                        {CATEGORIES[slug].name}
                      </Link>
                    </li>
                  ))}

                  {heroQuickLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={heroPillClassName}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
