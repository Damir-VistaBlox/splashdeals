import { Skeleton } from "@/components/ui/skeleton"
import { FacilityGridSkeleton } from "../_components/FacilitySkeletons"

export default function DiscoveryLoading() {
  return (
    <div className="min-h-screen pb-32 pt-16 px-6 sm:px-12 max-w-7xl mx-auto animate-pulse">
      {/* 🧭 BREADCRUMBS SKELETON */}
      <div className="flex items-center gap-2 mb-12">
        <Skeleton className="h-4 w-12 bg-white/5 rounded" />
        <span className="text-slate-700">/</span>
        <Skeleton className="h-4 w-20 bg-white/5 rounded" />
        <span className="text-slate-700">/</span>
        <Skeleton className="h-4 w-24 bg-white/5 rounded" />
      </div>

      {/* 🏙️ DISCOVERY HEADER SKELETON */}
      <header className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-3 w-40 bg-white/5 rounded animate-pulse" />
            <div className="space-y-3">
              <Skeleton className="h-16 sm:h-20 w-3/4 bg-white/5 rounded" />
              <Skeleton className="h-16 sm:h-20 w-1/2 bg-white/5 rounded" />
            </div>
          </div>

          <Skeleton className="h-9 w-36 rounded-full bg-white/5" />
        </div>
      </header>

      {/* 🚀 FACILITIES GRID SKELETON */}
      <section>
        <FacilityGridSkeleton count={3} />
      </section>
    </div>
  )
}
