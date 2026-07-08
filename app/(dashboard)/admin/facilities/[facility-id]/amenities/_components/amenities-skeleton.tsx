"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

export function AmenitiesSkeleton() {
  return (
    <Card className="border-border/50 bg-muted/40 relative animate-pulse space-y-6 overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-xl">
      {/* Search and filter bar skeletons */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="bg-background/40 border-border/50 flex h-9 w-full max-w-md items-center gap-2 rounded-lg border px-3">
          <div className="bg-muted size-4 rounded" />
          <div className="bg-muted h-3 w-32 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-muted h-4 w-28 rounded" />
          <div className="bg-muted h-6 w-10 rounded-full" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="border-border/50 bg-background/20 overflow-hidden rounded-xl border">
        <div className="divide-border/50 divide-y">
          {/* Header row skeleton */}
          <div className="bg-background/60 border-border/50 grid grid-cols-6 gap-4 border-b p-4">
            <div className="bg-muted h-3 w-16 rounded" />
            <div className="bg-muted h-3 w-28 rounded" />
            <div className="bg-muted h-3 w-20 rounded" />
            <div className="bg-muted h-3 w-24 rounded" />
            <div className="bg-muted mx-auto h-3 w-12 rounded" />
            <div className="bg-muted ml-auto h-3 w-8 rounded" />
          </div>

          {/* Data row skeletons */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-6 items-center gap-4 p-4">
              <div className="bg-muted h-6 w-10 rounded-full" />
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted h-5 w-16 rounded-full" />
              <div className="bg-muted h-8 w-36 rounded-lg" />
              <div className="bg-muted mx-auto h-5 w-5 rounded" />
              <div className="bg-muted ml-auto h-6 w-6 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Add Infrastructure footer skeleton */}
      <div className="border-border/50 space-y-3 border-t pt-4">
        <div className="bg-muted h-3 w-48 rounded" />
        <div className="bg-background/40 border-border/50 flex flex-col items-center gap-3 rounded-xl border p-4 md:flex-row">
          <div className="bg-muted h-9 flex-1 rounded-lg" />
          <div className="bg-muted h-9 w-[140px] rounded-lg" />
          <div className="bg-muted h-9 w-[160px] rounded-lg" />
          <div className="bg-muted h-9 w-32 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

export default AmenitiesSkeleton;
