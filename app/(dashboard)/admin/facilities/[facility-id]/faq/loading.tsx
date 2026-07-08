import { Card } from "@/components/ui/card";

export default function FAQLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="animate-pulse space-y-2">
        <div className="bg-muted/40 h-7 w-24 rounded-lg" />
        <div className="bg-muted/30 h-4 w-64 rounded-lg" />
      </div>
      <Card className="border-border/50 bg-muted/20 animate-pulse space-y-4 rounded-2xl border p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-border/30 space-y-2 border-b pb-4 last:border-0">
            <div className="bg-muted/40 h-5 w-3/4 rounded-lg" />
            <div className="bg-muted/20 h-4 w-full rounded-lg" />
          </div>
        ))}
      </Card>
    </div>
  );
}
