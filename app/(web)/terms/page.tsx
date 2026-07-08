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
    title: "Uslovi Korišćenja i Pravna Pravila",
    description:
      "Pročitajte zvanične uslove korišćenja platforme Splashdeals.rs. Saznajte više o pravima korisnika, načinu plaćanja i zaštiti kupaca karata.",
    alternates: { canonical: "https://www.splashdeals.rs/terms" },
    openGraph: {
      title: "Uslovi Korišćenja i Pravna Pravila",
      description:
        "Pročitajte zvanične uslove korišćenja platforme Splashdeals.rs. Saznajte više o pravima korisnika, načinu plaćanja i zaštiti kupaca karata.",
      images: ["/og-image.png"],
      locale: "sr_RS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Uslovi Korišćenja i Pravna Pravila",
      description:
        "Pročitajte zvanične uslove korišćenja platforme Splashdeals.rs. Saznajte više o pravima korisnika, načinu plaćanja i zaštiti kupaca karata.",
      images: ["/og-image.png"],
    },
  };
}

export default async function TermsPage({ params: _params }: PageProps) {
  const dict = await getDictionary();
  await connection();

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://www.splashdeals.rs/terms`,
    name: dict.terms.title,
    description: dict.terms.intro,
    isPartOf: {
      "@id": "https://www.splashdeals.rs/#website",
    },
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
      <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-16 sm:px-12 sm:pt-32 sm:pb-32">
        {/* 🏙️ HEADER */}
        <header className="mb-12 sm:mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border-primary/20 rounded-lg border p-2">
                <Icon name="description" className="text-primary text-[20px]" />
              </div>
              <span className="text-primary animate-pulse text-[10px] font-black tracking-[0.4em] uppercase">
                {dict.terms.eyebrow || "Pravni Okvir"}
              </span>
            </div>

            <h1 className="text-foreground text-5xl leading-[0.9] font-black tracking-tighter uppercase italic sm:text-7xl">
              {dict.terms.title}
            </h1>

            <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
              <span>{dict.terms.updated}</span>
              <div className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
              <span>SplashDeals.rs</span>
            </div>
          </div>
        </header>

        {/* 📜 CONTENT GRID */}
        <div className="space-y-12">
          <div className="text-foreground/80 text-lg leading-relaxed font-medium transition-opacity duration-500">
            {dict.terms.intro}
          </div>

          <div className="grid gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="transition-all duration-300">
                <Card className="border-border hover:border-primary/20 group p-8 transition-colors">
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
              </div>
            ))}
          </div>

          {/* 📧 CONTACT SECTION */}
          <div className="transition-all duration-500">
            <Card className="border-primary/20 bg-primary/5 p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <h3 className="text-foreground flex items-center gap-2 text-xl font-black tracking-tight uppercase italic">
                    <Icon name="mail" className="text-primary text-[20px]" />
                    {dict.terms.contact_title}
                  </h3>
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
          </div>
        </div>
      </div>
    </>
  );
}
