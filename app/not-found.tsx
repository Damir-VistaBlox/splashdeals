import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

/**
 * 🗺️ Root-level 404 handler
 * Next.js App Router requires this file at app/not-found.tsx (not inside a route group)
 * to correctly emit 404 HTTP status codes for unmatched routes.
 * The (web)/not-found.tsx handles the UI within the web layout, but this root
 * file is what actually sets the HTTP response status to 404.
 */
export const metadata: Metadata = {
  title: 'Stranica Nije Pronađena | Splashdeals',
  description:
    'Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu stranicu da istražite najbolje akva parkove u Srbiji.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
  },
}

export default function NotFound() {
  return (
    <html lang="sr">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                Deep Water Discovery
              </span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              Koordinate <br /> Nisu Pronađene
            </h1>
            <p className="text-slate-400 text-sm">
              Stranica koju tražite ne postoji ili je premeštena. Vratite se na početnu stranicu.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase italic"
            >
              <Link href="/">Nazad na Marketplace</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
