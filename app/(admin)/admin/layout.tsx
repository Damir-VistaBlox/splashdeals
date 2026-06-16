import { Icon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import * as React from "react";
import "../globals.css";
import { Fira_Sans, Fira_Code } from "next/font/google";
import { cn } from "@/lib/utils";

import { AdminSidebar } from "@/components/admin/sidebar/admin-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { BreadcrumbProvider } from "@/components/admin/breadcrumb-context"
import { AdminLayoutShell } from "./_components/AdminLayoutShell"
import { Suspense } from "react"
import { CommandPalette } from "@/components/admin/CommandPalette"

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Splashdeals.rs Admin",
  description: "The premier digital ticketing portal for Serbian water parks and pools.",
  openGraph: {
    title: "Splashdeals.rs Admin",
    description: "The premier digital ticketing portal for Serbian water parks and pools.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

import { auth } from "@/server/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export default async function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={cn("dark", firaSans.variable, firaCode.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#020617] text-slate-100 selection:bg-cyan-500/20 font-sans">
        <BreadcrumbProvider>
          <Suspense fallback={<AdminSkeleton />}>
            <AdminGuard>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AdminGuard>
          </Suspense>
        </BreadcrumbProvider>
      </body>
    </html>
  );
}

async function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return <>{children}</>;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset className="overflow-hidden">
        <AdminLayoutShell user={session.user}>
          <React.Suspense fallback={
            <div className="flex flex-1 items-center justify-center min-h-[50vh]">
              <Icon name="progress_activity" className="text-[40px] animate-spin text-primary/30" />
            </div>
          }>
            {children}
          </React.Suspense>
        </AdminLayoutShell>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  )
}

/**
 * 🛡️ Admin Security Gate (RBAC)
 */
async function AdminGuard({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  // RBAC: Only SUPER_ADMIN and FACILITY_STAFF are allowed in /admin
  const user = session.user as { role?: string; email?: string };
  const role = user.role;
  const isAuthorized = role === "SUPER_ADMIN" || role === "FACILITY_STAFF";

  if (!isAuthorized) {
    console.warn(`[Security] Unauthorized access attempt by ${session.user.email} (Role: ${role})`);
    redirect("/auth/login?error=unauthorized");
  }

  return <>{children}</>;
}

/**
 * 💀 High-Fidelity Admin Skeleton (Zero-CLS)
 */
function AdminSkeleton() {
  return (
    <div className="flex h-screen w-full bg-[#020617]">
      {/* Sidebar Placeholder */}
      <div className="hidden lg:flex w-[19rem] flex-col border-r border-white/5 bg-slate-900/10 p-4 space-y-6">
        <div className="h-10 w-3/4 bg-white/5 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 w-full bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header Placeholder (Matching AdminLayoutShell) */}
        <div className="h-14 border-b border-white/5 bg-slate-950/50 flex items-center px-6 gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-4 w-px bg-white/10" />
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
          <div className="ml-auto flex items-center gap-4">
             <div className="h-6 w-24 bg-white/5 rounded animate-pulse hidden md:block" />
             <div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>
        
        {/* Main Content Area Placeholder */}
        <div className="flex-1 p-6 space-y-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-xl border border-white/5 bg-slate-900/20 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 h-[400px] rounded-xl border border-white/5 bg-slate-900/20 animate-pulse" />
            <div className="h-[400px] rounded-xl border border-white/5 bg-slate-900/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
