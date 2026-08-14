"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useServerCart } from "@/hooks/use-server-cart";
import { isAccountBottomNavActive } from "@/lib/auth/account-paths";
import { isBottomNavActive } from "@/lib/layout/bottom-nav-active";
import { isBottomNavAlwaysVisible } from "@/lib/layout/bottom-nav-visibility";
import { authClient } from "@/lib/auth-client";
import type { Dict } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SCROLL_THRESHOLD = 10;

type BottomNavItem = {
  label: string;
  href: string;
  icon: string;
  kind: "path" | "account" | "cart";
};

function initials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  }
  return (email?.[0] || "?").toUpperCase();
}

/**
 * 📱 BottomNav — Mobile-only bottom navigation.
 *
 * Početna · Korpa · Nalog/Prijava
 * Search lives in the mobile header. Podrška lives in the footer.
 *
 * Always visible on home, cart, product pages, and whenever the cart has items.
 * Other routes: scroll-hide.
 *
 * Dict is server-passed from PlatformShell (no client dictionary fetch).
 */
export function BottomNav({ dict }: { dict?: Dict | null }) {
  const pathname = usePathname();
  const totalItems = useServerCart((state) => state.totalItems);
  const alwaysVisible = isBottomNavAlwaysVisible(pathname, totalItems);
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const [scrollHidden, setScrollHidden] = useState(false);
  const lastScrollY = useRef(0);
  // Track path for render-time scroll-hide reset (avoids setState-in-effect)
  const [navPath, setNavPath] = useState(pathname);

  // Reset scroll-hide when the route changes (React-approved render-time adjust)
  if (navPath !== pathname) {
    setNavPath(pathname);
    setScrollHidden(false);
  }

  const isVisible = alwaysVisible || !scrollHidden;

  useEffect(() => {
    if (alwaysVisible) return;

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < SCROLL_THRESHOLD) {
        setScrollHidden(false);
      } else if (delta > SCROLL_THRESHOLD) {
        setScrollHidden(true);
      } else if (delta < -SCROLL_THRESHOLD) {
        setScrollHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible, pathname]);

  const NAV_ITEMS: BottomNavItem[] = [
    {
      label: dict?.nav?.home || "Početna",
      href: "/",
      icon: "home",
      kind: "path",
    },
    {
      label: dict?.nav?.cart_mobile || "Korpa",
      href: "/cart",
      icon: "shopping_bag",
      kind: "cart",
    },
    {
      label: isLoggedIn ? dict?.nav?.account_mobile || "Profil" : dict?.nav?.login || "Prijava",
      href: isLoggedIn ? "/moje-karte" : "/prijava",
      icon: "person",
      kind: "account",
    },
  ];

  return (
    <nav
      className="safe-area-bottom fixed inset-x-0 bottom-0 z-[998] px-3 pb-2 transition-transform duration-300 ease-in-out motion-reduce:transition-none md:hidden"
      style={{ transform: isVisible ? "translateY(0)" : "translateY(100%)" }}
      aria-label={dict?.layout?.mobile_nav_aria || "Mobilna navigacija"}
    >
      <div className="relative mx-auto max-w-sm rounded-[1.65rem] border border-white/70 bg-white/86 p-1.5 shadow-[0_-12px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
        <div className="grid h-14 grid-cols-3 items-center gap-1 rounded-[1.2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.28))] px-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.kind === "account"
                ? isAccountBottomNavActive(pathname)
                : isBottomNavActive(pathname, item.href);

            const cartAria =
              item.kind === "cart" && totalItems > 0
                ? `${item.label}, ${totalItems > 99 ? "99+" : totalItems} stavki`
                : item.label;

            return (
              <Link
                key={`${item.kind}-${item.href}`}
                href={item.href}
                className={`relative flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-[1rem] px-1 py-1.5 transition-all duration-200 motion-reduce:transition-none ${
                  active
                    ? "bg-primary/[0.08] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                    : "text-muted-foreground/70 hover:text-muted-foreground hover:bg-white/55"
                } `}
                aria-label={cartAria}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span
                    aria-hidden
                    className="bg-primary absolute top-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full opacity-90"
                  />
                )}
                <div className="relative">
                  {item.kind === "cart" && totalItems > 0 && (
                    <span
                      className="bg-primary text-primary-foreground shadow-primary/30 absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-black shadow-lg"
                      aria-hidden
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                  {item.kind === "account" ? (
                    <div
                      className={`flex h-8.5 w-8.5 items-center justify-center rounded-[1rem] border transition-colors duration-200 motion-reduce:transition-none ${
                        active ? "border-primary/20 bg-primary/10" : "border-white/60 bg-white/58"
                      }`}
                    >
                      {isLoggedIn ? (
                        <Avatar className="size-7">
                          {session?.user?.image ? (
                            <AvatarImage src={session.user.image} alt="" />
                          ) : null}
                          <AvatarFallback className="text-[9px] font-bold">
                            {initials(session?.user?.name, session?.user?.email)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Icon
                          name={item.icon}
                          className={`text-[19px] transition-colors duration-200 motion-reduce:transition-none ${
                            active ? "text-primary" : "text-slate-700"
                          }`}
                        />
                      )}
                    </div>
                  ) : (
                    <Icon
                      name={item.icon}
                      className={`text-[21px] transition-colors duration-200 motion-reduce:transition-none ${
                        active ? "text-primary" : "text-slate-500"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`max-w-full truncate text-[9px] leading-none font-black tracking-[0.08em] uppercase transition-colors duration-200 motion-reduce:transition-none ${
                    active ? "text-primary" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
