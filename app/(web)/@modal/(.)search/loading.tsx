import { Skeleton } from "@/components/ui/skeleton";

export default function InterceptedSearchLoading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex animate-pulse items-start justify-center px-6 pt-32 backdrop-blur-md">
      <div className="bg-navy-deep/90 border-border w-full max-w-3xl space-y-6 rounded-[2.5rem] border p-8 shadow-2xl">
        <Skeleton className="bg-muted h-14 w-full rounded-2xl" />
        <div className="space-y-3 pt-4">
          <Skeleton className="bg-muted h-4 w-1/3 rounded-md" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-muted border-border h-28 rounded-2xl border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
