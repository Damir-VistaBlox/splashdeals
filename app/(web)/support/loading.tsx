import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
export default function SupportLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl animate-pulse px-6 pt-24 pb-16 sm:px-12 sm:pt-32 sm:pb-32">
      {/* 🏙️ HEADER SKELETON */}
      <header className="mb-12 space-y-6 sm:mb-20">
        <div className="flex items-center gap-3">
          <div className="bg-muted border-border text-muted-foreground/40 rounded-lg border p-2">
            <Icon name="support" className="text-[20px]" />
          </div>
          <Skeleton className="bg-muted h-4 w-32 rounded-md" />
        </div>
        <h1 className="text-muted-foreground/60 pointer-events-none text-5xl leading-[0.9] font-black tracking-tighter uppercase italic select-none sm:text-7xl">
          Centar za Podršku
        </h1>
        <Skeleton className="bg-muted h-4 w-48 rounded-md" />
      </header>

      {/* 📜 CONTENT SKELETON */}
      <div className="space-y-12">
        <div className="space-y-3">
          <Skeleton className="bg-muted h-4 w-full rounded-md" />
          <Skeleton className="bg-muted h-4 w-5/6 rounded-md" />
        </div>

        <section className="space-y-8">
          <h2 className="text-foreground flex items-center gap-3 text-2xl font-black tracking-tight uppercase italic">
            <Icon name="help" className="text-muted-foreground/40 text-[24px]" />
            <Skeleton className="bg-muted h-6 w-48 rounded-md" />
          </h2>

          <div className="grid gap-6">
            {[1, 2, 3].map((idx) => (
              <Card
                key={idx}
                className="border-border from-muted space-y-3 bg-gradient-to-r to-transparent p-6"
              >
                <Skeleton className="bg-muted h-5 w-1/3 rounded-md" />
                <Skeleton className="bg-muted h-4 w-full rounded-md" />
                <Skeleton className="bg-muted h-4 w-2/3 rounded-md" />
              </Card>
            ))}
          </div>
        </section>

        {/* 📧 CONTACT SECTION SKELETON */}
        <Card className="border-border bg-muted p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex-grow space-y-3">
              <Skeleton className="bg-muted h-5 w-44 rounded-md" />
              <Skeleton className="bg-muted h-4 w-64 rounded-md" />
            </div>
            <Skeleton className="bg-muted h-12 w-36 flex-shrink-0 rounded-xl" />
          </div>
        </Card>
      </div>
    </div>
  );
}
