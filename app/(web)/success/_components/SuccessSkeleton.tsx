import { Skeleton } from "@/components/ui/skeleton";

export function SuccessSkeleton() {
  return (
    <div className="animate-pulse space-y-16 pt-10">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="bg-muted border-border h-24 w-24 rounded-full border" />
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="bg-muted h-12 w-80" />
          <Skeleton className="bg-muted h-6 w-96" />
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <Skeleton className="bg-muted border-border h-64 rounded-3xl border" />
        <Skeleton className="bg-muted border-border h-64 rounded-3xl border" />
      </div>
      <div className="flex justify-center gap-6">
        <Skeleton className="bg-muted h-14 w-48 rounded-full" />
        <Skeleton className="bg-muted h-14 w-48 rounded-full" />
      </div>
    </div>
  );
}
