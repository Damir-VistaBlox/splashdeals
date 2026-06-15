import { Icon } from "@/components/ui/Icon";
 
 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OnboardFacilityForm } from "./_components/onboard-facility-form"
import { Metadata } from "next"
import { requireSuperAdmin } from "@/lib/auth-guards"

export const metadata: Metadata = {
  title: "Onboard Facility | Splashdeals Admin",
  description: "Register a new waterpark or facility to the Splashdeals marketplace.",
}

export default async function NewFacilityPage() {
  await requireSuperAdmin({ redirect: true })
  
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-7xl w-full mx-auto">
      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button variant="outline" size="icon" asChild className="rounded-xl border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <Link href="/admin/facilities">
            <Icon name="keyboard_arrow_left" className="text-[16px]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboard New Facility</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Register a new waterpark, pool, or thermal bath into the global network.
          </p>
        </div>
      </div>

      <OnboardFacilityForm />
    </div>
  )
}
