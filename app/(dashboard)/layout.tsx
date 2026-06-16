import "@/app/globals.css";
import * as React from "react";
import { Fira_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" className={cn("dark font-sans", firaSans.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased bg-[#020617] text-slate-100 selection:bg-cyan-500/20 font-sans">
        {children}
      </body>
    </html>
  );
}
