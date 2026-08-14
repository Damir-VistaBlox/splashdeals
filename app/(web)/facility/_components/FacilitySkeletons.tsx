import { Card } from "@/components/ui/card";

/**
 * 🦴 CategoryOrbSkeleton
 * Mirroring the Category Orb layout for zero-CLS streaming.
 */
export function CategoryOrbSkeleton() {
  return (
    <Card className="border-border relative overflow-hidden p-6 text-center">
      <div className="flex flex-col items-center">
        {/* Unit count placeholder */}
        <div className="bg-muted mb-3 h-2 w-16 animate-pulse rounded" />
        {/* Category name placeholder */}
        <div className="bg-muted/80 h-5 w-24 animate-pulse rounded" />
      </div>

      {/* Decorative filter icon ghost */}
      <div className="absolute top-0 right-0 p-2 opacity-5">
        <div className="bg-foreground/10 h-12 w-12 rounded-full" />
      </div>
    </Card>
  );
}

/**
 * 🦴 FacilityCardSkeleton
 * Mirrors FacilityCard.tsx's real dimensions (min-h-[320px] → sm:h-[410px], rounded-[1.6rem]
 * → sm:rounded-[2rem]) so streaming the real card in doesn't shift layout (CLS Zero).
 */
export function FacilityCardSkeleton() {
  return (
    <Card className="border-border group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.6rem] sm:h-[410px] sm:min-h-0 sm:rounded-[2rem]">
      {/* Ghost Background Image */}
      <div className="bg-muted absolute inset-0 transition-transform duration-1000 group-hover:scale-110" />
      <div className="from-background via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />

      {/* Content Skeleton */}
      <div className="relative z-10 mt-auto flex flex-col gap-2.5 p-3.5 sm:p-5">
        {/* Category + city chips */}
        <div className="flex gap-1.5">
          <div className="bg-primary/10 h-6 w-20 animate-pulse rounded-full" />
          <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
        </div>

        {/* Title placeholder */}
        <div className="bg-muted h-7 w-3/4 animate-pulse rounded-lg" />

        <div className="mt-1 flex items-end justify-between gap-2.5 border-t border-white/14 pt-3">
          {/* Price ghost */}
          <div className="flex flex-col gap-1.5">
            <div className="bg-muted h-2 w-14 rounded" />
            <div className="bg-primary/10 h-7 w-20 rounded" />
          </div>

          {/* CTA pill ghost */}
          <div className="bg-muted h-11 w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

/**
 * 🦴 FacilityGridSkeleton
 */
export function FacilityGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <FacilityCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 🦴 CategoryGridSkeleton
 */
export function CategoryGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryOrbSkeleton key={i} />
      ))}
    </div>
  );
}
