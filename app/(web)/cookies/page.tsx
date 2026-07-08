import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { connection } from "next/server";
import { JsonLd } from "@/components/SEO/JsonLd";

interface PageProps {
  params: Promise<Record<string, never>>;
}

export async function generateMetadata({}: PageProps): Promise<Metadata> {
  return {
    title: "Politika Kolačića i Upravljanje Podacima",
    description:
      "Saznajte kako Splashdeals.rs koristi kolačiće za optimalan rad korpe i personalizaciju pretrage, i kako možete sami upravljati njima u pretraživaču.",
    alternates: { canonical: "https://www.splashdeals.rs/cookies" },
    openGraph: {
      title: "Politika Kolačića i Upravljanje Podacima",
      description:
        "Saznajte kako Splashdeals.rs koristi kolačiće za optimalan rad korpe i personalizaciju pretrage, i kako možete sami upravljati njima u pretraživaču.",
      images: ["/og-image.png"],
      locale: "sr_RS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Politika Kolačića i Upravljanje Podacima",
      description:
        "Saznajte kako Splashdeals.rs koristi kolačiće za optimalan rad korpe i personalizaciju pretrage, i kako možete sami upravljati njima u pretraživaču.",
      images: ["/og-image.png"],
    },
  };
}

export default async function CookiesPage({}: PageProps) {
  const dict = await getDictionary();
  await connection();

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://www.splashdeals.rs/cookies`,
    name: dict.cookies.title,
    description: dict.cookies.intro,
    isPartOf: {
      "@id": "https://www.splashdeals.rs/#website",
    },
  };

  const sections = [
    { title: dict.cookies.section1_title, content: dict.cookies.section1_content },
    { title: dict.cookies.section2_title, content: dict.cookies.section2_content },
    { title: dict.cookies.section3_title, content: dict.cookies.section3_content },
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
                <Icon name="cookie" className="text-primary text-[20px]" />
              </div>
              <span className="text-primary animate-pulse text-[10px] font-black tracking-[0.4em] uppercase">
                Privacy Control
              </span>
            </div>

            <h1 className="text-foreground text-5xl leading-[0.9] font-black tracking-tighter uppercase italic sm:text-7xl">
              {dict.cookies.title}
            </h1>

            <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
              <span>{dict.cookies.updated}</span>
              <div className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
              <span>SplashDeals.rs</span>
            </div>
          </div>
        </header>

        {/* 📜 CONTENT GRID */}
        <div className="space-y-12">
          <div className="text-lg leading-relaxed font-medium text-slate-300 transition-opacity duration-500">
            {dict.cookies.intro}
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
                    {dict.cookies.contact_title}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm"
                    dangerouslySetInnerHTML={{ __html: dict.cookies.contact_content }}
                  />
                </div>

                <div className="bg-primary/10 border-primary/20 text-primary flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black tracking-widest uppercase">
                  <Icon name="security" className="text-[12px]" />
                  Data Protection Officer
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
