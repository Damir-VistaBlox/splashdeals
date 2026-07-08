"use client";
import { Icon } from "@/components/ui/Icon";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
} from "@/components/ui/sidebar";
export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q")?.toString();
    if (query) {
      router.push(`/admin/facilities?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form {...props} onSubmit={handleSearch}>
      <SidebarGroup className="py-2">
        <SidebarGroupLabel className="text-muted-foreground/50 mb-1 px-2 text-[10px] font-bold tracking-wider uppercase">
          Search Network
        </SidebarGroupLabel>
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search Facilities
          </Label>
          <SidebarInput
            id="search"
            name="q"
            placeholder="Find a partner..."
            className="bg-sidebar-accent/30 focus-visible:ring-primary/50 border-none pl-8 focus-visible:ring-1"
          />
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-30 transition-opacity select-none group-focus-within:opacity-100"
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
