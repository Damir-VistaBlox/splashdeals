"use client";

import Image from "next/image";
import { useBreadcrumbs } from "@/app/(dashboard)/admin/_common/breadcrumb-context";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/app/(dashboard)/admin/_common/breadcrumbs";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export function AdminLayoutShell({ children, user }: AdminLayoutShellProps) {
  const { hideGlobalHeader } = useBreadcrumbs();
  const nodeLabel =
    process.env.NEXT_PUBLIC_ADMIN_NODE_LABEL ||
    (process.env.NODE_ENV === "production" ? "PROD" : "DEV");

  return (
    <>
      <header
        className={cn(
          "admin-global-header border-border/50 bg-background/50 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-xl transition-all duration-300 md:px-6",
          hideGlobalHeader && "pointer-events-none h-0 overflow-hidden border-none opacity-0",
        )}
      >
        <SidebarTrigger className="hover:bg-muted/30 hover:text-primary -ml-2 h-9 w-9 rounded-xl transition-all" />
        <Separator orientation="vertical" className="bg-muted/50 h-4" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <Suspense fallback={<div className="bg-muted/30 h-4 w-32 animate-pulse rounded" />}>
            <div className="truncate whitespace-nowrap">
              <Breadcrumbs />
            </div>
          </Suspense>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted/30 border-border/50 hidden items-center gap-1.5 rounded-md border px-2 py-1 md:flex">
            <div className="bg-primary h-1 w-1 rounded-full" />
            <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
              Node: {nodeLabel}
            </span>
          </div>

          <div className="bg-muted/30 border-border flex items-center gap-2 rounded-full border px-1.5 py-1">
            {user.image ? (
              <div className="border-border relative h-5 w-5 overflow-hidden rounded-full border">
                <Image src={user.image} alt={user.name || ""} fill className="object-cover" />
              </div>
            ) : (
              <div className="bg-primary/20 text-primary border-primary/20 flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-black uppercase">
                {user.name?.[0] || "?"}
              </div>
            )}
            <span className="text-foreground/80 hidden pr-1.5 text-[9px] font-bold tracking-tighter uppercase sm:inline">
              {user.name?.split(" ")[0]}
            </span>
          </div>
        </div>
      </header>
      <main className="flex h-full flex-1 flex-col overflow-y-auto">{children}</main>
    </>
  );
}
