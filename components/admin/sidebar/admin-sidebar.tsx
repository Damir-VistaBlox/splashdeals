"use client"
import { Icon } from "@/components/ui/Icon";

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { SearchForm } from "./search-form"

import { adminNavData as data } from "@/config/admin-nav"

function SidebarNavItems() {
  const rawPathname = usePathname() || ""
  const pathname = rawPathname.replace(/^\/(en|rs)/, "") || "/"
  const { data: session } = authClient.useSession()
  const userRole = session?.user?.role
  
  return (
    <>
      {data.navMain.map((item) => {
        // Filter sub-items based on role
        const visibleSubItems = item.items?.filter(subItem => 
          !subItem.requiredRole || subItem.requiredRole === userRole
        ) || [];

        if (visibleSubItems.length === 0) return null;

        const isFlat = visibleSubItems.length === 1;
        const checkUrl = isFlat ? visibleSubItems[0].url : item.url;
        const isActive = checkUrl === "/admin" 
          ? pathname === "/admin" 
          : pathname.startsWith(checkUrl);

        // Facility Context Detection
        const facilityIdMatch = pathname.match(/\/admin\/facilities\/([^\/]+)/);
        const currentFacilityId = facilityIdMatch ? facilityIdMatch[1] : null;
        const isInsideFacility = !!currentFacilityId && currentFacilityId !== "new";
        const isFacilityManagement = item.title === "Facilities Registry";

        const mainGroup = (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen={isActive}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <Icon name="keyboard_arrow_right" className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {isFacilityManagement && (
                      <SidebarMenuItem className="px-2 py-1">
                        <SearchForm />
                      </SidebarMenuItem>
                    )}
                    {visibleSubItems.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === subItem.url}
                        >
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        );

        return mainGroup;
      })}
    </>
  )
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  const user = session?.user;
  const userInitials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "AD";
  const userRoleDisplay = user?.role === "SUPER_ADMIN" ? "Super Admin" : "Partner Staff";

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-950 border border-white/10 text-cyan-400">
            <span className="font-bold text-lg tracking-tight">SD</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-sm tracking-tight text-white uppercase">Splashdeals</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-cyan-400 font-black tracking-widest uppercase">Admin</span>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-[9px] text-muted-foreground/75 font-mono tracking-tighter uppercase">v1.1</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <React.Suspense fallback={
          <div className="p-4 space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="h-8 w-full bg-sidebar-accent/20 rounded animate-pulse" />
             ))}
          </div>
        }>
          <SidebarNavItems />
        </React.Suspense>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="p-4 border-t border-white/5 space-y-4 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
          <div className="relative shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-cyan-500/20">
              {isPending ? <Icon name="progress_activity" className="text-[12px] animate-spin" /> : userInitials}
            </div>
            {!isPending && <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">
              {isPending ? "Loading..." : user?.name || "Administrator"}
            </span>
            <span className="text-[9px] text-muted-foreground truncate font-mono uppercase opacity-60">
              {isPending ? "Verification..." : userRoleDisplay}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all shrink-0"
            title="Sign Out"
          >
            {isLoggingOut ? <Icon name="progress_activity" className="text-[12px] animate-spin" /> : <Icon name="logout" className="text-[14px]" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-muted-foreground font-mono tracking-tight uppercase">
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse",
              user?.role === "SUPER_ADMIN" ? "bg-cyan-500" : "bg-blue-500"
            )} />
            {user?.role === "SUPER_ADMIN" ? "Mode: Master" : "Mode: Operator"}
          </div>
          <span className="opacity-75">SD-RSA-2026</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
