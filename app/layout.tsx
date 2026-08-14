import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BRAND_NAME, alternates, publicRobots, resolveSiteUrl } from "@/lib/seo";

const appSans = localFont({
  variable: "--font-app-sans",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Safe-area for notched phones (BottomNav / fixed chrome)
  viewportFit: "cover",
  // WCAG 1.4.4 — allow pinch-zoom; never lock maximumScale / userScalable
};

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteUrl()),
  title: {
    template: `%s | ${BRAND_NAME}`,
    default: "Digitalne ulaznice za akva parkove, bazene i spa centre u Srbiji",
  },
  description:
    "Uporedite cene i kupite digitalne ulaznice za akva parkove, bazene, banje i wellness centre u Srbiji. Mobile-first kupovina, jasne cene i brza isporuka na telefonu.",
  applicationName: BRAND_NAME,
  keywords: [
    "digitalne ulaznice",
    "akva parkovi Srbija",
    "bazeni Srbija",
    "banje Srbija",
    "wellness spa Srbija",
    "ulaznice online",
  ],
  alternates: {
    canonical: resolveSiteUrl(),
    languages: alternates("/"),
  },
  robots: publicRobots(),
  openGraph: {
    title: "Digitalne ulaznice za akva parkove, bazene i spa centre u Srbiji",
    description:
      "Kupovina ulaznica prilagođena telefonu: jasne cene, provereni objekti i brza digitalna isporuka za vodene i wellness destinacije u Srbiji.",
    url: resolveSiteUrl(),
    images: ["/og-image.png"],
    type: "website",
    siteName: BRAND_NAME,
    locale: "sr_RS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitalne ulaznice za akva parkove, bazene i spa centre u Srbiji",
    description:
      "Uporedite cene i kupite ulaznice za akva parkove, bazene, banje i wellness centre u Srbiji uz mobile-first kupovinu.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/logo.png", color: "#06b6d4" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND_NAME,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr-Latn-RS"
      className="light"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={BRAND_NAME} />
        <link rel="preload" as="image" href="/noise.svg" />
        <link
          rel="preconnect"
          href="https://f7t7eeiv4kcyjvws.public.blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${appSans.variable} app-shell selection:bg-primary/20 bg-background scroll-smooth antialiased`}
        style={
          {
            "--safe-area-top": "env(safe-area-inset-top)",
            "--safe-area-right": "env(safe-area-inset-right)",
            "--safe-area-bottom": "env(safe-area-inset-bottom)",
            "--safe-area-left": "env(safe-area-inset-left)",
          } as CSSProperties
        }
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
