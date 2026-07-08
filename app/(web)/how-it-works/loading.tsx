import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HowItWorksLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-32 pb-32 sm:px-12">
      {/* 🏙️ HEADER SKELETON */}
      <header className="mb-20 space-y-6 text-center sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <div className="bg-muted border-border h-9 w-9 rounded-lg border" />
          <Skeleton className="bg-muted h-4 w-36 rounded-md" />
        </div>
        <h1 className="text-muted-foreground/60 pointer-events-none text-5xl leading-[0.8] font-black tracking-tighter uppercase italic select-none sm:text-8xl">
          Kako Funkcioniše
        </h1>
        <Skeleton className="bg-muted mx-auto h-6 w-full rounded-lg sm:mx-0 sm:w-1/2" />
      </header>

      {/* 📜 STEPS GRID SKELETON */}
      <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[1, 2, 3].map((step) => (
          <Card
            key={step}
            className="border-border from-muted space-y-6 bg-gradient-to-b to-transparent p-8"
          >
            <div className="bg-muted h-12 w-12 rounded-2xl" />
            <Skeleton className="bg-muted h-6 w-32 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="bg-muted h-4 w-full rounded-md" />
              <Skeleton className="bg-muted h-4 w-full rounded-md" />
              <Skeleton className="bg-muted h-4 w-2/3 rounded-md" />
            </div>
          </Card>
        ))}
      </div>

      {/* 🚀 CTA SECTION SKELETON */}
      <div className="flex justify-center">
        <Skeleton className="bg-muted h-16 w-52 rounded-2xl" />
      </div>
    </div>
  );
}
