import { Skeleton } from "@/components/ui/skeleton";

export default function NewUserLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6 p-6 md:p-10">
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
