import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

/**
 * 🗺️ Root-level 404 handler
 * Next.js App Router requires this file at app/not-found.tsx (not inside a route group)
 * to correctly emit 404 HTTP status codes for unmatched routes.
 * The (web)/not-found.tsx handles the UI within the web layout, but this root
 * file is what actually sets the HTTP response status to 404.
 */
export const metadata: Metadata = {
  title: "Stranica Nije Pronađena | Splashdeals",
  description:
    "Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu stranicu da istražite najbolje akva parkove u Srbiji.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return (
    <html lang="sr">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1">
              <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                Deep Water Discovery
              </span>
            </div>
            <h1 className="text-4xl leading-none font-black tracking-tighter uppercase italic">
              Koordinate <br /> Nisu Pronađene
            </h1>
            <p className="text-sm text-slate-400">
              Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu stranicu.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-cyan-500 font-black text-slate-950 uppercase italic hover:bg-cyan-400"
            >
              <Link href="/">Nazad na Marketplace</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
