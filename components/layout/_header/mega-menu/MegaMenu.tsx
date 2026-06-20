"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Icon } from "@/components/ui/Icon"
import { ExplorePanel } from "./ExplorePanel"
import { BusinessPanel } from "./BusinessPanel"
import { UsersPanel } from "./UsersPanel"

interface City {
  id: string
  name: string
  slug: string
}

interface FeaturedFacility {
  id: string
  name: string
  slug: string
  category: string
  city: string
  canonicalPath: string
  imageUrl: string
  startingPrice: number | null
  description: string
}

interface DiscoveryMenuData {
  cities: City[]
  featured: FeaturedFacility | null
}

interface MegaMenuProps {
  dict: any
}

export function MegaMenu({ dict }: MegaMenuProps) {
  const [data, setData] = useState<DiscoveryMenuData>({ cities: [], featured: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        const response = await fetch("/api/menu/discovery")
        const payload = await response.json()
        if (payload) {
          setData({
            cities: payload.cities || [],
            featured: payload.featured || null,
          })
        }
      } catch (error) {
        console.error("Discovery API failed:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDiscoveryData()
  }, [])

  const menuItems = [
    {
      label: dict?.nav?.explore || "Istraži",
      icon: "explore" as const,
      content: (
        <ExplorePanel
          featured={data.featured}
          cities={data.cities}
          loading={loading}
          dict={dict}
        />
      ),
    },
    {
      label: "Za Biznis",
      icon: "business_center" as const,
      content: <BusinessPanel dict={dict} />,
    },
    {
      label: "Korisnici",
      icon: "smartphone" as const,
      content: <UsersPanel dict={dict} />,
    },
  ]

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuTrigger className="h-9 px-3 py-1.5 text-[13px] font-bold uppercase tracking-wider data-[state=open]:text-primary">
              <Icon name={item.icon} className="size-4 text-primary/70" />
              {item.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-3 w-[920px]">
                {item.content}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
