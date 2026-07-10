import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { connection } from "next/server";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/SEO/JsonLd";

interface PageProps {
  params: Promise<Record<string, never>>;
}

export async function generateMetadata({ params: _params }: PageProps): Promise<Metadata> {
  return {
    title: "Centar za Podršku i Pomoć Korisnicima",
    description:
      "Imate pitanje o digitalnim kartama ili plaćanju? Naš tim za korisničku podršku je dostupan 24/7. Pronađite brze odgovore i rešite problem odmah.",
    alternates: { canonical: "https://www.splashdeals.rs/support" },
    openGraph: {
      title: "Centar za Podršku i Pomoć Korisnicima",
      description:
        "Imate pitanje o digitalnim kartama ili plaćanju? Naš tim za korisničku podršku je dostupan 24/7. Pronađite brze odgovore i rešite problem odmah.",
      images: ["/og-image.png"],
      locale: "sr_RS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Centar za Podršku i Pomoć Korisnicima",
      description:
        "Imate pitanje o digitalnim kartama ili plaćanju? Naš tim za korisničku podršku je dostupan 24/7. Pronađite brze odgovore i rešite problem odmah.",
      images: ["/og-image.png"],
    },
  };
}

export default async function SupportPage({ params: _params }: PageProps) {
  const dict = await getDictionary();
  await connection();

  const faqs = [
    { q: dict.support.faq_1_q, a: dict.support.faq_1_a },
    { q: dict.support.faq_2_q, a: dict.support.faq_2_a },
    { q: dict.support.faq_3_q, a: dict.support.faq_3_a },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-16 sm:px-12 sm:pt-32 sm:pb-32">
      <JsonLd
        id="support-schema"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": "https://www.splashdeals.rs/support#contact",
              name: "Centar za Podršku | Splashdeals",
              description: "24/7 korisnička podrška za Splashdeals.",
            },
            {
              "@type": "FAQPage",
              "@id": "https://www.splashdeals.rs/support#faq",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            },
          ],
        }}
      />
      {/* 🏙️ HEADER */}
      <header className="mb-12 sm:mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border-primary/20 rounded-lg border p-2">
              <Icon name="support" className="text-primary text-[20px]" />
            </div>
            <span className="text-primary animate-pulse text-[10px] font-black tracking-[0.4em] uppercase">
              {dict.support.eyebrow || "Centar za Podršku"}
            </span>
          </div>

          <h1 className="text-foreground text-5xl leading-[0.9] font-black tracking-tighter uppercase italic sm:text-7xl">
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

      {/* 📜 CONTENT GRID */}
      <div className="space-y-12">
        <div className="text-foreground/80 text-lg leading-relaxed font-medium transition-opacity duration-500">
          {dict.support.intro}
        </div>

        <section className="space-y-8">
          <h2 className="text-foreground flex items-center gap-3 text-2xl font-black tracking-tight uppercase italic">
            <Icon name="help" className="text-primary text-[24px]" />
            {dict.support.faq_title}
          </h2>

          <div className="grid gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="transition-all duration-300">
                <Card className="border-border hover:border-primary/20 group p-6 transition-colors">
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
              </div>
            ))}
          </div>
        </section>

        {/* 📧 CONTACT SECTION */}
        <div className="transition-all duration-500">
          <Card className="border-primary/20 bg-primary/5 p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <h3 className="text-foreground flex items-center gap-2 text-xl font-black tracking-tight uppercase italic">
                  <Icon name="mail" className="text-primary text-[20px]" />
                  {dict.support.contact_title}
                </h3>
                <p
                  className="text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: dict.support.contact_content }}
                />
              </div>

              <Button
                variant="outline"
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black tracking-widest uppercase transition-colors"
                aria-label={dict.support.contact_btn || "Kontaktirajte Nas"}
              >
                {dict.support.contact_btn || "Kontaktirajte Nas"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
