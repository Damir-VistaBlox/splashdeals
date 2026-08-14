"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

type SearchBoxProps = {
  dict?: Record<string, any>;
  initialQuery?: string;
  className?: string;
  autoFocus?: boolean;
};

export function SearchBox({
  dict,
  initialQuery = "",
  className,
  autoFocus = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();
  const canSubmit = trimmedQuery.length >= 2;
  const searchDict = dict?.search;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className || "relative"}
      role="search"
      aria-label={searchDict?.form_aria || searchDict?.heading || "Pretraga"}
    >
      <Icon
        name="search"
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        enterKeyHint="search"
        placeholder={searchDict?.short_placeholder || "Pretraži objekte, blog..."}
        aria-label={searchDict?.sr_label || "Pretražite objekte, gradove ili sadržaj"}
        className="h-13 w-full rounded-full border-white/70 bg-white/88 pr-29 pl-11 text-sm font-semibold shadow-sm placeholder:font-medium"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!canSubmit}
        className="absolute top-1/2 right-1.5 h-10 min-w-22 -translate-y-1/2 touch-manipulation rounded-full px-3.5 text-[10px] font-black tracking-[0.14em] uppercase shadow-sm"
      >
        {searchDict?.submit_cta || searchDict?.heading || "Pretraga"}
      </Button>
    </form>
  );
}
