"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/Icon"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"

interface City {
  id: string
  name: string
  slug: string
}

interface CityGridProps {
  cities: City[]
  loading: boolean
  dict: any
}

const POPULAR_SLUGS = [
  "belgrade",
  "beograd",
  "novi-sad",
  "jagodina",
  "vrnjacka-banja",
  "subotica",
]

export function CityGrid({ cities, loading, dict }: CityGridProps) {
  const sortedCities = React.useMemo(() => {
    if (!cities || !Array.isArray(cities)) return []
    const popular = cities.filter((c) =>
      POPULAR_SLUGS.includes(c.slug.toLowerCase())
    )
    const others = cities.filter(
      (c) => !POPULAR_SLUGS.includes(c.slug.toLowerCase())
    )
    return [...popular, ...others]
  }, [cities])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {dict?.nav?.cities || "Gradovi i Regije"}
        </span>
        <span className="text-[10px] font-medium text-primary flex items-center gap-1">
          <Icon name="auto_awesome" className="size-3" />
          Popularno
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-1.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1.5">
          {sortedCities.slice(0, 12).map((city) => {
            const isPopular = POPULAR_SLUGS.includes(city.slug.toLowerCase())
            return (
              <NavigationMenuLink key={city.id} asChild>
                <Link
                  href={`/search?q=${encodeURIComponent(city.name)}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isPopular
                      ? "text-primary bg-primary/5 hover:bg-primary/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "size-1.5 rounded-full shrink-0",
                    isPopular ? "bg-primary" : "bg-muted-foreground/40"
                  )} />
                  <span className="truncate">{city.name}</span>
                </Link>
              </NavigationMenuLink>
            )
          })}
          {sortedCities.length > 12 && (
            <NavigationMenuLink asChild>
              <Link
                href="/facilities"
                className="flex items-center justify-center rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                +{sortedCities.length - 12} gradova
              </Link>
            </NavigationMenuLink>
          )}
        </div>
      )}
    </div>
  )
}
