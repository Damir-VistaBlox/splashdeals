export default function OverviewLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* 📊 Strategic Metrics Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-muted/20 border-border/50 relative h-32 w-full overflow-hidden rounded-2xl border"
          >
            <div className="bg-muted/30 absolute top-4 left-4 h-3 w-20 rounded" />
            <div className="bg-muted/30 absolute bottom-4 left-4 h-8 w-24 rounded" />
            <div className="bg-muted/30 absolute top-4 right-4 size-8 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 🏗️ Core Command Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="bg-muted/20 border-border/50 h-[420px] w-full rounded-3xl border" />
          <div className="bg-muted/20 border-border/50 h-[300px] w-full rounded-3xl border" />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-muted/20 border-border/50 h-[600px] w-full rounded-3xl border" />
        </div>
      </div>
    </div>
  );
}
