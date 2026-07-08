import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 🌊 Web Loading Boundary (Next.js 16 + Tailwind v4)
 * Provides a high-fidelity glassmorphic skeleton that eliminates CLS and layout shifts
 * while the Partial Prerendering (PPR) stream completes.
 *
 * ⚠️ SEO NOTE: Do NOT export `metadata` or any robots directives from loading.tsx.
 * Doing so leaks a noindex signal into the initial streaming payload before the real
 * page content arrives, which causes Googlebot to bail on indexing the page.
 */

export default function WebLoading() {
  return (
    <div className="bg-background selection:bg-primary/30 flex min-h-screen flex-col items-center justify-start overflow-hidden">
      {/* 🔮 BACKGROUND: Glassmorphism & Depth */}
      <div className="pointer-events-none fixed inset-0">
        {/* Animated Glows */}
        <div className="bg-primary/10 absolute top-[-10%] left-[-10%] h-[50%] w-[50%] animate-pulse rounded-full blur-[120px]" />
        <div className="bg-primary/5 absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] animate-pulse rounded-full blur-[120px] [animation-delay:2s]" />

        {/* Branded Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:64px_64px]" />
      </div>

      {/* 🌊 CENTRAL LOADER: Pulsing Branded Icon */}
      <div className="relative mt-32 mb-20 flex flex-col items-center">
        <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-[60px]" />
        <div className="bg-muted/50 border-border animate-float relative z-10 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl">
          <Icon name="waves" className="text-primary animate-pulse text-[48px]" />
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-primary/50 animate-pulse text-[10px] font-black tracking-[0.5em] uppercase">
            Loading Experience
          </span>
          <div className="flex gap-1">
            <div className="bg-primary/40 h-1 w-1 animate-bounce rounded-full" />
            <div className="bg-primary/40 h-1 w-1 animate-bounce rounded-full [animation-delay:0.2s]" />
            <div className="bg-primary/40 h-1 w-1 animate-bounce rounded-full [animation-delay:0.4s]" />
          </div>
        </div>
      </div>

      {/* 🏗️ SKELETON MOCKUP: Mirroring the Layout */}
      <main className="relative z-20 mx-auto w-full max-w-7xl space-y-24 px-6 pb-32">
        {/* Hero Area Skeleton */}
        <div className="flex flex-col items-center space-y-10 text-center">
          <Skeleton className="bg-muted border-border h-10 w-56 rounded-full border shadow-inner" />
          <div className="space-y-6">
            <Skeleton className="bg-muted h-20 w-[320px] rounded-[2rem] sm:h-28 sm:w-[900px]" />
            <Skeleton className="bg-muted mx-auto h-20 w-[280px] rounded-[2rem] sm:h-28 sm:w-[700px]" />
          </div>
          <Skeleton className="bg-muted h-6 w-[220px] rounded-xl sm:w-[450px]" />
          <div className="flex flex-wrap justify-center gap-5 pt-4">
            <Skeleton className="bg-muted h-16 w-48 rounded-2xl shadow-lg" />
            <Skeleton className="bg-muted h-16 w-48 rounded-2xl shadow-lg" />
          </div>
        </div>

        {/* Categories/Discovery Hub Skeleton */}
        <div className="space-y-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-4">
              <Skeleton className="bg-muted h-12 w-80 rounded-2xl" />
              <Skeleton className="bg-muted h-4 w-56 rounded-lg" />
            </div>
            <Skeleton className="bg-muted h-12 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className="bg-muted border-border hover:border-primary/20 h-36 rounded-3xl border transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Main Facility Grid Skeleton */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted/10 border-border group relative space-y-8 overflow-hidden rounded-[3rem] border p-8"
            >
              <Skeleton className="bg-muted h-72 w-full rounded-[2rem] shadow-2xl" />
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="bg-muted h-10 w-3/4 rounded-xl" />
                  <Skeleton className="bg-muted h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="bg-muted h-4 w-full rounded-lg" />
                  <Skeleton className="bg-muted h-4 w-5/6 rounded-lg" />
                  <Skeleton className="bg-muted h-4 w-4/6 rounded-lg" />
                </div>
              </div>
              <div className="border-border flex items-center justify-between border-t pt-6">
                <div className="space-y-2">
                  <Skeleton className="bg-muted h-3 w-16 rounded-full" />
                  <Skeleton className="bg-muted h-8 w-28 rounded-xl" />
                </div>
                <Skeleton className="bg-muted h-14 w-14 rounded-3xl shadow-xl" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
