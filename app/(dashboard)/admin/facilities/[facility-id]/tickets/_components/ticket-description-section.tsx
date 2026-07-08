"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface TicketDescriptionSectionProps<T extends FieldValues> {
  control: Control<T>;
}

/**
 * Accordion section: description + fine print textareas.
 */
export function TicketDescriptionSection<T extends FieldValues>({
  control,
}: TicketDescriptionSectionProps<T>) {
  return (
    <AccordionItem
      value="description_section"
      className="border-border/50 bg-muted/10 hover:bg-muted/20 overflow-hidden rounded-2xl border px-4 transition-all"
    >
      <AccordionTrigger className="text-foreground/90 py-4 text-sm font-bold hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          Opis i Sitna Slova
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-5">
        <FormField
          control={control}
          name={"finePrint" as Path<T>}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-muted-foreground text-xs font-semibold">
                Važne Napomene (Sitna slova)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Npr. Nema povraćaja novca, samo radnim danima..."
                  className="bg-background/60 border-border text-foreground/80 focus:border-primary/50 min-h-[70px] rounded-xl text-xs leading-relaxed placeholder-slate-600"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
