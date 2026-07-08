import { Skeleton } from "@/components/ui/skeleton";

export default function ApiKeysLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-12 w-36" />
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
