"use client"

import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"

interface UsersPanelProps {
  dict: any
}

export function UsersPanel({ dict }: UsersPanelProps) {
  const links = [
    {
      href: "/how-it-works",
      icon: "explore" as const,
      title: "Kako funkcioniše platforma?",
      desc: "Vodič za brzu kupovinu karata i čuvanje u Apple & Google Wallet novčanik.",
    },
    {
      href: "/support",
      icon: "help_outline" as const,
      title: "Centar za Pomoć & FAQ",
      desc: "Brzi odgovori na pitanja o refundacijama, slanju ulaznica i radnom vremenu.",
    },
    {
      href: "/terms",
      icon: "verified_user" as const,
      title: "Pravila i sigurnost kupovine",
      desc: "Bezbedno 3D Secure procesiranje platnih kartica i zaštita potrošača u Srbiji.",
    },
  ]

  return (
    <div className="grid grid-cols-[1fr_1.5fr] gap-6">
      {/* Wallet Pass Mockup */}
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/20 p-6 text-center gap-3">
        <div className="w-32 aspect-[2/3] rounded-xl bg-gradient-to-b from-primary/20 to-background border p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b pb-1.5">
            <span className="text-[8px] font-bold text-primary uppercase">Splash Club</span>
            <Icon name="waves" className="size-2.5 text-primary" />
          </div>
          <div className="text-center">
            <span className="text-[7px] font-medium text-muted-foreground uppercase block">Članska Kartica</span>
            <span className="text-[10px] font-bold uppercase block mt-0.5">PREMIUM PRO</span>
          </div>
          <div className="border-t pt-1.5 flex flex-col items-center">
            <Icon name="qr_code" className="size-6" />
            <span className="text-[5px] text-muted-foreground mt-0.5">#SPLASH-PASS</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-full">
          Splash Club
          <Icon name="auto_awesome" className="size-3" />
        </span>
      </div>

      {/* User Links */}
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Korisnički Portal
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
            <Icon name="waves" className="size-3 text-primary" />
            100% digitalne ulaznice na telefonu
          </span>
        </div>
      </div>
    </div>
  )
}
