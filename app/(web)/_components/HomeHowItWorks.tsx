import { Icon } from "@/components/ui/Icon";

type HomeDict = Record<string, string>;

export function HomeHowItWorks({ dict }: { dict: HomeDict }) {
  const steps = [
    { step: "1", title: dict.step1_title, desc: dict.step1_desc, icon: "location_on" },
    { step: "2", title: dict.step2_title, desc: dict.step2_desc, icon: "shopping_bag" },
    { step: "3", title: dict.step3_title, desc: dict.step3_desc, icon: "qr_code_scanner" },
  ];

  return (
    <section
      id="how-it-works"
      className="border-border mx-auto max-w-7xl scroll-mt-28 border-t px-3 py-8 max-md:scroll-mt-36 sm:px-6 sm:py-20 md:px-8"
    >
      <div className="mb-6 text-center sm:mb-14">
        <p className="text-primary mb-2 text-[10px] font-black tracking-[0.2em] uppercase">
          Od telefona do ulaza
        </p>
        <h2 className="mb-2 text-[clamp(1.65rem,6vw,3.5rem)] leading-[0.95] font-black tracking-tighter uppercase italic">
          {dict.steps_title_base}
          <span className="text-primary">{dict.steps_title_highlight}</span>
        </h2>
        <p className="text-muted-foreground text-[13px] font-medium sm:text-base">
          {dict.steps_subtitle}
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-10">
        {steps.map((item) => (
          <li
            key={item.step}
            className="surface-glass relative flex items-start gap-4 rounded-[1.55rem] border border-white/70 p-4 text-left shadow-[0_18px_30px_rgba(15,23,42,0.06)] md:block md:border-0 md:bg-transparent md:p-0 md:text-left md:shadow-none md:backdrop-blur-none"
          >
            <span className="text-primary/15 pointer-events-none absolute -top-4 left-0 hidden text-6xl font-black select-none md:block">
              {item.step}
            </span>
            <div className="bg-primary/10 flex h-13 w-13 shrink-0 items-center justify-center rounded-[1rem] md:relative md:z-10 md:mx-0 md:mt-6 md:mb-5">
              <Icon name={item.icon} className="text-primary text-[24px]" />
            </div>
            <div className="relative z-10 min-w-0 md:pt-0">
              <p className="text-primary bg-primary/10 mb-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.14em] uppercase md:hidden">
                Korak {item.step}
              </p>
              <h3 className="mb-1 text-[1.05rem] leading-tight font-black tracking-tight uppercase italic sm:text-xl">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
