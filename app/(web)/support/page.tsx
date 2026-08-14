import { Button } from "@/components/ui/button";
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
    path: "/support",
    title: "Korisnička podrška za kupovinu ulaznica",
    description:
      "Treba vam pomoć oko digitalnih ulaznica, plaćanja ili isporuke? Otvorite Splashdeals centar za podršku i pronađite brze odgovore prilagođene mobilnoj kupovini.",
    keywords: [
      "podrška za ulaznice",
      "kontakt Splashdeals",
      "pomoć pri kupovini ulaznica",
      "digitalne ulaznice podrška",
    ],
  });
}

export default async function SupportPage({ params: _params }: PageProps) {
  const dict = await getDictionary();
  await connection();
  const site = resolveSiteUrl();
  const supportEmail = "support@splashdeals.rs";
  const supportUrl = canonicalUrl("/support", site);
  const relatedPages = [
    { href: "/how-it-works", label: "Kako funkcioniše kupovina" },
    { href: "/terms", label: "Uslovi kupovine" },
    { href: "/privacy", label: "Zaštita podataka" },
  ];

  const faqs = [
    { q: dict.support.faq_1_q, a: dict.support.faq_1_a },
    { q: dict.support.faq_2_q, a: dict.support.faq_2_a },
    { q: dict.support.faq_3_q, a: dict.support.faq_3_a },
  ];

  return (
    <section
      id="support-content"
      aria-labelledby="support-title"
      className="mx-auto min-h-screen max-w-5xl px-3 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-24 md:px-8"
    >
      <JsonLd
        id="support-schema"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": `${supportUrl}#contact`,
              url: supportUrl,
              name: "Centar za podršku | Splashdeals",
              description:
                "Kontakt i odgovori za digitalne ulaznice, mobilnu kupovinu i isporuku na Splashdeals platformi.",
              isPartOf: { "@id": `${site}/#website` },
              breadcrumb: { "@id": `${supportUrl}#breadcrumb` },
            },
            {
              "@type": "FAQPage",
              "@id": `${supportUrl}#faq`,
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            },
            buildBreadcrumbSchema(
              [
                { name: "Početna", path: "/" },
                { name: "Podrška", path: "/support" },
              ],
              "/support",
            ),
          ],
        }}
      />
      <header className="section-shell mb-10 overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/72 p-2 shadow-sm">
              <Icon name="support" className="text-primary text-[20px]" />
            </div>
            <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">
              {dict.support.eyebrow || "Centar za Podršku"}
            </span>
          </div>

          <h1
            id="support-title"
            className="text-foreground text-4xl leading-[0.9] font-black tracking-[-0.08em] uppercase italic sm:text-6xl"
          >
            {dict.support.title}
          </h1>

          <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
            <Icon name="schedule" className="text-[12px]" />
            <span>{dict.support.updated}</span>
            <div className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
            <span>{dict.support.squad || "SplashDeals Tim"}</span>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        <section
          aria-labelledby="support-intro-title"
          className="public-panel rounded-[1.75rem] px-6 py-6 text-lg leading-relaxed font-medium text-slate-700"
        >
          <h2 id="support-intro-title" className="sr-only">
            Uvod
          </h2>
          {dict.support.intro}
        </section>

        <section aria-labelledby="support-faq-title" className="space-y-8">
          <h2
            id="support-faq-title"
            className="text-foreground flex items-center gap-3 text-2xl font-black tracking-tight uppercase italic"
          >
            <Icon name="help" className="text-primary text-[24px]" />
            {dict.support.faq_title}
          </h2>

          <div className="grid gap-6">
            {faqs.map((faq, idx) => (
              <article key={idx} className="transition-all duration-300">
                <Card className="surface-card group hover:border-primary/20 rounded-[1.75rem] p-6 transition-colors">
                  <h3 className="text-foreground mb-3 flex items-center gap-3 text-lg font-bold">
                    <Icon
                      name="keyboard_arrow_right"
                      className="text-primary text-[16px] transition-transform group-hover:translate-x-1"
                    />
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {faq.a}
                  </p>
                </Card>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="support-contact-title" className="transition-all duration-500">
          <Card className="animated-border rounded-[1.75rem] border border-white/70 bg-white/60 p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <h2
                  id="support-contact-title"
                  className="text-foreground flex items-center gap-2 text-xl font-black tracking-tight uppercase italic"
                >
                  <Icon name="mail" className="text-primary text-[20px]" />
                  {dict.support.contact_title}
                </h2>
                <p
                  className="text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: dict.support.contact_content }}
                />
              </div>

              <Button
                asChild
                variant="outline"
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black tracking-widest uppercase transition-colors"
              >
                <a
                  href={`mailto:${supportEmail}`}
                  aria-label={`${dict.support.contact_btn || "Kontaktirajte Nas"}: ${supportEmail}`}
                >
                  {dict.support.contact_btn || "Kontaktirajte Nas"}
                </a>
              </Button>
            </div>
          </Card>
        </section>

        <section aria-labelledby="support-links-title" className="space-y-4">
          <h2
            id="support-links-title"
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
  );
}
