import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type HomeDict = Record<string, string>;

const FAQ_KEYS = [
  ["faq_1_q", "faq_1_a"],
  ["faq_2_q", "faq_2_a"],
  ["faq_3_q", "faq_3_a"],
  ["faq_4_q", "faq_4_a"],
  ["faq_5_q", "faq_5_a"],
  ["faq_6_q", "faq_6_a"],
] as const;

export function HomeFaq({ dict }: { dict: HomeDict }) {
  return (
    <section className="border-border mx-auto max-w-3xl border-t px-3 py-8 sm:px-6 sm:py-16 md:px-8">
      <div className="mb-5 text-center sm:mb-8">
        <h2 className="mb-2 text-[1.9rem] font-black tracking-tighter uppercase italic sm:text-4xl">
          {dict.faq_title}
        </h2>
        <p className="text-muted-foreground text-[13px]">{dict.faq_subtitle}</p>
      </div>
      <Accordion
        type="single"
        collapsible
        defaultValue="faq-0"
        className="w-full rounded-[1.4rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.38))] px-4 py-2 shadow-[0_14px_32px_rgba(15,23,42,0.06)] backdrop-blur-lg"
      >
        {FAQ_KEYS.map(([q, a], i) => (
          <AccordionItem key={q} value={`faq-${i}`}>
            <AccordionTrigger className="min-h-12 py-3 text-left text-sm font-bold tracking-wide">
              {dict[q]}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {dict[a]}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
