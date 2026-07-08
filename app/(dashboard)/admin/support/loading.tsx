import { Skeleton } from "@/components/ui/skeleton";

export default function SupportLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-6 md:p-10">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
