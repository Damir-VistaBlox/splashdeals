export default function NavigationLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-12 animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((col) => (
          <div key={col} className="space-y-3">
            <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
            {[0, 1].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted/50" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
