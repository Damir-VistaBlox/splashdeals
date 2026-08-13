import type { ReactNode } from "react";
import { CmsNav } from "./_components/cms-nav";
import { Icon } from "@/components/ui/Icon";

/**
 * CMS section chrome — secondary nav for desktop admin.
 * Route groups under cms/ do not appear in the URL.
 */
export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-border/60 bg-muted/15 rounded-2xl border p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="text-primary flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
              <Icon name="edit_note" className="text-[16px]" />
              CMS komandni sloj
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-black tracking-tight uppercase italic">
                Upravljanje sadržajem
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed">
                Objave, strane, navigacija, redirekcije i operativni alati za javni sloj Splashdeals
                platforme.
              </p>
            </div>
          </div>
          <div className="bg-background/60 border-border/60 flex items-center gap-2 rounded-xl border px-3 py-2">
            <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <Icon name="visibility" className="text-[16px]" />
            </span>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase">
              <div className="text-muted-foreground">Javni sloj</div>
              <div className="text-foreground">Aktivna kontrola sadržaja</div>
            </div>
          </div>
        </div>
      </div>
      <CmsNav />
      {children}
    </div>
  );
}
