export default function NavigationLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
      <div className="bg-muted h-12 animate-pulse rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((col) => (
          <div key={col} className="space-y-3">
            <div className="bg-muted h-6 w-24 animate-pulse rounded-md" />
            {[0, 1].map((i) => (
              <div key={i} className="bg-muted/50 h-32 animate-pulse rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
