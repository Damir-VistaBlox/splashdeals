import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * 🌤️ WeatherBadgeSkeleton
 * Matches the capsule shape of the WeatherBadge island.
 */
export function WeatherBadgeSkeleton() {
  return (
    <Skeleton className="h-8 w-40 rounded-full bg-cyan-500/10 border border-white/5" />
  );
}

/**
 * 🕓 OperationalStatusSkeleton
 * Matches the double-pill status display.
 */
export function OperationalStatusSkeleton() {
  return (
    <Skeleton className="h-10 w-48 rounded-2xl bg-cyan-500/5 border border-white/5" />
  );
}

export function TicketGridSkeleton() {
  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-24 md:pb-0 animate-pulse">
      {/* Tabs Placeholder */}
      <div className="w-full h-14 rounded-full bg-white/5 border border-white/5 flex items-center p-1 gap-2">
        <Skeleton className="h-full w-32 rounded-full bg-white/10" />
        <Skeleton className="h-full w-28 rounded-full bg-white/5" />
        <Skeleton className="h-full w-36 rounded-full bg-white/5 animate-pulse" />
      </div>

      {/* Desktop Layout Skeleton */}
      <div className="hidden md:grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-white/[0.02] border border-white/5 p-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-white/10 rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24 bg-white/5 rounded-md" />
                <Skeleton className="h-4 w-20 bg-white/5 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-24 bg-white/5 rounded-xl" />
              <div className="flex items-center bg-black/20 rounded-xl p-1 border border-white/5 w-24 h-10">
                <Skeleton className="h-full w-full bg-white/5 rounded-lg" />
              </div>
              <Skeleton className="h-11 w-32 bg-cyan-500/10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Layout Skeleton */}
      <div className="block md:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-5">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 bg-white/10 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16 bg-white/5 rounded-md" />
                <Skeleton className="h-4 w-20 bg-white/5 rounded-md" />
              </div>
            </div>
            <div className="h-px bg-white/5 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24 bg-white/5 rounded-md" />
            </div>
            <div className="h-px bg-white/5 w-full" />
            <div className="flex gap-3">
              <div className="flex items-center bg-black/25 rounded-2xl p-1 border border-white/5 w-28 h-12">
                <Skeleton className="h-full w-full bg-white/5 rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full bg-cyan-500/15 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
