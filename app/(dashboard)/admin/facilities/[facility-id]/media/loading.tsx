import { Skeleton } from "@/components/ui/skeleton";

export default function MediaLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="bg-muted/30 border-border/50 h-48 w-full rounded-xl border-2 border-dashed" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <Skeleton key={i} className="bg-muted/30 aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}
