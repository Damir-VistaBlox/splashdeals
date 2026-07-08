"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AdminSkeleton() {
  return (
    <div className="bg-background flex h-screen w-full">
      {/* Sidebar Placeholder */}
      <div className="border-border/50 hidden w-[280px] flex-col gap-4 border-r p-4 lg:flex">
        <Skeleton className="bg-muted/30 h-8 w-40" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="bg-muted/30 h-5 w-full" />
          ))}
        </div>
        <div className="border-border/50 mt-auto space-y-2 border-t pt-4">
          <Skeleton className="bg-muted/30 h-8 w-32" />
          <Skeleton className="bg-muted/30 h-4 w-24" />
        </div>
      </div>

      {/* Main Content Placeholder */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <div className="border-border/50 flex h-[60px] items-center gap-4 border-b px-6">
          <Skeleton className="bg-muted/30 h-8 w-8" />
          <Skeleton className="bg-muted/30 h-4 w-96" />
          <div className="ml-auto flex items-center gap-3">
            <Skeleton className="bg-muted/30 h-8 w-8 rounded-full" />
            <Skeleton className="bg-muted/30 h-8 w-24 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Skeleton className="bg-muted/30 h-10 w-64" />
          <Skeleton className="bg-muted/30 mt-2 h-5 w-96" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="bg-muted/30 h-32 rounded-xl" />
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <Skeleton className="bg-muted/30 h-8 w-full" />
            <Skeleton className="bg-muted/30 h-8 w-full" />
            <Skeleton className="bg-muted/30 h-8 w-full" />
            <Skeleton className="bg-muted/30 h-8 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
