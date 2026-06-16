import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] w-full mx-auto animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 bg-white/5" />
        <Skeleton className="h-4 w-80 bg-white/5" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-white/5" />
        ))}
      </div>

      {/* Charts / Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-96 rounded-xl bg-white/5" />
        <Skeleton className="h-96 rounded-xl bg-white/5" />
      </div>

      {/* Bottom rows */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
        <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
        <Skeleton className="h-12 w-3/4 rounded-lg bg-white/5" />
      </div>
    </div>
  )
}
