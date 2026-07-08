"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TableSkeleton({
  rows = 10,
  density = "compact",
}: {
  rows?: number;
  density?: "comfortable" | "compact";
}) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 border-border/50 flex flex-col items-stretch justify-between gap-3 rounded-xl border p-2 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3">
          <Skeleton className="bg-muted/30 h-9 w-64" />
          <Skeleton className="bg-muted/30 h-9 w-40" />
        </div>
        <Skeleton className="bg-muted/30 h-9 w-9" />
      </div>

      <div className="bg-card overflow-hidden rounded-md border">
        <div className="border-border/50 bg-muted/50 border-b">
          <div className={cn("flex items-center px-3", density === "compact" ? "h-8" : "h-10")}>
            <Skeleton className="bg-muted/50 h-3 w-4/12" />
            <Skeleton className="bg-muted/50 ml-4 h-3 w-2/12" />
            <Skeleton className="bg-muted/50 ml-4 h-3 w-2/12" />
            <Skeleton className="bg-muted/50 ml-4 h-3 w-2/12" />
          </div>
        </div>
        <div className="divide-border/50 divide-y">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={cn("flex items-center px-3", density === "compact" ? "h-9" : "h-12")}
            >
              <Skeleton className="bg-muted/30 h-4 w-4/12" />
              <Skeleton className="bg-muted/30 ml-4 h-4 w-2/12" />
              <Skeleton className="bg-muted/30 ml-4 h-4 w-2/12" />
              <Skeleton className="bg-muted/30 ml-auto h-4 w-1/12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
