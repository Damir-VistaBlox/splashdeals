"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * 🚨 Global Error Boundary (Root Level)
 * Catches catastrophic failures that escape segment-level error handlers.
 * Requirements: Must be a client component and include <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log catastrophic error to internal tracking
    console.error("🌊 Catastrophic Splash Error:", error);
  }, [error]);

  return (
    <html lang="sr">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1">
              <span className="animate-pulse text-[10px] font-black tracking-widest text-red-400 uppercase">
                Critical System Failure
              </span>
            </div>
            <h1 className="text-4xl leading-none font-black tracking-tighter uppercase italic">
              Splash System <br /> Interrupted
            </h1>
            <p className="text-sm text-slate-400">
              An unexpected wave has hit our core engine. We&apos;re working to stabilize the
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => reset()}
              className="w-full bg-cyan-500 font-black text-slate-950 uppercase italic hover:bg-cyan-400"
            >
              Re-initialize Session
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full border-white/10 font-black text-white uppercase italic hover:bg-white/5"
            >
              Return to Surface (Home)
            </Button>
          </div>

          {error.digest && (
            <p className="font-mono text-[10px] tracking-widest text-slate-600 uppercase">
              Error Digest: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
