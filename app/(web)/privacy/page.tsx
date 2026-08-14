import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { connection } from "next/server";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/SEO/JsonLd";
import Link from "next/link";
import {
  buildBreadcrumbSchema,
  buildStaticPageMetadata,
  canonicalUrl,
  resolveSiteUrl,
} from "@/lib/seo";

interface PageProps {
  params: Promise<Record<string, never>>;
}

export async function generateMetadata({ params: _params }: PageProps): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: "/privacy",
    title: "Politika privatnosti i obrada ličnih podataka",
    description:
      "Saznajte kako Splashdeals prikuplja, koristi i štiti lične podatke tokom registracije, kupovine digitalnih ulaznica i korisničke podrške.",
    keywords: [
      "politika privatnosti Splashdeals",
      "zaštita podataka kupaca",
      "obrada ličnih podataka",
      "privatnost digitalne ulaznice",
    ],
  });
}

export default async function PrivacyPage({ params: _params }: PageProps) {
  const dict = await getDictionary();
  await connection();
  const site = resolveSiteUrl();
  const privacyUrl = canonicalUrl("/privacy", site);
  const relatedPages = [
    { href: "/support", label: "Korisnička podrška" },
    { href: "/terms", label: "Uslovi kupovine" },
    { href: "/cookies", label: "Politika kolačića" },
  ];

  const webpageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": privacyUrl,
        url: privacyUrl,
        name: dict.privacy.title,
        description: dict.privacy.intro,
        isPartOf: {
          "@id": `${site}/#website`,
        },
        breadcrumb: {
          "@id": `${privacyUrl}#breadcrumb`,
        },
      },
      buildBreadcrumbSchema(
        [
          { name: "Početna", path: "/" },
          { name: "Politika privatnosti", path: "/privacy" },
        ],
        "/privacy",
      ),
    ],
  };

  const sections = [
    { title: dict.privacy.section1_title, content: dict.privacy.section1_content },
    { title: dict.privacy.section2_title, content: dict.privacy.section2_content },
    { title: dict.privacy.section3_title, content: dict.privacy.section3_content },
    { title: dict.privacy.section4_title, content: dict.privacy.section4_content },
    { title: dict.privacy.section5_title, content: dict.privacy.section5_content },
    { title: dict.privacy.section6_title, content: dict.privacy.section6_content },
    { title: dict.privacy.section7_title, content: dict.privacy.section7_content },
    { title: dict.privacy.section8_title, content: dict.privacy.section8_content },
  ];
  const privacyEyebrow = dict.privacy.eyebrow || "Zaštita podataka";
  const privacyTrustTitle = dict.privacy.trust_title || "Transparentnost i bezbednost";
  const privacyTrustBody =
    dict.privacy.trust_body ||
    "Prikupljamo samo podatke neophodne za kupovinu i isporuku karata, uz mere zaštite prilagođene obradi ličnih podataka.";
  const privacyTrustBadge = dict.privacy.trust_badge || "Zaštićena obrada podataka";

  return (
    <>
      <JsonLd data={webpageSchema} id="webpage-schema" />
      <section
        id="privacy-content"
        aria-labelledby="privacy-title"
        className="mx-auto min-h-screen max-w-5xl px-3 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-24 md:px-8"
      >
        <header className="section-shell mb-10 overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/72 p-2 shadow-sm">
                <Icon name="lock" className="text-primary text-[20px]" />
              </div>
              <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">
                {privacyEyebrow}
              </span>
            </div>

            <h1
              id="privacy-title"
              className="text-foreground text-4xl leading-[0.9] font-black tracking-[-0.08em] uppercase italic sm:text-6xl"
            >
              {dict.privacy.title}
            </h1>

            <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
              <span>{dict.privacy.updated}</span>
              <div className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
              <span>SplashDeals.rs</span>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          <section
            aria-labelledby="privacy-intro-title"
            className="public-panel rounded-[1.75rem] px-6 py-6 text-lg leading-relaxed font-medium text-slate-700"
          >
            <h2 id="privacy-intro-title" className="sr-only">
              Uvod
            </h2>
            {dict.privacy.intro}
          </section>

          <section aria-labelledby="privacy-sections-title" className="grid gap-8">
            <h2 id="privacy-sections-title" className="sr-only">
              Sekcije politike privatnosti
            </h2>
            {sections.map((section, idx) => (
              <article key={idx} className="transition-all duration-300">
                <Card className="surface-card group hover:border-primary/20 rounded-[1.75rem] p-8 transition-colors">
                  <h2 className="text-foreground mb-6 flex items-center gap-3 text-xl font-black tracking-tight uppercase italic">
                    <Icon
                      name="keyboard_arrow_right"
                      className="text-primary text-[20px] transition-transform group-hover:translate-x-1"
                    />
                    {section.title}
                  </h2>
                  <div
                    className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line sm:text-base"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </Card>
              </article>
            ))}
          </section>

          <section aria-labelledby="privacy-trust-title" className="transition-all duration-500">
            <Card className="animated-border rounded-[1.75rem] border border-white/70 bg-white/60 p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <h2
                    id="privacy-trust-title"
                    className="text-foreground flex items-center gap-2 text-xl font-black tracking-tight uppercase italic"
                  >
                    <Icon name="visibility" className="text-primary text-[20px]" />
                    {privacyTrustTitle}
                  </h2>
                  <p className="text-muted-foreground text-sm">{privacyTrustBody}</p>
                </div>

                <div className="bg-primary/10 border-primary/20 text-primary flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black tracking-widest uppercase">
                  <Icon name="security" className="text-[12px]" />
                  {privacyTrustBadge}
                </div>
              </div>
            </Card>
          </section>

          <section aria-labelledby="privacy-links-title" className="space-y-4">
            <h2
              id="privacy-links-title"
              className="text-foreground text-lg font-black tracking-tight uppercase italic"
            >
              Povezane strane
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-300 hover:bg-white"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
