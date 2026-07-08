"use client";
import { Icon } from "@/components/ui/Icon";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getClientDictionary } from "@/lib/client-dictionaries";
import type { Dict } from "@/lib/types";

interface RouteErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  subtitleKey?: string;
  isModal?: boolean;
}

export function RouteErrorBoundary({
  error,
  reset,
  subtitleKey,
  isModal = false,
}: RouteErrorBoundaryProps) {
  const [dict, setDict] = useState<Dict | null>(null);

  useEffect(() => {
    console.error("Route Error Boundary Captured:", error);
    getClientDictionary().then(setDict);
  }, [error]);

  // Simple placeholder matching background color while dictionary loads
  if (!dict) {
    return (
      <div
        className={
          isModal
            ? "flex items-center justify-center rounded-3xl bg-[#020617] p-8"
            : "min-h-screen bg-[#020617]"
        }
      />
    );
  }

  const customSubtitle = subtitleKey ? dict.errors[subtitleKey] : null;
  const subtitle = customSubtitle || dict.errors.subtitle;

  if (isModal) {
    return (
      <div className="bg-navy-deep/80 mx-auto flex max-w-lg items-center justify-center rounded-[2.5rem] border border-white/5 p-6 backdrop-blur-md selection:bg-cyan-500/20">
        <div className="w-full space-y-6 p-6 text-center">
          <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Icon name="error" className="stroke-[1.5] text-[32px]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl leading-none font-black tracking-tighter text-slate-100 uppercase italic">
              {dict.errors.title} <span className="text-cyan-400">{dict.errors.highlight}</span>
            </h3>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-400">{subtitle}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={reset}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-white/10 px-4 py-3 text-[9px] font-black tracking-widest text-white uppercase transition-all hover:bg-white/15"
            >
              <Icon name="refresh" className="text-[14px]" />
              {dict.errors.try_again}
            </button>
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-3 text-[9px] font-black tracking-widest text-[#020617] uppercase shadow-xl shadow-cyan-500/10 transition-all hover:bg-cyan-400"
            >
              <Icon name="home" className="text-[14px]" />
              {dict.errors.back_home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#020617] p-6 text-white selection:bg-cyan-500/20 md:p-12">
      {/* 🌊 Atmospheric Background Particles */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="waves" className="h-[60vw] w-[60vw] stroke-[0.1] text-slate-900" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <Card className="space-y-8 border-cyan-500/10 bg-white/5 p-8 text-center md:p-16">
          <div className="relative mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Icon name="error" className="stroke-[1.5] text-[40px]" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl leading-none font-black tracking-tighter text-slate-100 uppercase italic md:text-4xl">
              {dict.errors.title} <br />
              <span className="text-cyan-400">{dict.errors.highlight}</span>
            </h1>
            <p className="mx-auto max-w-sm text-base leading-relaxed text-slate-400">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/10 px-6 py-3.5 text-[9px] font-black tracking-widest text-white uppercase transition-all hover:bg-white/15"
            >
              <Icon name="refresh" className="text-[16px]" />
              {dict.errors.try_again}
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3.5 text-[9px] font-black tracking-widest text-[#020617] uppercase shadow-xl shadow-cyan-500/10 transition-all hover:bg-cyan-400"
            >
              <Icon name="home" className="text-[16px]" />
              {dict.errors.back_home}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
