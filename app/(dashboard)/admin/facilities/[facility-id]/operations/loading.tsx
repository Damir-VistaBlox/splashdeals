import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function OperationsLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Block Skeleton */}
      <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-2xl border p-6 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="bg-muted/30 h-8 w-8 rounded-lg" />
            <Skeleton className="bg-muted/30 h-8 w-48" />
          </div>
          <Skeleton className="bg-muted/30 ml-11 h-3 w-64" />
        </div>
        <Skeleton className="bg-muted/30 h-7 w-24 rounded-full" />
      </div>

      {/* Table Container Skeleton */}
      <Card className="border-border/50 bg-muted/20 rounded-2xl border p-4">
        <div className="space-y-4">
          {/* Table Header Row Skeleton */}
          <div className="border-border/50 grid grid-cols-4 gap-4 border-b px-4 pb-4">
            <Skeleton className="bg-muted/30 h-4 w-20" />
            <Skeleton className="bg-muted/30 h-4 w-32" />
            <Skeleton className="bg-muted/30 h-4 w-24" />
            <Skeleton className="bg-muted/30 h-4 w-28" />
          </div>

          {/* 7 Days of the Week Row Skeletons */}
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div
              key={row}
              className="grid grid-cols-4 items-center gap-4 border-b border-white/[0.02] px-4 py-4 last:border-0"
            >
              <Skeleton className="bg-muted/30 h-5 w-24 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="bg-muted/30 h-8 w-16 rounded-md" />
                <Skeleton className="bg-muted/30 h-8 w-16 rounded-md" />
              </div>
              <Skeleton className="bg-muted/30 h-6 w-20 rounded-full" />
              <Skeleton className="bg-muted/30 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
