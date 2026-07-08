import { Skeleton } from "@/components/ui/skeleton";

export default function ForbiddenLoading() {
  return (
    <div className="bg-background flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-6">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>
  );
}
