import { Skeleton } from "@/components/ui/skeleton"
import { FacilityGridSkeleton } from "./_components/FacilitySkeletons"

export default function FacilitiesRootLoading() {
  return (
    <div className="min-h-screen pb-32 pt-16 px-6 sm:px-12 max-w-7xl mx-auto animate-pulse">
      {/* 🏙️ SEARCH & HEADER SKELETON */}
      <header className="mb-12">
        <div className="space-y-8 mb-12">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-3.5 w-40 bg-white/5 rounded" />
            <Skeleton className="h-4 w-32 bg-white/5 rounded hidden md:block" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-14 sm:h-[4vw] w-2/3 bg-white/5 rounded" />
            <Skeleton className="h-14 sm:h-[4vw] w-1/3 bg-white/5 rounded" />
          </div>
        </div>

        {/* 🧿 Category Pills Skeleton */}
        <div className="flex flex-wrap gap-3 mt-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 bg-white/5 rounded-full" />
          ))}
        </div>
      </header>

      {/* 🎛️ Filter Bar Skeleton */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-900/20 p-4 rounded-2xl border border-white/5 mb-12">
        <Skeleton className="h-10 w-36 bg-white/5 rounded-xl" />
        <Skeleton className="h-10 w-36 bg-white/5 rounded-xl" />
        <Skeleton className="h-10 w-28 bg-white/5 rounded-xl ml-auto" />
      </div>

      {/* 🚀 DYNAMIC FACILITY GRID SKELETON */}
      <section className="mt-12">
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-44 bg-white/5 rounded" />
            <Skeleton className="h-6 w-24 bg-white/5 rounded-full" />
          </div>
          <div className="h-px flex-1 bg-white/5 hidden md:block" />
        </div>

        <FacilityGridSkeleton count={6} />
      </section>
    </div>
  )
}
