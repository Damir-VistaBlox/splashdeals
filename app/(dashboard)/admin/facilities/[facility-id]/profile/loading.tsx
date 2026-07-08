import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileLoading() {
  return (
    <div className="relative space-y-6 pb-20">
      <div className="relative mt-8 flex flex-col items-start gap-8 lg:flex-row">
        {/* 🧭 Nav Skeleton */}
        <div className="w-full shrink-0 space-y-2 lg:w-56">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="bg-muted/30 h-12 w-full rounded-xl" />
          ))}
        </div>

        <div className="w-full flex-1 space-y-12">
          <Card className="p-6">
            <div className="mb-8 flex items-center gap-3">
              <Skeleton className="bg-muted/30 size-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="bg-muted/30 h-5 w-40" />
                <Skeleton className="bg-muted/30 h-3 w-64" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="bg-muted/30 h-20 w-full rounded-xl" />
              <Separator className="bg-muted/30" />
              <Skeleton className="bg-muted/30 h-64 w-full rounded-xl" />
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Skeleton className="bg-muted/30 h-48 w-full rounded-2xl" />
            <Skeleton className="bg-muted/30 h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
