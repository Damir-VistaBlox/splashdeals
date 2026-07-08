"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketStatusSectionProps<T extends FieldValues> {
  control: Control<T>;
  ticketGroups: { id: string; title: string }[];
}

/**
 * Accordion section: status toggles, group assignment, sale date window.
 */
export function TicketStatusSection<T extends FieldValues>({
  control,
  ticketGroups,
}: TicketStatusSectionProps<T>) {
  return (
    <AccordionItem
      value="governance"
      className="border-border/50 bg-muted/10 hover:bg-muted/20 overflow-hidden rounded-2xl border px-4 transition-all"
    >
      <AccordionTrigger className="text-foreground/90 py-4 text-sm font-bold hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          Status i Podešavanja
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-5">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name={"isActive" as Path<T>}
            render={({ field }) => (
              <FormItem className="border-border/50 bg-background/40 flex items-center justify-between gap-2 space-y-0 rounded-xl border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-foreground/80 text-xs font-bold">Aktivna</FormLabel>
                  <span className="text-muted-foreground block text-[9px] tracking-wider uppercase">
                    Na sajtu
                  </span>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-90"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={"isFeatured" as Path<T>}
            render={({ field }) => (
              <FormItem className="border-border/50 bg-background/40 flex items-center justify-between gap-2 space-y-0 rounded-xl border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-foreground/80 text-xs font-bold">Izdvojena</FormLabel>
                  <span className="text-muted-foreground block text-[9px] tracking-wider uppercase">
                    Vrh liste
                  </span>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-90"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name={"groupId" as Path<T>}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-muted-foreground text-xs font-semibold">
                Grupa Ulaznica
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "none"}>
                <FormControl>
                  <SelectTrigger className="bg-muted/30 border-border text-foreground/90 h-10 rounded-xl px-3.5 text-xs">
                    <SelectValue placeholder="Izaberite grupu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-muted border-border text-foreground/90">
                  <SelectItem value="none" className="focus:bg-primary/20 text-xs">
                    Nema grupe (Pojedinačna karta)
                  </SelectItem>
                  {ticketGroups?.map((g) => (
                    <SelectItem key={g.id} value={g.id} className="focus:bg-primary/20 text-xs">
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name={"saleStart" as Path<T>}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Početak Prodaje
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value || ""}
                    className="bg-background/60 border-border text-foreground/80 h-10 rounded-xl px-3 text-xs"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={"saleEnd" as Path<T>}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Kraj Prodaje
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value || ""}
                    className="bg-background/60 border-border text-foreground/80 h-10 rounded-xl px-3 text-xs"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
