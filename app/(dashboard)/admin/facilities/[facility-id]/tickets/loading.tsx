import { Skeleton } from "@/components/ui/skeleton";

export default function TicketManagementLoading() {
  return (
    <div className="animate-in fade-in flex h-full duration-500">
      {/* Left: Group panel skeleton */}
      <div className="border-border/50 hidden flex-col space-y-1.5 border-r p-3 lg:flex lg:w-72 xl:w-80">
        {/* Header */}
        <div className="mb-1 flex items-center justify-between px-1 py-3">
          <Skeleton className="bg-muted/30 h-3 w-24" />
          <Skeleton className="bg-muted/30 h-7 w-7 rounded-lg" />
        </div>
        {/* All Tickets sentinel */}
        <Skeleton className="bg-muted/30 h-14 w-full rounded-xl" />
        {/* Group cards */}
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="bg-muted/30 h-14 w-full rounded-xl" />
        ))}
      </div>

      {/* Right: Ticket table skeleton */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Panel header */}
        <div className="border-border/50 flex items-center justify-between border-b px-4 py-4">
          <Skeleton className="bg-muted/30 h-3 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="bg-muted/30 h-9 w-48 rounded-xl" />
            <Skeleton className="bg-muted/30 h-9 w-36 rounded-xl" />
          </div>
        </div>
        {/* Table rows */}
        <div className="flex-1 p-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-border/50 flex items-center gap-4 border-b px-4 py-4">
              <Skeleton className="bg-muted/30 h-4 w-4 rounded" />
              <Skeleton className="bg-muted/30 h-8 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="bg-muted/30 h-3 w-40" />
                <Skeleton className="bg-muted/30 h-2 w-20" />
              </div>
              <Skeleton className="bg-muted/30 h-3 w-20" />
              <Skeleton className="bg-muted/30 h-3 w-20" />
              <Skeleton className="bg-muted/30 h-6 w-24 rounded-full" />
              <Skeleton className="bg-muted/30 h-5 w-20 rounded-md" />
              <Skeleton className="bg-muted/30 h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
