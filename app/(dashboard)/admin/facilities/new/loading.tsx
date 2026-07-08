import { Skeleton } from "@/components/ui/skeleton";

export default function NewFacilityLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6 md:p-10">
      <div className="space-y-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="mt-8 space-y-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
