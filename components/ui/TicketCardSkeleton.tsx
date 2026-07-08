import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TicketCardSkeleton() {
  return (
    <Card className="border-border flex h-full flex-col overflow-hidden">
      {/* Image Block Skeleton */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-[1.5rem]">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Badge & Location Metadata Skeletons */}
        <div className="absolute bottom-4 left-4 z-20 space-y-3">
          <Skeleton className="h-5 w-20 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="flex flex-grow flex-col p-6">
        <Skeleton className="mb-3 h-6 w-3/4 rounded-lg" />
        <div className="mb-6 space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>

        {/* Footer Actions Skeleton */}
        <div className="border-border mt-auto flex items-end justify-between border-t pt-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-8 rounded-sm" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>

          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </div>
    </Card>
  );
}
