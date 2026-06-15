import { Skeleton } from "@/components/ui/skeleton";

export function SuccessSkeleton() {
  return (
    <div className="space-y-16 animate-pulse pt-10">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800" />
        <div className="space-y-4 flex flex-col items-center">
            <Skeleton className="h-12 w-80 bg-slate-900" />
            <Skeleton className="h-6 w-96 bg-slate-900" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Skeleton className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
        <Skeleton className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
      </div>
      <div className="flex justify-center gap-6">
        <Skeleton className="h-14 w-48 rounded-full bg-slate-900" />
        <Skeleton className="h-14 w-48 rounded-full bg-slate-900" />
      </div>
    </div>
  );
}
