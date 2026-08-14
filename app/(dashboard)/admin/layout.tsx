import { Icon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import * as React from "react";

import { AdminSidebar } from "@/app/(dashboard)/admin/_common/sidebar/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BreadcrumbProvider } from "@/app/(dashboard)/admin/_common/breadcrumb-context";
import { AdminLayoutShell } from "./_components/AdminLayoutShell";
import { CommandPalette } from "@/app/(dashboard)/admin/_common/CommandPalette";
import { AdminSkeleton } from "@/app/(dashboard)/admin/_common/AdminSkeleton";
import { auth } from "@/app/(server)/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Splashdeals.rs Admin",
  description: "Vodeći digitalni portal za ulaznice za akva parkove i bazene u Srbiji.",
  openGraph: {
    title: "Splashdeals.rs Admin",
    description: "Vodeći digitalni portal za ulaznice za akva parkove i bazene u Srbiji.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BreadcrumbProvider>
      <React.Suspense fallback={<AdminSkeleton />}>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </React.Suspense>
    </BreadcrumbProvider>
  );
}

async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const user = session.user as { role?: string; email?: string };
  const role = user.role;

  if (role !== "SUPER_ADMIN" && role !== "FACILITY_STAFF") {
    console.warn(`[Security] Unauthorized access attempt by ${session.user.email} (Role: ${role})`);
    redirect("/admin/forbidden");
  }

  await connection();

  return (
    <>
      <div className="bg-background flex min-h-screen items-center justify-center px-6 py-10 lg:hidden">
        <div className="border-border/60 bg-card w-full max-w-md space-y-5 rounded-[2rem] border p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
            <Icon name="desktop_windows" className="text-[28px]" />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              Splashdeals admin
            </p>
            <h1 className="text-foreground text-2xl font-black tracking-tight uppercase italic">
              Desktop obavezan
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Administracija nije podržana na mobilnim viewportima. Otvorite admin na laptopu ili
              desktop uređaju radi potpunog pristupa alatima.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
            } as React.CSSProperties
          }
        >
          <AdminSidebar variant="inset" user={session.user} />
          <SidebarInset className="overflow-hidden">
            <AdminLayoutShell user={session.user}>
              <React.Suspense
                fallback={
                  <div className="flex min-h-[50vh] flex-1 items-center justify-center">
                    <Icon
                      name="progress_activity"
                      className="text-primary/30 size-10 animate-spin"
                    />
                  </div>
                }
              >
                {children}
              </React.Suspense>
            </AdminLayoutShell>
          </SidebarInset>
          <CommandPalette />
        </SidebarProvider>
      </div>
    </>
  );
}
