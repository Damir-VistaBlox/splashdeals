"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/types";
import { subscribeToNewsletter } from "@/app/(server)/lib/actions/newsletter";

export function FooterNewsletterForm({
  dict,
  idSuffix = "",
}: {
  dict: Dict | null;
  /** Disambiguates the input id when this form is mounted more than once in the DOM
   *  at a given time (e.g. separate mobile/desktop footer layouts). */
  idSuffix?: string;
}) {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null);
  const [email, setEmail] = React.useState("");
  const inputId = idSuffix ? `newsletter-email-${idSuffix}` : "newsletter-email";

  React.useEffect(() => {
    if (state?.success) {
      setTimeout(() => setEmail(""), 0);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor={inputId} className="sr-only">
            {dict?.footer?.newsletter_sr || "E-mail adresa za obaveštenja"}
          </label>
          <Input
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict?.footer?.email_placeholder || "Vaša E-mail adresa"}
            className="h-11 w-full border-slate-200/90 bg-white/90 text-base shadow-sm md:text-xs"
          />
          <input type="hidden" name="source" value="footer" />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="flex h-11 w-full min-w-[90px] items-center justify-center rounded-xl px-6 text-xs font-black tracking-tighter uppercase shadow-sm transition-opacity disabled:opacity-50 sm:w-auto"
          aria-label={
            isPending || state?.success
              ? dict?.footer?.newsletter_aria || "Pretplatite se na obaveštenja"
              : undefined
          }
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
