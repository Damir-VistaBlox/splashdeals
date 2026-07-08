import { Skeleton } from "@/components/ui/skeleton";

export default function CatchAllLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 pt-16 pb-32 sm:px-12">
      <div className="mb-12">
        <Skeleton className="h-4 w-40 bg-slate-800" />
      </div>
      <div className="mb-20 max-w-3xl">
        <Skeleton className="mb-4 h-4 w-24 bg-slate-800" />
        <Skeleton className="mb-2 h-16 w-full max-w-2xl bg-slate-800" />
        <Skeleton className="h-16 w-3/4 bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-72 rounded-xl bg-slate-800" />
        ))}
      </div>
    </div>
  );
}
