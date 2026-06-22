"use client";

import { Icon } from "@/components/ui/Icon";

export function ScrollToTicketsButton() {
  return (
    <button
      onClick={() => document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" })}
      className="w-full h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.97] transition-all"
    >
      <span>Uzmi karte</span>
      <Icon name="arrow_downward" className="text-[16px]" />
    </button>
  );
}
