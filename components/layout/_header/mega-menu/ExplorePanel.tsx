"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/Icon"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { CityGrid } from "./CityGrid"

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

interface ExplorePanelProps {
  featured: FeaturedFacility | null
  cities: { id: string; name: string; slug: string }[]
  loading: boolean
  dict: any
}

export function ExplorePanel({
  featured,
  cities,
  loading,
  dict,
}: ExplorePanelProps) {
  const categories = [
    { href: "/facilities/waterpark", icon: "waves" as const, label: "Akva Parkovi" },
    { href: "/facilities/swimming-pool", icon: "waves" as const, label: "Bazeni" },
    { href: "/facilities/wellness", icon: "auto_awesome" as const, label: "Wellness & Spa" },
    { href: "/#deals", icon: "local_fire_department" as const, label: "Sve Akcije" },
  ]

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
      {/* Featured Promo */}
      <div className="flex flex-col gap-2">
        {featured ? (
          <Link
            href={featured.canonicalPath}
            className="group relative flex flex-col justify-end rounded-lg overflow-hidden border bg-muted/30 hover:bg-muted/50 transition-colors min-h-[280px] p-4"
          >
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Istaknuto</span>
            <h3 className="text-sm font-bold mt-1 leading-tight">{featured.name}</h3>
            {featured.startingPrice && (
              <span className="text-xs text-muted-foreground mt-1">
                od {featured.startingPrice} RSD
              </span>
            )}
          </Link>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 min-h-[280px] p-4">
            <p className="text-xs text-muted-foreground text-center">
              Premium ponuda
            </p>
          </div>
        )}
      </div>

      {/* City Grid */}
      <div>
        <CityGrid cities={cities} loading={loading} dict={dict} />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Kategorije
        </span>
        {categories.map(({ href, icon: iconName, label }) => (
          <NavigationMenuLink key={href} asChild>
            <Link
              href={href}
              className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted transition-colors"
            >
              <Icon name={iconName} className="size-4 text-primary shrink-0" />
              <span>{label}</span>
            </Link>
          </NavigationMenuLink>
        ))}
        <NavigationMenuLink asChild>
          <Link
            href="/support"
            className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted transition-colors mt-2"
          >
            <Icon name="help" className="size-4 shrink-0" />
            <span>Korisnička Pomoć</span>
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  )
}
