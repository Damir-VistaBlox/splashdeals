"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/Icon"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

/* ─── Types ─────────────────────────────────────────── */

interface NavigationMenuData {
  id: string
  label: string
  icon: string
  sections: NavigationMenuSectionData[]
}

interface NavigationMenuSectionData {
  id: string
  heading: string | null
  column: number
  style: "LINKS" | "DOT_LINKS" | "DYNAMIC_CITIES" | "FOOTER_BADGE" | "VISUAL"
  config: Record<string, unknown> | null
  items: NavigationMenuItemData[]
}

interface NavigationMenuItemData {
  id: string
  label: string
  href: string | null
  icon: string | null
  desc: string | null
  metadata: LinkMetadata | null
}

interface LinkMetadata {
  badge?: { type: string; text?: string }
  price?: string
  variant?: "default" | "featured" | "cta"
  imageUrl?: string
  count?: number
  accentColor?: string
  external?: boolean
}

interface City {
  id: string
  name: string
  slug: string
}

interface DiscoveryMenuData {
  cities: City[]
  featured: { id: string; name: string; canonicalPath: string; startingPrice: number | null; description: string } | null
}

/* ─── Internal helpers ──────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-3 font-semibold text-muted-foreground text-sm">{children}</h4>
}

function BadgeChip({ badge }: { badge: { type: string; text?: string } | undefined }) {
  if (!badge) return null

  const config: Record<string, { label: string; className: string }> = {
    new: { label: badge.text || "Novo", className: "bg-cyan-500/15 text-cyan-500 border-cyan-500/20" },
    sale: { label: badge.text || "Akcija", className: "bg-red-500/15 text-red-500 border-red-500/20" },
    popular: { label: badge.text || "Popularno", className: "bg-amber-500/15 text-amber-500 border-amber-500/20" },
    soon: { label: badge.text || "Uskoro", className: "bg-purple-500/15 text-purple-500 border-purple-500/20 border-dashed" },
    custom: { label: badge.text || "", className: "bg-primary/10 text-primary border-primary/20" },
  }

  const cfg = config[badge.type] || config.custom

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full border ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

/** Render an item link or a disabled span when href is "#" or null */
function NavItemLink({
  href,
  icon,
  title,
  desc,
  metadata,
}: {
  href: string | null
  icon?: string | null
  title: string
  desc?: string | null
  metadata?: LinkMetadata | null
}) {
  const md = metadata || {}
  const isFeatured = md.variant === "featured"
  const isCta = md.variant === "cta"
  const hasAccent = !!md.accentColor
  const isExternal = !!md.external
  const isDisabled = !href || href === "#"

  const linkContent = (
    <div className="flex flex-row items-start gap-2 rounded-sm p-2 text-sm transition-all outline-none group w-full">
      {hasAccent && <span className="w-0.5 shrink-0 self-stretch rounded-full mt-0.5" style={{ backgroundColor: md.accentColor }} />}
      {icon && <Icon name={icon} className="size-5 shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="block font-medium truncate">{title}</span>
          <BadgeChip badge={md.badge} />
          {isExternal && <Icon name="open_in_new" className="size-3 shrink-0 text-muted-foreground" />}
        </div>
        {(desc || md.price) && (
          <span className="block text-muted-foreground">{md.price || desc}</span>
        )}
      </div>
      {md.count != null && md.count > 0 && (
        <span className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-[10px] font-bold shrink-0 mt-0.5">
          {md.count}
        </span>
      )}
      {md.imageUrl && (
        <div className="size-10 shrink-0 rounded-md overflow-hidden border mt-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={md.imageUrl} alt={title} loading="lazy" className="size-full object-cover" />
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return (
      <li role="none">
        <span
          role="menuitem"
          aria-disabled="true"
          className={cn(
            "flex cursor-default opacity-70",
            isFeatured && "bg-accent/30",
            isCta && "text-primary font-medium"
          )}
        >
          {linkContent}
        </span>
      </li>
    )
  }

  return (
    <li role="none">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "flex",
            isFeatured && "bg-accent/30",
            isCta && "text-primary font-medium"
          )}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
          prefetch={false}
          title={desc || title}
        >
          {linkContent}
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

function MenuDotLink({ href, label, metadata }: { href: string; label: string; metadata?: LinkMetadata | null }) {
  const md = metadata || {}
  const isDisabled = !href || href === "#"

  const dotLinkContent = (
    <span className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-all outline-none group w-full">
      <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0" aria-hidden="true" />
      <span className="truncate flex-1">{label}</span>
      {md.count != null && md.count > 0 && (
        <span className="text-xs text-muted-foreground">({md.count})</span>
      )}
    </span>
  )

  if (isDisabled) {
    return (
      <li role="none">
        <span role="menuitem" aria-disabled="true" className="flex cursor-default opacity-70">
          {dotLinkContent}
        </span>
      </li>
    )
  }

  return (
    <li role="none">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex"
          prefetch={false}
          title={label}
        >
          {dotLinkContent}
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

function CitySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-1.5" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-9 rounded-sm bg-muted/50 animate-pulse" />
      ))}
    </div>
  )
}

