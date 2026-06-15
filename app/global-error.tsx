'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

/**
 * 🚨 Global Error Boundary (Root Level)
 * Catches catastrophic failures that escape segment-level error handlers.
 * Requirements: Must be a client component and include <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log catastrophic error to internal tracking
    console.error('🌊 Catastrophic Splash Error:', error)
  }, [error])

  return (
    <html lang="sr">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
               <span className="text-[10px] font-black text-red-400 uppercase tracking-widest animate-pulse">
                  Critical System Failure
               </span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              Splash System <br /> Interrupted
            </h1>
            <p className="text-slate-400 text-sm">
              An unexpected wave has hit our core engine. We&apos;re working to stabilize the platform.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => reset()}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase italic"
            >
              Re-initialize Session
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full border-white/10 hover:bg-white/5 text-white font-black uppercase italic"
            >
              Return to Surface (Home)
            </Button>
          </div>

          {error.digest && (
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
              Error Digest: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
