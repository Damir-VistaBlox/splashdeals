import "@/app/globals.css";
import * as React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased selection:bg-cyan-500/20">
      {children}
    </div>
  );
}
