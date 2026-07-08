import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 🗺️ Global 404 handler
 * Standardized fallback for unmatched routes across all segments.
 */
export default function GlobalNotFound() {
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
              Coordinates <br /> Not Found
            </h1>
            <p className="text-sm text-slate-400">
              The page you&apos;re looking for has drifted off our maps. Let&apos;s get you back to
              the main deck.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-cyan-500 font-black text-slate-950 uppercase italic hover:bg-cyan-400"
            >
              <Link href="/">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
