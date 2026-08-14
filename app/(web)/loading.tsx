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
    <div className="mobile-route-frame bg-background selection:bg-primary/30 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(14,165,198,0.12),transparent_68%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-10">
          <div className="bg-card/80 border-border shadow-soft flex h-16 w-16 items-center justify-center rounded-3xl border backdrop-blur-sm">
            <Icon name="waves" className="text-primary text-[32px]" />
          </div>
          <div className="space-y-2">
            <span className="text-primary/70 text-[10px] font-black tracking-[0.38em] uppercase">
              Splashdeals
            </span>
            <p className="text-muted-foreground text-sm font-medium">
              Pripremamo stranicu za mobilni prikaz.
            </p>
          </div>
        </div>

        <main className="relative z-10 space-y-8 pb-8 sm:space-y-10 sm:pb-12">
          <div className="space-y-5 text-center">
            <Skeleton className="bg-muted border-border mx-auto h-9 w-40 rounded-full border shadow-inner sm:h-10 sm:w-52" />
            <div className="space-y-3">
              <Skeleton className="bg-muted mx-auto h-12 w-full max-w-[22rem] rounded-[1.75rem] sm:h-16 sm:max-w-3xl" />
              <Skeleton className="bg-muted mx-auto h-12 w-[88%] max-w-[18rem] rounded-[1.75rem] sm:h-16 sm:max-w-2xl" />
            </div>
            <Skeleton className="bg-muted mx-auto h-4 w-56 rounded-lg sm:w-80" />
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Skeleton className="bg-muted h-12 w-36 rounded-2xl shadow-sm sm:w-40" />
              <Skeleton className="bg-muted h-12 w-36 rounded-2xl shadow-sm sm:w-40" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <Skeleton className="bg-muted h-8 w-44 rounded-2xl sm:h-10 sm:w-64" />
                <Skeleton className="bg-muted h-4 w-40 rounded-lg sm:w-56" />
              </div>
              <Skeleton className="bg-muted h-10 w-28 rounded-xl sm:w-36" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="bg-muted border-border h-28 rounded-3xl border sm:h-32"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card/55 border-border space-y-5 overflow-hidden rounded-[2rem] border p-4 shadow-sm backdrop-blur-sm sm:p-5"
              >
                <Skeleton className="bg-muted h-52 w-full rounded-[1.5rem] sm:h-64" />
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <Skeleton className="bg-muted h-7 w-3/5 rounded-xl sm:h-8" />
                    <Skeleton className="bg-muted h-5 w-14 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="bg-muted h-4 w-full rounded-lg" />
                    <Skeleton className="bg-muted h-4 w-5/6 rounded-lg" />
                    <Skeleton className="bg-muted h-4 w-2/3 rounded-lg" />
                  </div>
                </div>
                <div className="border-border flex items-center justify-between border-t pt-4">
                  <div className="space-y-2">
                    <Skeleton className="bg-muted h-3 w-16 rounded-full" />
                    <Skeleton className="bg-muted h-7 w-24 rounded-xl" />
                  </div>
                  <Skeleton className="bg-muted h-12 w-12 rounded-3xl" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
