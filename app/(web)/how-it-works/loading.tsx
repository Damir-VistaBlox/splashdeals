import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function HowItWorksLoading() {
  return (
    <div className="min-h-screen pb-32 pt-32 px-6 sm:px-12 max-w-5xl mx-auto">
      {/* 🏙️ HEADER SKELETON */}
      <header className="mb-20 text-center sm:text-left space-y-6">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="h-9 w-9 bg-white/5 border border-white/5 rounded-lg" />
          <Skeleton className="h-4 w-36 bg-white/5 rounded-md" />
        </div>
        <h1 className="text-5xl sm:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] text-slate-800 select-none pointer-events-none">Kako Funkcioniše</h1>
        <Skeleton className="h-6 w-full sm:w-1/2 bg-white/5 rounded-lg mx-auto sm:mx-0" />
      </header>

      {/* 📜 STEPS GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[1, 2, 3].map((step) => (
          <Card key={step} className="p-8 border-white/5 bg-gradient-to-b from-white/5 to-transparent space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5" />
            <Skeleton className="h-6 w-32 bg-white/5 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/5 rounded-md" />
              <Skeleton className="h-4 w-full bg-white/5 rounded-md" />
              <Skeleton className="h-4 w-2/3 bg-white/5 rounded-md" />
            </div>
          </Card>
        ))}
      </div>

      {/* 🚀 CTA SECTION SKELETON */}
      <div className="flex justify-center">
        <Skeleton className="h-16 w-52 bg-white/5 rounded-2xl" />
      </div>
    </div>
  )
}
