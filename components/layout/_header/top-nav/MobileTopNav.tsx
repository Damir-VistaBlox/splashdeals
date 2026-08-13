"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import type { Dict } from "@/lib/types";

interface MobileTopNavProps {
  dict: Dict;
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
}

function initials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  }
  return (email?.[0] || "?").toUpperCase();
}

export function MobileTopNav({
  dict,
  isTabActive,
  isReducedMotion,
  isHovered,
  setIsHovered,
}: MobileTopNavProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const accountHref = user ? "/moje-karte" : "/prijava";
  const accountLabel = user ? dict.nav.account || "Nalog" : dict.nav.login || "Prijava";

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-2">
        <Logo
          isTabActive={isTabActive}
          isReducedMotion={isReducedMotion}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          dict={dict}
        />

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="bg-white/70 text-slate-700 hover:bg-white h-11 w-11 rounded-2xl border border-white/70 shadow-[0_14px_26px_rgba(15,23,42,0.08)]"
          >
            <Link href="/search" aria-label={dict.nav.search || "Pretraga"}>
              <Icon name="search" className="text-[19px]" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="bg-white/70 text-slate-700 hover:bg-white h-11 w-11 rounded-2xl border border-white/70 shadow-[0_14px_26px_rgba(15,23,42,0.08)]"
          >
            <Link href={accountHref} aria-label={accountLabel}>
              {user ? (
                <Avatar className="size-8">
                  {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="text-[10px] font-bold">
                    {initials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Icon name={isPending ? "hourglass_top" : "person"} className="text-[19px]" />
              )}
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <Link
          href="/search"
          className="group from-white/84 to-white/68 ring-border/50 flex min-h-[3.45rem] items-center gap-3 rounded-[1.4rem] bg-gradient-to-r px-4 shadow-[0_16px_30px_rgba(15,23,42,0.08)] ring-1 backdrop-blur-xl transition-transform duration-200 active:scale-[0.99]"
          aria-label={dict.nav.search || "Pretraga"}
        >
          <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl">
            <Icon name="search" className="text-[18px]" />
          </span>
          <div className="min-w-0">
            <span className="text-foreground block truncate text-sm font-black tracking-[-0.03em]">
              Pretraži ponude
            </span>
            <span className="text-muted-foreground block truncate text-[11px] font-bold tracking-[0.1em] uppercase">
              Akva parkovi, bazeni, wellness
            </span>
          </div>
          <Icon
            name="arrow_forward"
            className="text-muted-foreground group-hover:text-primary ml-auto shrink-0 text-[18px] transition-colors"
          />
        </Link>
      </div>
    </div>
  );
}
