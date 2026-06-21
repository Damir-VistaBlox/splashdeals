import "@/app/globals.css"
import * as React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground selection:bg-cyan-500/20 font-sans">
      {children}
    </div>
  )
}
