import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-4 md:p-6">
      {/* SectionCards skeleton — 4 cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Chart + Activity Pulse sidebar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Skeleton className="h-96 rounded-xl" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
          <Skeleton className="mt-auto h-24 w-full rounded-lg" />
        </div>
      </div>

      {/* Operational Queue skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
