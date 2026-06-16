import { Skeleton } from "@/components/ui/skeleton";

export default function NewUserLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1000px] w-full mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="mt-8 space-y-6">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
