import { Icon } from "@/components/ui/Icon";
import { getDictionary } from "@/lib/dictionaries";

export default async function AccountLoading() {
  const dict = await getDictionary();
  const t = dict.account;
  const labels = {
    loading: t.loading ?? "Učitavanje...",
    description: t.loading_description ?? "Pripremamo vaš nalog i poslednje aktivnosti.",
  };

  return (
    <div className="mobile-route-frame flex items-center justify-center px-4 py-6 sm:px-6">
      <div className="bg-card/78 border-border shadow-soft flex w-full max-w-sm flex-col items-center gap-4 rounded-[1.75rem] border px-6 py-7 text-center backdrop-blur-sm">
        <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon name="refresh" className="size-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-semibold">{labels.loading}</p>
          <p className="text-muted-foreground text-sm">{labels.description}</p>
        </div>
      </div>
    </div>
  );
}
