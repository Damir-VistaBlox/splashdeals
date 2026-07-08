"use client";
import { Icon } from "@/components/ui/Icon";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
        <Icon name="gpp_maybe" className="text-[40px] text-red-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
          Auth <span className="text-slate-500">Error</span>
        </h1>
        <p className="mx-auto max-w-sm text-sm text-slate-400">
          Something went wrong during authentication.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 px-8 py-4 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-white/10"
        >
          <Icon name="refresh" className="text-[16px]" />
          Try Again
        </Button>
        <Button
          asChild
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-8 py-4 text-[10px] font-black tracking-widest text-[#020617] uppercase transition-all hover:bg-white"
        >
          <Link href="/auth/login">
            <Icon name="login" className="text-[16px]" />
            Go to Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
