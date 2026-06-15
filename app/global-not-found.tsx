import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 🗺️ Global 404 handler
 * Standardized fallback for unmatched routes across all segments.
 */
export default function GlobalNotFound() {
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
              Coordinates <br /> Not Found
            </h1>
            <p className="text-slate-400 text-sm">
              The page you&apos;re looking for has drifted off our maps. Let&apos;s get you back to the main deck.
            </p>
          </div>

          <div className="flex flex-col gap-3">
             <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase italic">
               <Link href="/">Back to Marketplace</Link>
             </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
