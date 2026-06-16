import { ReactNode } from "react"
import Link from "next/link"
import { Icon } from "@/components/ui/Icon"

export default function FacilitiesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb-style back navigation */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-3">
        <Link
          href="/admin/facilities"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
        >
          <Icon name="arrow_back" className="text-[14px]" />
          <span>All Facilities</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
