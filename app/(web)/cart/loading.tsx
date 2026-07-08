import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
export default function CartLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* 🛒 ITEM LIST SKELETON */}
        <div className="flex-grow space-y-8">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground/40 flex items-center gap-2">
              <Icon name="arrow_back" className="text-[16px]" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Nazad na karte
              </span>
            </div>
            <Skeleton className="bg-muted h-8 w-44 rounded-xl" />
          </div>

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="border-border from-muted bg-gradient-to-r to-transparent p-6"
              >
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  {/* Icon/Image Placeholder */}
                  <div className="bg-muted flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl" />

                  {/* Info */}
                  <div className="w-full flex-grow space-y-3 text-center md:text-left">
                    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                      <Skeleton className="bg-muted h-4 w-24 rounded-full" />
                      <Skeleton className="bg-muted h-4 w-20 rounded-full" />
                    </div>
                    <Skeleton className="bg-muted mx-auto h-6 w-48 rounded-lg md:mx-0" />
                    <Skeleton className="bg-muted mx-auto h-4 w-32 rounded-md md:mx-0" />
                  </div>

                  {/* Quantity Controls */}
                  <div className="bg-muted h-14 w-32 flex-shrink-0 rounded-2xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 📋 SUMMARY SKELETON */}
        <div className="w-full flex-shrink-0 space-y-6 pt-12 lg:w-96 lg:pt-0">
          <Card className="border-primary/10 bg-card/50 relative space-y-8 overflow-hidden p-8">
            <div className="space-y-4">
              <Skeleton className="bg-muted h-6 w-36 rounded-lg" />
              <Skeleton className="bg-muted h-10 w-28 rounded-xl" />
            </div>

            <div className="border-border space-y-3 border-t pt-6">
              <div className="flex justify-between">
                <Skeleton className="bg-muted h-4 w-20 rounded-md" />
                <Skeleton className="bg-muted h-4 w-16 rounded-md" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="bg-muted h-4 w-24 rounded-md" />
                <Skeleton className="bg-muted h-4 w-12 rounded-md" />
              </div>
            </div>

            <Skeleton className="bg-muted h-16 w-full rounded-2xl pt-2" />
          </Card>
        </div>
      </div>
    </div>
  );
}
