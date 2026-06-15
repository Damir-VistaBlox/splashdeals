"use client"
import { Icon } from "@/components/ui/Icon";

import * as React from "react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
// Generic public-facing navigation data
const publicNavData = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: "home",
    },
    {
      title: "Facilities",
      url: "/facilities",
      icon: "location_on",
    },
    {
      title: "About",
      url: "/about",
      icon: "info",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter italic uppercase text-splash">
          Splashdeals
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicNavData.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <Icon name={item.icon} className="text-[16px]" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          Web Edition
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