/* ─── Visual blocks ─────────────────────────────────── */

function ScannerBlock() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border bg-muted/10 p-6 text-center">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon name="qr_code_scanner" className="size-6 text-primary" />
      </div>
      <div>
        <span className="block text-sm font-medium">Skeniranje uspešno</span>
        <span className="block text-xs text-muted-foreground mt-0.5">Ulaznica #PETR-401A je verifikovana</span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
        <Icon name="check_circle" className="size-3" />
        Validirano
      </span>
    </div>
  )
}

function ClubCardBlock() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border bg-muted/10 p-6 text-center">
      <div className="w-28 aspect-[2/3] rounded-xl bg-gradient-to-b from-primary/10 to-muted border p-3 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between border-b pb-1.5">
          <span className="text-[7px] font-bold text-primary uppercase">Splash Club</span>
          <Icon name="waves" className="size-2.5 text-primary" />
        </div>
        <div className="text-center">
          <span className="text-[6px] font-medium text-muted-foreground uppercase block">Članska Kartica</span>
          <span className="text-[10px] font-bold uppercase block mt-0.5">PREMIUM PRO</span>
        </div>
        <div className="border-t pt-1.5 flex flex-col items-center">
          <Icon name="qr_code" className="size-6" />
          <span className="text-[4px] text-muted-foreground mt-0.5">#SPLASH-PASS</span>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
        <Icon name="auto_awesome" className="size-3" />
        Splash Club
      </span>
    </div>
  )
}

function FooterBadge({ heading, icon }: { heading?: string | null; icon?: string }) {
  if (!heading) return null
  return (
    <div className="pt-4 mt-4 border-t">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon && <Icon name={icon} className="size-3 text-primary" />}
        {heading}
      </span>
    </div>
  )
}

/* ─── Constants ─────────────────────────────────────── */

const POPULAR_CITY_SLUGS = [
  "belgrade", "beograd", "novi-sad", "jagodina", "vrnjacka-banja", "subotica",
]

/* ─── Component ─────────────────────────────────────── */

