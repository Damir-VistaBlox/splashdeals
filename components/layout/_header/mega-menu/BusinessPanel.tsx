"use client"

import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"

interface BusinessPanelProps {
  dict: any
}

export function BusinessPanel({ dict }: BusinessPanelProps) {
  const links = [
    {
      href: "/facilities",
      icon: "login" as const,
      title: "Pridruži se mreži bazena",
      desc: "Predstavite svoj bazen ili akva park stotinama hiljada aktivnih korisnika u Srbiji.",
    },
    {
      href: "/admin/facilities",
      icon: "verified_user" as const,
      title: "Partner Portal (Admin)",
      desc: "Upravljajte ponudama, pratite skeniranja i vršite isplate direktno preko Stripe panela.",
    },
    {
      href: "/support",
      icon: "qr_code" as const,
      title: "Validacioni Ticketing API",
      desc: "Integracija sa postojećim bar-kod i RFID rampama na vašim kapijama.",
    },
  ]

  return (
    <div className="grid grid-cols-[1fr_1.5fr] gap-6">
      {/* Scanner Mockup */}
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/20 p-6 text-center gap-3">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="qr_code_scanner" className="size-6 text-primary" />
        </div>
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Splash Validator
          </span>
          <p className="text-sm font-medium mt-1">Skeniranje uspešno</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ulaznica #PETR-401A je verifikovana
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-full">
          <Icon name="check_circle" className="size-3" />
          Validirano
        </span>
      </div>

      {/* Partner Links */}
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Partner Hub
        </span>
        {links.map(({ href, icon: iconName, title, desc }) => (
          <NavigationMenuLink key={href} asChild>
            <Link href={href} className="block rounded-md p-2 hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <Icon name={iconName} className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            </Link>
          </NavigationMenuLink>
        ))}
        <div className="pt-3 border-t mt-auto">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Icon name="auto_awesome" className="size-3 text-primary" />
            Provizija samo 5% po prodatoj karti
          </span>
        </div>
      </div>
    </div>
  )
}
