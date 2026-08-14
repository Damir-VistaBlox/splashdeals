import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import Image from "next/image";
import type { Dict } from "@/lib/types";
import { FooterNewsletterForm } from "@/components/layout/FooterNewsletterForm";

const SOCIAL_LINKS = [
  {
    labelKey: "instagram_aria",
    fallback: "Pratite nas na Instagramu",
    href: "https://www.instagram.com/splashdeals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    labelKey: "facebook_aria",
    fallback: "Pratite nas na Facebooku",
    href: "https://www.facebook.com/splashdeals.rs/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    labelKey: "twitter_aria",
    fallback: "Pratite nas na X (Twitter)",
    href: "https://x.com/splashdeals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
];

const QUICK_ACCESS_FALLBACKS = [
  { name: "Početna", href: "/" },
  { name: "Istraži", href: "/akva-parkovi" },
  { name: "Kako Funkcioniše", href: "/how-it-works" },
  { name: "Centar za Podršku", href: "/support" },
];

const LEGAL_FALLBACKS = [
  { name: "Uslovi Usluge", href: "/terms" },
  { name: "Privatnost", href: "/privacy" },
  { name: "Politika Kolačića", href: "/cookies" },
  { name: "Centar za Pomoć", href: "/support" },
];

export function Footer({ dict: dictProp }: { dict?: Dict | null } = {}) {
  const dict = dictProp;
  const footerLabel = (key: string, fallback: string) => {
    const footer = dict?.footer as Record<string, string> | undefined;
    return footer?.[key] || fallback;
  };
  const quickAccessItems = [
    {
      name: dict?.nav?.home || QUICK_ACCESS_FALLBACKS[0].name,
      href: QUICK_ACCESS_FALLBACKS[0].href,
    },
    {
      name: dict?.nav?.explore || dict?.nav?.waterparks || QUICK_ACCESS_FALLBACKS[1].name,
      href: QUICK_ACCESS_FALLBACKS[1].href,
    },
    {
      name: dict?.footer?.how_it_works || QUICK_ACCESS_FALLBACKS[2].name,
      href: QUICK_ACCESS_FALLBACKS[2].href,
    },
    {
      name: dict?.footer?.support_center || QUICK_ACCESS_FALLBACKS[3].name,
      href: QUICK_ACCESS_FALLBACKS[3].href,
    },
  ];
  const legalItems = [
    { name: dict?.footer?.terms || LEGAL_FALLBACKS[0].name, href: LEGAL_FALLBACKS[0].href },
    { name: dict?.footer?.privacy || LEGAL_FALLBACKS[1].name, href: LEGAL_FALLBACKS[1].href },
    { name: dict?.footer?.cookie_policy || LEGAL_FALLBACKS[2].name, href: LEGAL_FALLBACKS[2].href },
    { name: dict?.footer?.help_center || LEGAL_FALLBACKS[3].name, href: LEGAL_FALLBACKS[3].href },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden px-3 pt-5 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pt-16 md:px-8 md:pb-12">
      <div className="surface-glass relative mx-auto max-w-md overflow-hidden rounded-[1.75rem] px-4 py-4 md:hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              aria-label={dict?.brand?.logo_aria ?? "Splashdeals početna"}
              className="rounded-full bg-white/82 px-3 py-2 shadow-sm"
            >
              <Image
                src="/logo-splashdeals.webp"
                alt={
                  dict?.brand?.logo_alt ??
                  "SplashDeals - digitalne ulaznice za vodene parkove Srbija"
                }
                width={180}
                height={60}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <span className="rounded-full border border-sky-200/80 bg-white/75 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-sky-700 uppercase">
              Digitalne karte
            </span>
          </div>

          <p className="text-muted-foreground text-[12px] leading-5 font-medium">
            {dict?.footer?.desc ||
              "Digitalne ulaznice za akva parkove u Srbiji, bez čekanja i bez traženja karata po inboxu."}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {quickAccessItems.slice(0, 4).map((item) => (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className="surface-subtle text-foreground flex min-h-11 items-center rounded-2xl px-3 text-[10px] font-black tracking-[0.08em] uppercase transition-colors hover:bg-white/58 active:scale-[0.98]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="surface-subtle flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-slate-500 uppercase">
                Kontakt
              </p>
              <span
                className="text-sm font-bold text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: "<!--email_off-->hq@splashdeals.rs<!--/email_off-->",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.slice(0, 2).map((item) => (
                <Link
                  key={`mobile-social-${item.href}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-subtle text-muted-foreground flex h-11 w-11 items-center justify-center rounded-2xl transition-colors active:scale-[0.96]"
                  aria-label={footerLabel(item.labelKey, item.fallback)}
                >
                  <div className="h-4.5 w-4.5">{item.icon}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="animated-border rounded-2xl border border-white/65 bg-white/58 p-4">
            <h3 className="mb-1.5 text-[10px] font-black tracking-[0.22em] text-slate-600 uppercase">
              {dict?.footer?.summer_alerts || "Letnja Obaveštenja"}
            </h3>
            <p className="text-muted-foreground mb-3 text-xs leading-relaxed font-medium">
              {dict?.footer?.summer_alerts_desc ||
                "Prijavite se za najnovije akcije i ekskluzivne letnje ponude akva parkova."}
            </p>
            <FooterNewsletterForm dict={dict ?? null} idSuffix="mobile" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {legalItems.slice(0, 2).map((item) => (
                <Link
                  key={`mobile-legal-${item.href}`}
                  href={item.href}
                  className="surface-chip text-muted-foreground inline-flex min-h-11 items-center rounded-full px-3.5 text-[10px] font-black tracking-[0.12em] uppercase transition-colors hover:bg-white/56 hover:text-slate-700 active:scale-[0.98]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Link
              href="/support"
              className="text-primary inline-flex min-h-11 items-center px-2 text-[10px] font-black tracking-[0.14em] uppercase"
            >
              Podrška
            </Link>
          </div>

          <p className="text-muted-foreground text-center text-[10px] font-bold tracking-[0.14em] uppercase">
            {dict?.footer?.copyright ||
              `© ${new Date().getFullYear()} Splashdeals Marketplace. Sva prava zadržana.`}
          </p>
        </div>
      </div>

      <div className="public-panel relative mx-auto hidden max-w-7xl overflow-hidden rounded-[2rem] px-6 py-10 sm:px-8 sm:py-12 md:block">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
        <div className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-sky-200/35 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-12 left-8 h-40 w-40 rounded-full bg-amber-200/35 blur-[80px]" />

        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                aria-label={dict?.brand?.logo_aria ?? "Splashdeals početna"}
                className="rounded-full bg-white/78 px-4 py-2 shadow-sm"
              >
                <Image
                  src="/logo-splashdeals.webp"
                  alt={
                    dict?.brand?.logo_alt ??
                    "SplashDeals - digitalne ulaznice za vodene parkove Srbija"
                  }
                  width={220}
                  height={74}
                  className="h-10 w-auto object-contain sm:h-12"
                />
              </Link>
              <span className="rounded-full border border-sky-200/80 bg-white/75 px-3 py-1 text-[10px] font-black tracking-[0.22em] text-sky-700 uppercase">
                Leto 2026
              </span>
            </div>

            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-medium">
              {dict?.footer?.desc ||
                "Vodeca destinacija u Srbiji za digitalne ulaznice za akva parkove i sezonske propusnice. Preskocite cekanje i uzivajte u letu."}
            </p>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-muted-foreground hover:text-primary hover:border-primary/30 flex h-11 w-11 items-center justify-center rounded-2xl border bg-white/60 transition-colors duration-300"
                  aria-label={footerLabel(item.labelKey, item.fallback)}
                >
                  <div className="h-5 w-5">{item.icon}</div>
                </Link>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/60 bg-white/55 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                    <Icon name="mail" className="text-[16px]" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.18em] text-slate-500 uppercase">
                    Kontakt
                  </span>
                </div>
                <span
                  className="text-sm font-bold text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: "<!--email_off-->hq@splashdeals.rs<!--/email_off-->",
                  }}
                />
              </div>

              <div className="rounded-2xl border border-white/60 bg-white/55 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <Icon name="location_on" className="text-[16px]" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.18em] text-slate-500 uppercase">
                    Lokacija
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {dict?.footer?.location_text || "Beograd Technology Park, SRB"}
                </span>
              </div>
            </div>
          </div>

          <FooterColumn
            title={dict?.footer?.quick_access || "Brzi Pristup"}
            items={quickAccessItems}
          />

          <FooterColumn
            title={dict?.footer?.support_legal || "Podrška i Pravne Informacije"}
            items={legalItems}
          />

          <div className="space-y-6">
            <div className="animated-border rounded-[1.75rem] border border-white/65 bg-white/58 p-6">
              <h3 className="mb-3 text-xs font-black tracking-[0.28em] text-slate-600 uppercase">
                {dict?.footer?.summer_alerts || "Letnja Obaveštenja"}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {dict?.footer?.summer_alerts_desc ||
                  "Prijavite se za najnovije akcije i ekskluzivne letnje ponude akva parkova."}
              </p>
              <FooterNewsletterForm dict={dict ?? null} />
            </div>

            <div className="rounded-[1.5rem] border border-white/65 bg-white/55 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary h-2.5 w-2.5 rounded-full shadow-[0_0_12px_rgba(14,165,198,0.55)]" />
                <span className="text-[10px] font-black tracking-[0.24em] text-slate-600 uppercase">
                  {dict?.footer?.marketplace_online || "Marketplace na Mreži"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusChip>
                  {dict?.footer?.security_first || "Sigurnost na Prvom Mestu"}
                </StatusChip>
                <StatusChip>{dict?.footer?.instant_delivery || "Trenutna Isporuka"}</StatusChip>
                <StatusChip>
                  {dict?.footer?.best_parks_badge || "Najbolji Akva Parkovi u Srbiji"}
                </StatusChip>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/70 relative z-10 mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-muted-foreground text-xs font-bold tracking-wide">
              {dict?.footer?.copyright ||
                `© ${new Date().getFullYear()} Splashdeals Marketplace. Sva prava zadržana.`}
            </p>
            <p className="text-muted-foreground mt-1 text-[11px] font-bold tracking-[0.16em] uppercase">
              {dict?.footer?.built_for || "Napravljeno za brzu i laku rezervaciju"} • v2.4.0-letnji
            </p>
          </div>
          <p className="text-muted-foreground text-center text-[11px] font-bold tracking-[0.16em] uppercase sm:text-right">
            {dict?.footer?.made_for || "Digitalne regularne ulaznice za leto bez čekanja"}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{ name: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-black tracking-[0.28em] text-slate-600 uppercase">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={`${item.href}-${item.name}`}>
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-primary group inline-flex items-center py-2.5 text-sm font-bold transition-colors"
            >
              <Icon
                name="arrow_forward"
                className="mr-2 -ml-5 text-[12px] opacity-0 transition-[margin,opacity] group-hover:ml-0 group-hover:opacity-100"
              />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/70 bg-white/74 px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-slate-600 uppercase">
      {children}
    </span>
  );
}
