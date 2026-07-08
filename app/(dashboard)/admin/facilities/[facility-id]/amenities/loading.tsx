import { Card } from "@/components/ui/card";

export default function AmenitiesLoading() {
  return (
    <Card className="border-border/50 bg-muted/40 relative animate-pulse space-y-6 overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="bg-background/40 border-border/50 h-9 w-full max-w-md rounded-lg border" />
        <div className="flex items-center gap-3">
          <div className="bg-muted h-4 w-28 rounded" />
          <div className="bg-muted h-6 w-10 rounded-full" />
        </div>
      </div>
      <div className="border-border/50 bg-background/20 overflow-hidden rounded-xl border">
        <div className="divide-border/50 divide-y">
          <div className="bg-background/60 border-border/50 grid grid-cols-6 gap-4 border-b p-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted h-3 w-16 rounded" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-6 items-center gap-4 p-4">
              <div className="bg-muted h-6 w-10 rounded-full" />
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted h-5 w-16 rounded-full" />
              <div className="bg-muted h-8 w-36 rounded-lg" />
              <div className="bg-muted mx-auto h-5 w-5 rounded" />
              <div className="bg-muted ml-auto h-6 w-6 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
