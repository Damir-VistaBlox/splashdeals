"use client"

import { Icon } from "@/components/ui/Icon"
import { cn } from "@/lib/utils"
import type { MenuWithSections, LinkMetadata } from "./types"

/* ─── Internal preview helpers (mirror MegaMenu.tsx) ─── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-3 font-semibold text-muted-foreground text-sm">{children}</h4>
}

function BadgeChip({ metadata }: { metadata: LinkMetadata }) {
  const badge = metadata.badge
  if (!badge) return null

  const config = {
    new: { label: badge.text || "Novo", className: "bg-cyan-500/15 text-cyan-500 border-cyan-500/20" },
    sale: { label: badge.text || "Akcija", className: "bg-red-500/15 text-red-500 border-red-500/20" },
    popular: { label: badge.text || "Popularno", className: "bg-amber-500/15 text-amber-500 border-amber-500/20" },
    soon: { label: badge.text || "Uskoro", className: "bg-purple-500/15 text-purple-500 border-purple-500/20 border-dashed" },
    custom: { label: badge.text || "", className: "bg-primary/10 text-primary border-primary/20" },
  }[badge.type]

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full border ${config.className}`}>
      {config.label}
    </span>
  )
}

function PreviewMenuItem({ item }: { item: { label: string; href?: string | null; icon?: string | null; desc?: string | null; metadata?: unknown } }) {
  const md = (item.metadata || {}) as LinkMetadata
  const hasAccent = !!md.accentColor
  const isExternal = !!md.external
  const isFeatured = md.variant === "featured"
  const isCta = md.variant === "cta"

  return (
    <a
      href={item.href || "#"}
      className={cn(
        "flex flex-row items-start gap-2 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground group",
        isFeatured && "bg-accent/30",
        isCta && "text-primary font-medium"
      )}
    >
      {hasAccent && (
        <span className="w-0.5 shrink-0 self-stretch rounded-full mt-0.5" style={{ backgroundColor: md.accentColor }} />
      )}
      {item.icon && <Icon name={item.icon} className="size-5 shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="block font-medium truncate">{item.label}</span>
          <BadgeChip metadata={md} />
          {isExternal && <Icon name="open_in_new" className="size-3 shrink-0 text-muted-foreground" />}
        </div>
        {(item.desc || md.price) && (
          <span className="block text-muted-foreground text-xs mt-0.5">
            {md.price || item.desc}
          </span>
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
          <img src={md.imageUrl} alt="" className="size-full object-cover" />
        </div>
      )}
    </a>
  )
}

function PreviewDotLink({ item }: { item: { label: string; href?: string | null; metadata?: unknown } }) {
  const md = (item.metadata || {}) as LinkMetadata
  return (
    <a
      href={item.href || "#"}
      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground"
    >
      <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
      <span className="truncate">{item.label}</span>
      {md.count != null && md.count > 0 && (
        <span className="text-xs text-muted-foreground ml-auto">({md.count})</span>
      )}
    </a>
  )
}

function PreviewScannerBlock() {
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

function PreviewClubCardBlock() {
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

function PreviewFooterBadge({ heading, icon }: { heading?: string | null; icon?: string }) {
  return (
    <div className="pt-4 mt-4 border-t">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon && <Icon name={icon} className="size-3 text-primary" />}
        {heading}
      </span>
    </div>
  )
}

/* ─── Main component ────────────────────────────────── */

interface LivePreviewProps {
  menu: MenuWithSections
}

export function LivePreview({ menu }: LivePreviewProps) {
  return (
    <div className="rounded-lg border bg-background shadow-lg overflow-hidden">
      <div className="border-b bg-muted/20 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Icon name="visibility" className="size-3.5" />
        Live Preview — {menu.label}
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="w-[900px] p-6">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
            {[0, 1, 2].map((column) => {
              const sections = menu.sections.filter((s) => s.column === column)
              return (
                <div key={column} className="space-y-4">
                  {sections.map((section) => {
                    const config = section.config as Record<string, unknown> | null

                    return (
                      <div key={section.id}>
                        {section.style !== "FOOTER_BADGE" && section.style !== "VISUAL" && section.heading && (
                          <SectionHeading>{section.heading}</SectionHeading>
                        )}

                        <div className="space-y-2">
                          {section.style === "LINKS" && section.items.map((item) => (
                            <PreviewMenuItem key={item.id} item={item} />
                          ))}

                          {section.style === "DOT_LINKS" && section.items.map((item) => (
                            <PreviewDotLink key={item.id} item={item} />
                          ))}

                          {section.style === "DYNAMIC_CITIES" && (
                            <div className="text-sm text-muted-foreground py-2">
                              [Gradovi — automatski iz baze]
                            </div>
                          )}

                          {section.style === "VISUAL" && config?.component === "scanner" && (
                            <PreviewScannerBlock />
                          )}

                          {section.style === "VISUAL" && config?.component === "club_card" && (
                            <PreviewClubCardBlock />
                          )}

                          {section.style === "FOOTER_BADGE" && (
                            <PreviewFooterBadge heading={section.heading} icon={config?.icon as string | undefined} />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
