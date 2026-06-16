"use client"
import { Icon } from "@/components/ui/Icon";
import { useEffect } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import Link from "next/link"

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Users Section Error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <GlassCard className="max-w-xl w-full p-8 md:p-12 border-white/5 bg-slate-950/50 relative z-10 text-center space-y-8">
        <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-800/50 border border-white/10 text-slate-400">
          <Icon name="gpp_maybe" className="text-[40px] stroke-[1.5]" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-100">
            Users <span className="text-slate-400">Error</span>
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            Something went wrong loading the users section.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={reset}
            className="w-full px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
          >
            <Icon name="refresh" className="text-[16px]" />
            Try Again
          </button>
          <Link 
            href="/admin"
            className="w-full px-8 py-4 rounded-xl bg-slate-100 hover:bg-white text-[#020617] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
          >
            <Icon name="home" className="text-[16px]" />
            Dashboard
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
