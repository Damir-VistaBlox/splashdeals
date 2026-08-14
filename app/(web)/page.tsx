import { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { JsonLd } from "@/components/SEO/JsonLd";
import {
  getHomeBiggestSavings,
  getHomeBlogPosts,
  getHomeFeaturedDeals,
  getHomeGateProof,
  getHomeMetrics,
  getHomeOpenToday,
} from "@/lib/home/deals";
import { HomeHero } from "./_components/HomeHero";
import { HomeIntentLanes } from "./_components/HomeIntentLanes";
import { HomeGatePriceProof } from "./_components/HomeGatePriceProof";
import { HomeBiggestSavings } from "./_components/HomeBiggestSavings";
import { HomeInventorySection } from "./_components/HomeInventorySection";
import { HomeHowSavingsWork } from "./_components/HomeHowSavingsWork";
import { HomeHowItWorks } from "./_components/HomeHowItWorks";
import { HomeTrustStrip } from "./_components/HomeTrustStrip";
import { HomeTicketEducation } from "./_components/HomeTicketEducation";
import { HomeOpenToday } from "./_components/HomeOpenToday";
import { HomeRegionChips } from "./_components/HomeRegionChips";
import { HomeFamilyMath } from "./_components/HomeFamilyMath";
import { HomeSocialProof } from "./_components/HomeSocialProof";
import { HomeFaq } from "./_components/HomeFaq";
import { HomeBlogStrip } from "./_components/HomeBlogStrip";
import { HomeB2bTeaser } from "./_components/HomeB2bTeaser";
import { HomeSeoAccordion } from "./_components/HomeSeoAccordion";
import { HomeExperienceStats } from "./_components/HomeExperienceStats";
import { absoluteUrl, pageMetadata, resolveSiteUrl } from "@/lib/seo";

interface PageProps {
  params: Promise<Record<string, never>>;
}

export const revalidate = 300;

const HOME_SERP_TITLE = "Ulaznice za akva parkove, bazene i spa centre | SplashDeals";
const HOME_SERP_DESCRIPTION =
  "Uporedite cene i kupite digitalne ulaznice za akva parkove, bazene, banje i wellness centre u Srbiji. Mobile-first kupovina, jasne cene i brza isporuka na SplashDeals.";

export async function generateMetadata({ params: _params }: PageProps): Promise<Metadata> {
  const site = resolveSiteUrl();

  return {
    ...pageMetadata("/"),
    title: { absolute: HOME_SERP_TITLE },
    description: HOME_SERP_DESCRIPTION,
    openGraph: {
      title: HOME_SERP_TITLE,
      description: HOME_SERP_DESCRIPTION,
      url: site,
      images: [absoluteUrl("/og-image.png", site)],
      type: "website",
      locale: "sr_RS",
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_SERP_TITLE,
      description: HOME_SERP_DESCRIPTION,
      images: [absoluteUrl("/og-image.png", site)],
    },
  };
}

/**
 * Homepage composition root — sections live in app/(web)/_components/Home*.
 * Mobile path (#667): Hero → Inventory → Savings → Gate → How → FAQ.
 * Secondary education/trust/growth blocks are `hidden md:block` inside their components.
 */
export default async function LandingPage({
  params: _params,
}: {
  params: Promise<Record<string, never>>;
}) {
  const dict = await getDictionary();
  const home = dict.home as Record<string, string>;
  const fallbackPitch = home.default_ticket_desc;

  const [featured, savings, gateDeal, openToday, metrics, posts] = await Promise.all([
    getHomeFeaturedDeals(fallbackPitch, 6),
    getHomeBiggestSavings(fallbackPitch, 4),
    getHomeGateProof(fallbackPitch),
    getHomeOpenToday(fallbackPitch, 6),
    getHomeMetrics(),
    getHomeBlogPosts(3),
  ]);

  const site = resolveSiteUrl();
  const categoryLinks = [
    { href: "/akva-parkovi", label: "Akva parkovi" },
    { href: "/bazeni", label: "Bazeni" },
    { href: "/banje", label: "Banje" },
    { href: "/wellness-i-spa", label: "Wellness i spa" },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        name: "SplashDeals",
        url: site,
        inLanguage: "sr-Latn-RS",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${site}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: "SplashDeals",
        url: site,
        logo: absoluteUrl("/logo-splashdeals.webp", site),
        description:
          "SplashDeals je marketplace za regularne ulaznice za vodene parkove, bazene, banje i wellness centre u Srbiji.",
        areaServed: {
          "@type": "Country",
          name: "RS",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+381-61-138-4512",
            contactType: "customer service",
            availableLanguage: ["Serbian"],
          },
          {
            "@type": "ContactPoint",
            email: "hq@splashdeals.rs",
            contactType: "customer service",
            availableLanguage: ["Serbian"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/splashdeals.rs/",
          "https://www.instagram.com/splashdeals",
          "https://x.com/splashdeals",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${site}/#webpage`,
        url: site,
        name: HOME_SERP_TITLE,
        description:
          "Digitalne ulaznice za vodene parkove, bazene, banje i wellness centre u Srbiji.",
        inLanguage: "sr-Latn-RS",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#organization` },
        breadcrumb: { "@id": `${site}/#breadcrumb` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl("/og-image.png", site),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${site}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Početna",
            item: site,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${site}/#popular-categories`,
        name: "Popularne kategorije ulaznica",
        itemListElement: categoryLinks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          url: absoluteUrl(item.href, site),
        })),
      },
    ],
  };

  return (
    <div className="text-foreground selection:bg-primary/30 relative min-h-screen overflow-x-hidden">
      <JsonLd id="website-schema" data={websiteSchema} />

      {/* Mobile conversion path first in DOM order */}
      <HomeHero dict={home} />
      <HomeInventorySection dict={home} deals={featured} />
      <HomeBiggestSavings dict={home} deals={savings} />
      <HomeGatePriceProof dict={home} deal={gateDeal} />
      <HomeHowItWorks dict={home} />
      <HomeFaq dict={home} />
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 md:px-8">
        <div className="public-panel rounded-[2rem] border-white/70 px-5 py-6 shadow-[0_22px_42px_rgba(15,23,42,0.06)] sm:px-8">
          <p className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
            Mobilna kupovina
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-950 sm:text-3xl">
            Brže pronađite ulaznice po kategoriji i gradu
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">
            SplashDeals okuplja akva parkove, bazene, banje i wellness centre sa jasnim cenama,
            digitalnom isporukom i ponudama koje se lako otvaraju na telefonu.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {categoryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="surface-subtle inline-flex min-h-11 items-center rounded-full border border-white/70 px-4 py-2 text-[10px] font-black tracking-[0.14em] uppercase shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop-expanded story (components self-hide on mobile) */}
      <HomeIntentLanes dict={home} />
      <HomeHowSavingsWork dict={home} />
      <HomeTicketEducation dict={home} />
      <HomeTrustStrip dict={home} />
      <HomeOpenToday dict={home} deals={openToday} />
      <HomeRegionChips dict={home} />
      <HomeFamilyMath dict={home} adultDeal={gateDeal} />
      <HomeExperienceStats dict={home} metrics={metrics} />
      <HomeSocialProof dict={home} />
      <HomeBlogStrip dict={home} posts={posts} />
      <HomeB2bTeaser dict={home} />
      <HomeSeoAccordion dict={home} />
    </div>
  );
}
