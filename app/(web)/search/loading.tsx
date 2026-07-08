import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="bg-background flex min-h-screen items-start justify-center px-6 pt-32">
      <div className="w-full max-w-4xl space-y-6">
        <Skeleton className="bg-muted h-16 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted border-border h-44 rounded-[2.5rem] border" />
          ))}
        </div>
      </div>
    </div>
  );
}
