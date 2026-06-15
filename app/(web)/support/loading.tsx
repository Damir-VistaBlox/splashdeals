import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/skeleton"
import { GlassCard } from "@/components/ui/GlassCard"
export default function SupportLoading() {
  return (
    <div className="min-h-screen pb-32 pt-32 px-6 sm:px-12 max-w-5xl mx-auto animate-pulse">
      {/* 🏙️ HEADER SKELETON */}
      <header className="mb-20 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-700">
            <Icon name="support" className="text-[20px]" />
          </div>
          <Skeleton className="h-4 w-32 bg-white/5 rounded-md" />
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] text-slate-800 select-none pointer-events-none">Centar za Podršku</h1>
        <Skeleton className="h-4 w-48 bg-white/5 rounded-md" />
      </header>

      {/* 📜 CONTENT SKELETON */}
      <div className="space-y-12">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-white/5 rounded-md" />
          <Skeleton className="h-4 w-5/6 bg-white/5 rounded-md" />
        </div>

        <section className="space-y-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-3">
            <Icon name="help" className="text-[24px] text-slate-700" />
            <Skeleton className="h-6 w-48 bg-white/5 rounded-md" />
          </h2>

          <div className="grid gap-6">
            {[1, 2, 3].map((idx) => (
              <GlassCard key={idx} className="p-6 border-white/5 bg-gradient-to-r from-white/5 to-transparent space-y-3">
                <Skeleton className="h-5 w-1/3 bg-white/5 rounded-md" />
                <Skeleton className="h-4 w-full bg-white/5 rounded-md" />
                <Skeleton className="h-4 w-2/3 bg-white/5 rounded-md" />
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 📧 CONTACT SECTION SKELETON */}
        <GlassCard className="p-8 border-white/5 bg-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 flex-grow">
              <Skeleton className="h-5 w-44 bg-white/5 rounded-md" />
              <Skeleton className="h-4 w-64 bg-white/5 rounded-md" />
            </div>
            <Skeleton className="h-12 w-36 bg-white/5 rounded-xl flex-shrink-0" />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
