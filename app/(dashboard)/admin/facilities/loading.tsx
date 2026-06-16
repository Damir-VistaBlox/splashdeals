import { Skeleton } from "@/components/ui/skeleton"

export default function FacilitiesLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] w-full mx-auto animate-pulse">
      {/* Back button skeleton */}
      <Skeleton className="h-4 w-24 bg-muted/30" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-muted/30" />
          <Skeleton className="h-4 w-96 bg-muted/30" />
        </div>
        <Skeleton className="h-12 w-40 bg-muted/30" />
      </div>

      {/* Table */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg bg-muted/30" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg bg-muted/30" />
          ))}
        </div>
      </div>
    </div>
  )
}