export function MegaMenu() {
  const [menus, setMenus] = useState<NavigationMenuData[]>([])
  const [discovery, setDiscovery] = useState<DiscoveryMenuData>({ cities: [], featured: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, discoveryRes] = await Promise.all([
          fetch("/api/menu/navigation"),
          fetch("/api/menu/discovery"),
        ])
        const menuData = await menuRes.json()
        const discoveryData = await discoveryRes.json()
        if (menuData.menus) setMenus(menuData.menus)
        if (discoveryData) setDiscovery(discoveryData)
      } catch (error) {
        console.error("Menu fetch failed:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const sortedCities = React.useMemo(() => {
    if (!discovery.cities || !Array.isArray(discovery.cities)) return []
    const popular = discovery.cities.filter((c) =>
      POPULAR_CITY_SLUGS.includes(c.slug.toLowerCase())
    )
    const others = discovery.cities.filter(
      (c) => !POPULAR_CITY_SLUGS.includes(c.slug.toLowerCase())
    )
    return [...popular, ...others]
  }, [discovery.cities])

  return (
    <nav aria-label="Glavna navigacija">
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {menus.length === 0 ? (
            <li className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
              {loading ? (
                <div className="h-5 w-32 animate-pulse rounded bg-muted" aria-label="Učitavanje menija" />
              ) : (
                "Meni nije dostupan"
              )}
            </li>
          ) : (
            menus.map((menu) => (
              <NavigationMenuItem key={menu.id}>
                <NavigationMenuTrigger className="h-9 px-3 py-1.5 text-xs font-bold uppercase tracking-wider gap-1.5 data-[state=open]:text-primary rounded-xl transition-colors">
                  <Icon name={menu.icon} className="size-4 text-primary/70" aria-hidden="true" />
                  {menu.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[900px] p-6">
                    <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
                      {[0, 1, 2].map((column) => {
                        const sections = menu.sections.filter((s) => s.column === column)
                        return (
                          <div key={column} className="space-y-4">
                            {sections.map((section) => {
                              const config = section.config as Record<string, unknown> | null

                              return (
                                <section key={section.id} aria-labelledby={section.heading ? `nav-h-${section.id}` : undefined}>
                                  {/* Section heading — hidden for VISUAL and FOOTER_BADGE */}
                                  {section.style !== "VISUAL" && section.style !== "FOOTER_BADGE" && section.heading && (
                                    <SectionHeading>
                                      <span id={`nav-h-${section.id}`}>{section.heading}</span>
                                    </SectionHeading>
                                  )}

                                  <ul className="space-y-2" role="menu" aria-label={section.heading || menu.label}>
                                    {/* LINKS: icon + title + desc */}
                                    {section.style === "LINKS" && section.items.map((item) => (
                                      <NavItemLink
                                        key={item.id}
                                        href={item.href}
                                        icon={item.icon}
                                        title={item.label}
                                        desc={item.desc}
                                        metadata={item.metadata}
                                      />
                                    ))}

                                    {/* DOT_LINKS: bullet-dot links */}
                                    {section.style === "DOT_LINKS" && section.items.map((item) => (
                                      <MenuDotLink
                                        key={item.id}
                                        href={item.href || "#"}
                                        label={item.label}
                                        metadata={item.metadata}
                                      />
                                    ))}

                                    {/* DYNAMIC_CITIES: auto-populated from API — link to real facility pages */}
                                    {section.style === "DYNAMIC_CITIES" && (
                                      <>
                                        {loading ? (
                                          <li><CitySkeleton /></li>
                                        ) : (
                                          sortedCities.slice(0, (config?.maxItems as number) || 10).map((city) => (
                                            <MenuDotLink
                                              key={city.id}
                                              href={`/akva-parkovi?city=${city.slug}`}
                                              label={city.name}
                                            />
                                          ))
                                        )}
                                        {sortedCities.length > ((config?.maxItems as number) || 10) && (
                                          <MenuDotLink
                                            href="/akva-parkovi"
                                            label={`+${sortedCities.length - ((config?.maxItems as number) || 10)} gradova`}
                                          />
                                        )}
                                      </>
                                    )}

                                    {/* VISUAL: branded blocks */}
                                    {section.style === "VISUAL" && (
                                      <li>
                                        {config?.component === "scanner" && <ScannerBlock />}
                                        {config?.component === "club_card" && <ClubCardBlock />}
                                      </li>
                                    )}

                                    {/* FOOTER_BADGE: border-top badge */}
                                    {section.style === "FOOTER_BADGE" && (
                                      <li>
                                        <FooterBadge heading={section.heading} icon={config?.icon as string | undefined} />
                                      </li>
                                    )}
                                  </ul>
                                </section>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
