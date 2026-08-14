import { prisma } from "@/app/(server)/lib/prisma";
import { getDictionary } from "@/lib/dictionaries";
import Link from "next/link";
import { JsonLd } from "@/components/SEO/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBox } from "../_components/SearchBox";
import { absoluteUrl, pageMetadata, resolveSiteUrl } from "@/lib/seo";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FacilityRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  rank: number;
}

interface ContentRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  rank: number;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const title = query
    ? `Pretraga ponuda za ${query} | SplashDeals`
    : "Pretraga ponuda i objekata | SplashDeals";
  return {
    ...pageMetadata("/search"),
    title,
    description: query
      ? `Rezultati pretrage za ${query} na SplashDeals. Pregledajte objekte, sadržaj i destinacije za digitalnu kupovinu ulaznica.`
      : "Pretražite SplashDeals objekte, gradove i sadržaj za digitalne ulaznice.",
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "large",
      },
    } as const,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const dict = await getDictionary();
  const searchDict = dict.search || {};
  if (!q || q.trim().length < 2) {
    return <EmptyState dict={dict} />;
  }

  const query = q.trim();

  // Each raw-SQL block is isolated: one dead table shouldn't 500 the whole page.
  // Physical table names (partners."Facility", marketing.blog_posts, marketing.pages) match
  // what the Prisma @@map directives produce — NOT the Prisma model names.

  // Search facilities
  let facilities: FacilityRow[] = [];
  try {
    facilities =
      (await prisma.$queryRaw<FacilityRow[]>`
    SELECT id, name, slug, city,
           ts_rank(to_tsvector('serbian', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(city,'')), plainto_tsquery('serbian', ${query})) as rank
    FROM partners."Facility"
    WHERE to_tsvector('serbian', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(city,'')) @@ plainto_tsquery('serbian', ${query})
    ORDER BY rank DESC
    LIMIT 10
  `) ?? [];
  } catch (e) {
    console.error("[search] facility query failed:", e);
  }

  // Search blog posts
  let posts: ContentRow[] = [];
  try {
    posts =
      (await prisma.$queryRaw<ContentRow[]>`
    SELECT id, title, slug,
           substring(content, 0, 300) as excerpt,
           ts_rank(to_tsvector('serbian', coalesce(title,'') || ' ' || coalesce(content,'')), plainto_tsquery('serbian', ${query})) as rank
    FROM marketing.blog_posts
    WHERE to_tsvector('serbian', coalesce(title,'') || ' ' || coalesce(content,'')) @@ plainto_tsquery('serbian', ${query})
      AND status = 'PUBLISHED'
    ORDER BY rank DESC
    LIMIT 5
  `) ?? [];
  } catch (e) {
    console.error("[search] blog query failed:", e);
  }

  // Search pages
  let pages: ContentRow[] = [];
  try {
    pages =
      (await prisma.$queryRaw<ContentRow[]>`
    SELECT id, title, slug,
           substring(content, 0, 300) as excerpt,
           ts_rank(to_tsvector('serbian', coalesce(title,'') || ' ' || coalesce(content,'')), plainto_tsquery('serbian', ${query})) as rank
    FROM marketing.pages
    WHERE to_tsvector('serbian', coalesce(title,'') || ' ' || coalesce(content,'')) @@ plainto_tsquery('serbian', ${query})
      AND status = 'PUBLISHED'
    ORDER BY rank DESC
    LIMIT 5
  `) ?? [];
  } catch (e) {
    console.error("[search] pages query failed:", e);
  }

  const totalResults = facilities.length + posts.length + pages.length;
  const quickChips = [query, facilities[0]?.city, ...(searchDict.quick_chips || [])].filter(
    (value, index, all): value is string => Boolean(value) && all.indexOf(value) === index,
  );
  const site = resolveSiteUrl();
  const resultItems = [
    ...facilities.map((facility) => ({
      name: facility.name,
      url: absoluteUrl(`/${facility.slug}`, site),
      description: (
        searchDict.facility_result_description || "{city} • Direktan pristup ponudama"
      ).replace("{city}", facility.city),
    })),
    ...posts.map((post) => ({
      name: post.title,
      url: absoluteUrl(`/blog/${post.slug}`, site),
      description: post.excerpt
        ? stripHtml(post.excerpt)
        : searchDict.blog_result_description || "Blog sadržaj o ulaznicama i destinacijama.",
    })),
    ...pages.map((page) => ({
      name: page.title,
      url: absoluteUrl(`/${page.slug}`, site),
      description: page.excerpt
        ? stripHtml(page.excerpt)
        : searchDict.page_result_description || "Informativna stranica na SplashDeals.",
    })),
  ].slice(0, 12);
  const searchSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SearchResultsPage",
        "@id": `${site}/search#webpage`,
        url: absoluteUrl(`/search?q=${encodeURIComponent(query)}`, site),
        name: `Rezultati pretrage za ${query}`,
        description: `Pretraga objekata, blog sadržaja i informativnih stranica za pojam ${query}.`,
        isPartOf: { "@id": `${site}/#website` },
        inLanguage: "sr-Latn-RS",
        about: query,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: totalResults,
          itemListElement: resultItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: item.url,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${site}/search#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Početna",
            item: site,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Pretraga",
            item: absoluteUrl("/search", site),
          },
        ],
      },
    ],
  };

  // Log zero-result queries
  try {
    if (totalResults === 0) {
      await prisma.searchLog.create({
        data: { query, results: 0 },
      });
    }
  } catch (e) {
    console.error("[search] logging failed:", e);
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-10 md:px-8">
      <JsonLd id="search-results-schema" data={searchSchema} />
      <div className="section-shell mb-5 overflow-hidden rounded-[2rem] px-4 py-5 sm:mb-8 sm:px-10 sm:py-12">
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-primary text-[10px] font-black tracking-[0.24em] uppercase">
                {searchDict.heading || "Pretraga"}
              </p>
              <h1 className="text-foreground mt-2 text-[2rem] leading-[0.94] font-black tracking-[-0.07em] sm:text-5xl">
                {searchDict.results_for || "Rezultati pretrage za"}{" "}
                <span className="splash-gradient italic">“{query}”</span>
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
                {(searchDict.results_found || "Pronađeno {count} rezultata").replace(
                  "{count}",
                  String(totalResults),
                )}{" "}
                kroz objekte, blog i informativne stranice.
              </p>
            </div>
            <div className="surface-glass hidden min-w-[15rem] rounded-[1.35rem] p-4 md:block">
              <p className="text-muted-foreground text-[10px] font-black tracking-[0.14em] uppercase">
                {searchDict.quick_tip_eyebrow || "Brzi savet"}
              </p>
              <p className="mt-2 text-sm leading-relaxed font-medium">
                {searchDict.quick_tip_body ||
                  "Ako ne vidite željenu ponudu, pokušajte sa gradom, kategorijom ili imenom objekta."}
              </p>
            </div>
          </div>

          <SearchBox dict={dict} initialQuery={query} className="mb-3" autoFocus />

          <div className="mb-3 flex flex-wrap gap-2">
            <SearchStat
              label={searchDict.section_facilities || "Objekti"}
              count={facilities.length}
            />
            <SearchStat label={searchDict.section_blog || "Blog"} count={posts.length} />
            <SearchStat label={searchDict.section_pages || "Stranice"} count={pages.length} />
          </div>

          <div
            aria-label={searchDict.quick_rail_label || "Brze teme za pretragu"}
            className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {quickChips.map((chip) => (
              <Link
                key={chip}
                href={`/search?q=${encodeURIComponent(chip)}`}
                className="flex min-h-11 shrink-0 snap-start items-center rounded-full border border-white/70 bg-white/78 px-3.5 py-2.5 text-[10px] font-black tracking-[0.12em] uppercase shadow-sm active:scale-95"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {totalResults === 0 ? (
        <div className="public-panel px-6 py-16 text-center sm:px-10">
          <div className="bg-primary/10 text-primary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.2rem]">
            <Icon name="search_off" className="text-[24px]" />
          </div>
          <p className="text-lg font-black tracking-tight">
            {searchDict.no_results_for || "Nema rezultata za"}: {query}.
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {searchDict.try_other_keywords || "Pokušajte druge ključne reči."}
          </p>
          <p className="text-muted-foreground/80 mt-6 text-[10px] font-black tracking-[0.18em] uppercase">
            {searchDict.no_results_try_instead || "Ili probajte"}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {(searchDict.no_results_chips || ["Beograd", "Petroland", "Wellness", "Banje"]).map(
              (chip: string) => (
                <Link
                  key={chip}
                  href={`/search?q=${encodeURIComponent(chip)}`}
                  className="surface-subtle flex min-h-11 items-center rounded-full px-4 py-2 text-[10px] font-black tracking-[0.14em] uppercase active:scale-95"
                >
                  {chip}
                </Link>
              ),
            )}
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 min-[420px]:flex-row">
            <Link href="/akva-parkovi" className="block w-full min-[420px]:w-auto">
              <span className="bg-primary text-primary-foreground shadow-primary/25 flex min-h-12 w-full items-center justify-center rounded-full px-6 text-[11px] font-black tracking-[0.14em] uppercase shadow-lg min-[420px]:w-auto">
                {searchDict.browse_all_facilities || "Pregledaj sve akva parkove"}
              </span>
            </Link>
            <Link href="/" className="block w-full min-[420px]:w-auto">
              <span className="border-border text-foreground flex min-h-12 w-full items-center justify-center rounded-full border px-6 text-[11px] font-black tracking-[0.14em] uppercase min-[420px]:w-auto">
                {searchDict.back_to_home || "Nazad na početnu"}
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <SearchSection
            title={searchDict.section_facilities || "Objekti"}
            eyebrow={searchDict.section_facilities_eyebrow || "Destinacije"}
            items={facilities.map((facility) => ({
              id: facility.id,
              href: `/${facility.slug}`,
              title: facility.name,
              description: (
                searchDict.facility_result_description || "{city} • Direktan pristup ponudama"
              ).replace("{city}", facility.city),
              icon: "location_on",
            }))}
            grid
            dict={searchDict}
          />

          <SearchSection
            title={searchDict.section_blog || "Blog"}
            eyebrow={searchDict.section_blog_eyebrow || "Sadržaj"}
            items={posts.map((post) => ({
              id: post.id,
              href: `/blog/${post.slug}`,
              title: post.title,
              description: post.excerpt ? stripHtml(post.excerpt) : null,
              icon: "article",
            }))}
            dict={searchDict}
          />

          <SearchSection
            title={searchDict.section_pages || "Stranice"}
            eyebrow={searchDict.section_pages_eyebrow || "Informacije"}
            items={pages.map((page) => ({
              id: page.id,
              href: `/${page.slug}`,
              title: page.title,
              description: page.excerpt ? stripHtml(page.excerpt) : null,
              icon: "menu_book",
            }))}
            dict={searchDict}
          />
        </div>
      )}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ dict }: { dict: Record<string, any> }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] text-center sm:pt-24 sm:pb-24">
      <div className="bg-primary/10 text-primary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.2rem]">
        <Icon name="travel_explore" className="text-[24px]" />
      </div>
      <h1 className="text-foreground mb-3 text-3xl font-black tracking-[-0.05em]">
        {dict.search.heading || "Pretraga"}
      </h1>
      <p className="text-muted-foreground mx-auto max-w-xl leading-relaxed">
        {dict.search.min_chars ||
          "Unesite najmanje 2 karaktera da biste započeli pretragu objekata, blog postova i stranica."}
      </p>
      <SearchBox dict={dict} className="mx-auto mt-6 max-w-xl" autoFocus />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {(dict.search.empty_chips || ["Akva parkovi", "Petroland", "Vrnjačka Banja"]).map(
          (chip: string) => (
            <Link
              key={chip}
              href={`/search?q=${encodeURIComponent(chip)}`}
              className="surface-subtle flex min-h-11 items-center rounded-full px-4 py-2 text-[10px] font-black tracking-[0.14em] uppercase active:scale-95"
            >
              {chip}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

function SearchStat({ label, count }: { label: string; count: number }) {
  return (
    <div className="surface-subtle inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2">
      <span className="text-primary text-sm font-black">{count}</span>
      <span className="text-[10px] font-black tracking-[0.14em] uppercase">{label}</span>
    </div>
  );
}

function SearchSection({
  title,
  eyebrow,
  items,
  grid = false,
  dict,
}: {
  title: string;
  eyebrow: string;
  items: { id: string; href: string; title: string; description: string | null; icon: string }[];
  grid?: boolean;
  dict: Record<string, any>;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl leading-none font-black tracking-[-0.05em]">{title}</h2>
        </div>
        <span className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">
          {items.length} {dict.results_suffix || "rezultata"}
        </span>
      </div>
      <div className={grid ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="block">
            <Card className="surface-card hover:border-primary/30 active:bg-muted/40 rounded-[1.5rem] transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <span className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem]">
                  <Icon name={item.icon} className="text-[20px]" />
                </span>
                <div className="min-w-0">
                  <p className="text-muted-foreground mb-1 text-[10px] font-black tracking-[0.14em] uppercase">
                    {eyebrow}
                  </p>
                  <CardTitle className="text-base leading-tight font-black">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {item.description ? (
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {dict.open_result_description || "Otvorite rezultat za više detalja."}
                  </p>
                )}
                <div className="mt-3 inline-flex min-h-10 items-center rounded-full border border-slate-200/80 px-3 text-[10px] font-black tracking-[0.14em] uppercase">
                  {dict.open_result || "Otvori rezultat"}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}
