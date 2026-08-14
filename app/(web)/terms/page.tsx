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
    path: "/terms",
    title: "Uslovi kupovine i korišćenja platforme",
    description:
      "Pročitajte pravila kupovine, korišćenja i zaštite kupaca na Splashdeals platformi pre poručivanja digitalnih ulaznica sa telefona.",
    keywords: [
      "uslovi kupovine ulaznica",
      "uslovi korišćenja Splashdeals",
      "pravila kupovine karata",
      "zaštita kupaca ulaznica",
    ],
  });
}

export default async function TermsPage({ params: _params }: PageProps) {
  const dict = await getDictionary();
  await connection();
  const site = resolveSiteUrl();
  const termsUrl = canonicalUrl("/terms", site);
  const relatedPages = [
    { href: "/support", label: "Korisnička podrška" },
    { href: "/privacy", label: "Politika privatnosti" },
    { href: "/how-it-works", label: "Kako funkcioniše kupovina" },
  ];

  const webpageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": termsUrl,
        url: termsUrl,
        name: dict.terms.title,
        description: dict.terms.intro,
        isPartOf: {
          "@id": `${site}/#website`,
        },
        breadcrumb: {
          "@id": `${termsUrl}#breadcrumb`,
        },
      },
      buildBreadcrumbSchema(
        [
          { name: "Početna", path: "/" },
          { name: "Uslovi korišćenja", path: "/terms" },
        ],
        "/terms",
      ),
    ],
  };

  const sections = [
    { title: dict.terms.section1_title, content: dict.terms.section1_content },
    { title: dict.terms.section2_title, content: dict.terms.section2_content },
    { title: dict.terms.section3_title, content: dict.terms.section3_content },
    { title: dict.terms.section4_title, content: dict.terms.section4_content },
    { title: dict.terms.section5_title, content: dict.terms.section5_content },
    { title: dict.terms.section6_title, content: dict.terms.section6_content },
    { title: dict.terms.section7_title, content: dict.terms.section7_content },
  ];

  return (
    <>
      <JsonLd data={webpageSchema} id="webpage-schema" />
      <section
        id="terms-content"
        aria-labelledby="terms-title"
        className="mx-auto min-h-screen max-w-5xl px-3 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-24 md:px-8"
      >
        <header className="section-shell mb-10 overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/72 p-2 shadow-sm">
                <Icon name="description" className="text-primary text-[20px]" />
              </div>
              <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">
                {dict.terms.eyebrow || "Pravni Okvir"}
              </span>
            </div>

            <h1
              id="terms-title"
              className="text-foreground text-4xl leading-[0.9] font-black tracking-[-0.08em] uppercase italic sm:text-6xl"
            >
              {dict.terms.title}
            </h1>

            <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
              <span>{dict.terms.updated}</span>
              <div className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
              <span>SplashDeals.rs</span>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          <section
            aria-labelledby="terms-intro-title"
            className="public-panel rounded-[1.75rem] px-6 py-6 text-lg leading-relaxed font-medium text-slate-700"
          >
            <h2 id="terms-intro-title" className="sr-only">
              Uvod
            </h2>
            {dict.terms.intro}
          </section>

          <section aria-labelledby="terms-sections-title" className="grid gap-8">
            <h2 id="terms-sections-title" className="sr-only">
              Sekcije uslova korišćenja
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
                  <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line sm:text-base">
                    {section.content}
                  </div>
                </Card>
              </article>
            ))}
          </section>

          <section aria-labelledby="terms-contact-title" className="transition-all duration-500">
            <Card className="animated-border rounded-[1.75rem] border border-white/70 bg-white/60 p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <h2
                    id="terms-contact-title"
                    className="text-foreground flex items-center gap-2 text-xl font-black tracking-tight uppercase italic"
                  >
                    <Icon name="mail" className="text-primary text-[20px]" />
                    {dict.terms.contact_title}
                  </h2>
                  <p
                    className="text-muted-foreground text-sm"
                    dangerouslySetInnerHTML={{ __html: dict.terms.contact_content }}
                  />
                </div>

                <div className="bg-primary/10 border-primary/20 text-primary flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black tracking-widest uppercase">
                  <Icon name="security" className="text-[12px]" />
                  {dict.terms.legal_badge || "Verifikovani Pravni Protokol"}
                </div>
              </div>
            </Card>
          </section>

          <section aria-labelledby="terms-links-title" className="space-y-4">
            <h2
              id="terms-links-title"
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
