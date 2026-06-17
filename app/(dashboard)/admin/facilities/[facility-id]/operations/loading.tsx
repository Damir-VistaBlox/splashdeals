import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function OperationsLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Header Block Skeleton */}
      <div className="flex items-center justify-between bg-muted/40 p-6 rounded-2xl border border-border/50 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-muted/30" />
            <Skeleton className="h-8 w-48 bg-muted/30" />
          </div>
          <Skeleton className="h-3 w-64 ml-11 bg-muted/30" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full bg-muted/30" />
      </div>

      {/* Table Container Skeleton */}
      <Card className="p-4 border border-border/50 bg-muted/20 rounded-2xl">
        <div className="space-y-4">
          {/* Table Header Row Skeleton */}
          <div className="grid grid-cols-4 gap-4 pb-4 border-b border-border/50 px-4">
            <Skeleton className="h-4 w-20 bg-muted/30" />
            <Skeleton className="h-4 w-32 bg-muted/30" />
            <Skeleton className="h-4 w-24 bg-muted/30" />
            <Skeleton className="h-4 w-28 bg-muted/30" />
          </div>

          {/* 7 Days of the Week Row Skeletons */}
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div
              key={row}
              className="grid grid-cols-4 gap-4 py-4 px-4 items-center border-b border-white/[0.02] last:border-0"
            >
              <Skeleton className="h-5 w-24 bg-muted/30 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 bg-muted/30 rounded-md" />
                <Skeleton className="h-8 w-16 bg-muted/30 rounded-md" />
              </div>
              <Skeleton className="h-6 w-20 bg-muted/30 rounded-full" />
              <Skeleton className="h-10 w-full bg-muted/30 rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
