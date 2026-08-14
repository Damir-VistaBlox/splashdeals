import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

type HomeDict = Record<string, string>;

const ITEMS = [
  { icon: "lock", title: "trust_1_title", desc: "trust_1_desc" },
  { icon: "bolt", title: "trust_2_title", desc: "trust_2_desc" },
  { icon: "apartment", title: "trust_3_title", desc: "trust_3_desc" },
  { icon: "support_agent", title: "trust_4_title", desc: "trust_4_desc" },
] as const;

export function HomeTrustStrip({ dict }: { dict: HomeDict }) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-7 sm:px-6 sm:py-12 md:px-12">
      <div className="mb-5 text-center sm:mb-6">
        <p className="text-primary mb-1 text-[10px] font-black tracking-[0.18em] uppercase">
          Sigurna kupovina
        </p>
        <h2 className="text-[1.7rem] leading-none font-black tracking-tighter uppercase italic sm:text-3xl">
          {dict.trust_title}
        </h2>
      </div>
      <div className="relative">
        <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <Card
              key={item.title}
              variant="glass"
              className="w-[84vw] max-w-[19rem] min-w-[84vw] snap-start rounded-[1.45rem] border-white/70 p-4 shadow-[0_18px_32px_rgba(15,23,42,0.06)] sm:w-auto sm:min-w-0"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem]">
                  <Icon name={item.icon} className="text-[18px]" />
                </div>
                <div>
                  <h3 className="mb-1 text-[11px] font-black tracking-[0.12em] uppercase">
                    {dict[item.title]}
                  </h3>
                  <p className="text-muted-foreground text-[12px] leading-relaxed">
                    {dict[item.desc]}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div
          className="from-background pointer-events-none absolute top-0 right-0 bottom-1 w-10 bg-gradient-to-l to-transparent sm:hidden"
          aria-hidden
        />
      </div>
    </section>
  );
}
