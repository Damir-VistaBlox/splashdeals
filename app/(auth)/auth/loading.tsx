import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-2xl bg-white/5" />
        <Skeleton className="mx-auto h-8 w-48 bg-white/5" />
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
        <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
        <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
      </div>
    </div>
  );
}
