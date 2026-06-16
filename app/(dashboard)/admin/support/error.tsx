"use client"
import { Icon } from "@/components/ui/Icon";
import { useEffect } from "react"
import Link from "next/link"

export default function SupportError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Support Error:", error)
  }, [error])

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] w-full mx-auto">
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/5 border border-white/10 text-slate-400 mx-auto">
        <Icon name="support_agent" className="text-[40px]" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-slate-100">
          Support <span className="text-slate-500">Error</span>
        </h1>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Could not load the support section. Please try again.
        </p>
      </div>
      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full pt-2">
        <button
          onClick={reset}
          className="w-full px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
        >
          <Icon name="refresh" className="text-[16px]" />
          Try Again
        </button>
        <Link
          href="/admin/support"
          className="w-full px-8 py-4 rounded-xl bg-slate-100 hover:bg-white text-[#020617] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
        >
          <Icon name="support_agent" className="text-[16px]" />
          Support
        </Link>
      </div>
    </div>
  )
}
