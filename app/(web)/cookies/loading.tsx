import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
export default function CookiesLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-16 sm:px-12 sm:pt-32 sm:pb-32">
      {/* 🏙️ HEADER SKELETON */}
      <header className="mb-12 space-y-6 sm:mb-20">
        <div className="flex items-center gap-3">
          <div className="bg-muted border-border text-muted-foreground/40 rounded-lg border p-2">
            <Icon name="info" className="text-[20px]" />
          </div>
          <Skeleton className="bg-muted h-4 w-32 rounded-md" />
        </div>
        <h1 className="text-muted-foreground/60 pointer-events-none text-5xl leading-[0.9] font-black tracking-tighter uppercase italic select-none sm:text-7xl">
          Politika Kolačića
        </h1>
        <Skeleton className="bg-muted h-4 w-48 rounded-md" />
      </header>

      {/* 📜 CONTENT SKELETON */}
      <div className="space-y-12">
        <div className="space-y-3">
          <Skeleton className="bg-muted h-4 w-full rounded-md" />
          <Skeleton className="bg-muted h-4 w-5/6 rounded-md" />
        </div>

        <div className="grid gap-8">
          {[1, 2, 3].map((idx) => (
            <Card
              key={idx}
              className="border-border from-muted space-y-4 bg-gradient-to-r to-transparent p-8"
            >
              <h2 className="text-foreground flex items-center gap-3 text-xl font-black tracking-tight uppercase italic">
                <Icon
                  name="keyboard_arrow_right"
                  className="text-muted-foreground/40 text-[20px]"
                />
                <Skeleton className="bg-muted h-6 w-52 rounded-md" />
              </h2>
              <div className="space-y-2">
                <Skeleton className="bg-muted h-4 w-full rounded-md" />
                <Skeleton className="bg-muted h-4 w-full rounded-md" />
                <Skeleton className="bg-muted h-4 w-2/3 rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
