"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/types";
import { subscribeToNewsletter } from "@/app/(server)/lib/actions/newsletter";

export function FooterNewsletterForm({ dict }: { dict: Dict | null }) {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null);
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    if (state?.success) {
      setTimeout(() => setEmail(""), 0);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            {dict?.footer?.newsletter_sr || "E-mail adresa za obaveštenja"}
          </label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict?.footer?.email_placeholder || "Vaša E-mail adresa"}
            className="h-11 border-white/70 bg-white/78 text-base md:text-xs"
          />
          <input type="hidden" name="source" value="footer" />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="flex h-11 min-w-[90px] items-center justify-center rounded-xl px-6 text-xs font-black tracking-tighter uppercase shadow-sm transition-opacity disabled:opacity-50"
          aria-label={dict?.footer?.newsletter_aria || "Pretplatite se na obaveštenja"}
        >
          {isPending ? (
            <Icon name="progress_activity" className="animate-spin text-[16px]" />
          ) : state?.success ? (
            <Icon name="check_circle" className="text-[16px]" />
          ) : (
            dict?.footer?.join_button || "Pridruži se"
          )}
        </Button>
      </div>
      {state?.message && (
        <p
          className={cn(
            "mt-2 text-[10px] font-black tracking-widest uppercase transition-opacity duration-300",
            state.success ? "text-primary" : "text-destructive",
          )}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
