import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Server-safe skeleton matching FacilitiesTableToolbar + table chrome. */
export function TableSkeleton({
  rows = 10,
  density = "compact",
}: {
  rows?: number;
  density?: "comfortable" | "compact";
}) {
  return (
    <div className="space-y-4">
      <div className="bg-card/95 border-border/60 space-y-4 rounded-[28px] border p-3 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="bg-muted/30 h-3 w-24" />
            <Skeleton className="bg-muted/30 h-4 w-48" />
          </div>
          <Skeleton className="bg-muted/30 h-4 w-40" />
        </div>
        <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Skeleton className="bg-muted/30 h-10 w-full rounded-2xl sm:max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="bg-muted/30 h-10 w-[160px] rounded-2xl" />
            <Skeleton className="bg-muted/30 h-10 w-20 rounded-full" />
            <Skeleton className="bg-muted/30 h-10 w-[100px] rounded-2xl" />
            <Skeleton className="bg-muted/30 h-10 w-24 rounded-full" />
            <Skeleton className="bg-muted/30 h-10 w-10 rounded-full" />
            <Skeleton className="bg-muted/30 h-10 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="border-border/50 bg-muted/40 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md">
        <div className="border-border/50 bg-muted/50 border-b">
          <div
            className={cn("flex items-center gap-4 px-3", density === "compact" ? "h-8" : "h-10")}
          >
            <Skeleton className="bg-muted/50 h-3 w-4" />
            <Skeleton className="bg-muted/50 h-3 w-3/12" />
            <Skeleton className="bg-muted/50 h-3 w-2/12" />
            <Skeleton className="bg-muted/50 h-3 w-2/12" />
            <Skeleton className="bg-muted/50 h-3 w-1/12" />
            <Skeleton className="bg-muted/50 h-3 w-1/12" />
          </div>
        </div>
        <div className="divide-border/50 divide-y">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={cn("flex items-center gap-4 px-3", density === "compact" ? "h-9" : "h-12")}
            >
              <Skeleton className="bg-muted/30 h-4 w-4" />
              <Skeleton className="bg-muted/30 h-4 w-3/12" />
              <Skeleton className="bg-muted/30 h-4 w-2/12" />
              <Skeleton className="bg-muted/30 h-4 w-2/12" />
              <Skeleton className="bg-muted/30 ml-auto h-4 w-1/12" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="bg-muted/30 h-3 w-32" />
        <div className="flex gap-2">
          <Skeleton className="bg-muted/30 h-8 w-8" />
          <Skeleton className="bg-muted/30 h-8 w-8" />
          <Skeleton className="bg-muted/30 h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
