import { Skeleton } from "@/components/ui/skeleton";

export default function FacilitiesLoading() {
  return (
    <div className="bg-background border-border/50 relative flex min-h-[calc(100vh-4rem)] w-full flex-col gap-8 overflow-hidden rounded-2xl border p-4 md:p-6">
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 -mt-64 -mr-64 h-[500px] w-[500px] rounded-full blur-[120px]" />
      <div className="bg-accent/5 pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[400px] w-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Skeleton className="bg-muted/30 h-8 w-48" />
          <Skeleton className="bg-muted/30 mt-1.5 h-3 w-72" />
        </div>
        <Skeleton className="bg-muted/30 h-11 w-44 rounded-xl" />
      </div>

      {/* Match page.tsx lg:grid-cols-5 */}
      <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="bg-muted/30 h-24 w-full rounded-xl" />
        ))}
      </div>

      <div className="relative z-10 mt-4 space-y-4">
        <div className="bg-background/40 border-border/50 flex flex-wrap items-center gap-2 rounded-xl border p-2">
          <Skeleton className="bg-muted/30 h-9 w-64" />
          <Skeleton className="bg-muted/30 h-9 w-40" />
          <Skeleton className="bg-muted/30 h-9 w-12" />
          <Skeleton className="bg-muted/30 h-9 w-24" />
          <Skeleton className="bg-muted/30 h-9 w-20" />
          <Skeleton className="bg-muted/30 h-9 w-9" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="bg-muted/30 h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
