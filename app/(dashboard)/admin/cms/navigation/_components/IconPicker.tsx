"use client"

import { useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const COMMON_ICONS = [
  "explore", "waves", "auto_awesome", "local_fire_department", "business_center",
  "smartphone", "article", "login", "verified_user", "qr_code", "help",
  "help_outline", "rss_feed", "book", "newspaper", "star", "arrow_forward",
  "shopping_bag", "check_circle", "qr_code_scanner", "menu_book", "travel_explore",
  "pool", "water", "spa", "celebration", "confirmation_number", "discount",
  "percent", "flash_on", "whatshot", "favorite", "thumb_up", "info",
  "announcement", "campaign", "bolt", "rocket_launch", "diamond",
]

interface IconPickerProps {
  value?: string | null
  onChange: (icon: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = COMMON_ICONS.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {value && (
          <div className="flex size-8 items-center justify-center rounded-md border bg-muted/30">
            <Icon name={value} className="size-4" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-9 flex-1 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-muted-foreground hover:bg-accent"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <Icon name={value} className="size-4" />
              {value}
            </span>
          ) : (
            "Izaberite ikonu..."
          )}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-lg border bg-popover p-3 shadow-lg">
            <Input
              placeholder="Pretraži ikone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 h-8 text-xs"
              autoFocus
            />
            <ScrollArea className="h-48">
              <div className="grid grid-cols-6 gap-1">
                {filtered.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={`flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-accent ${
                      value === name ? "bg-accent ring-1 ring-primary" : ""
                    }`}
                    title={name}
                  >
                    <Icon name={name} className="size-4" />
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-6 py-4 text-center text-xs text-muted-foreground">
                    Nema rezultata
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  )
}
