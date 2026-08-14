"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { isSafeCallbackPath } from "@/lib/auth/callback-url";
import { authClient } from "@/lib/auth-client";
import type { BuyerSocialProvider } from "@/lib/auth/social-providers";

interface SignInButtonsProps {
  dict: Record<string, any>;
  /** Server-resolved safe relative path for post-login return. */
  callbackUrl?: string;
  /** Only providers with credentials configured (server-resolved). */
  providers: BuyerSocialProvider[];
}

type ProviderId = BuyerSocialProvider["id"];

/**
 * Social sign-in for /prijava.
 * Better Auth social login is POST /api/auth/sign-in/social (not /oauth2/authorize).
 */
export function SignInButtons({ dict, callbackUrl, providers }: SignInButtonsProps) {
  const safeCallback = isSafeCallbackPath(callbackUrl) ? callbackUrl : "/moje-karte";
  const [pending, setPending] = useState<ProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const labels = {
    signInError: dict.sign_in_error || "Prijava nije uspela. Pokušajte ponovo.",
    unavailable: dict.sign_in_unavailable || "Prijava trenutno nije dostupna. Pokušajte kasnije.",
    signingIn: dict.signing_in || "Prijava...",
  };

  const handleSignIn = async (provider: ProviderId) => {
    setError(null);
    setPending(provider);
    try {
      const { error: authError } = await authClient.signIn.social({
        provider,
        callbackURL: safeCallback,
        errorCallbackURL: `/prijava?callbackUrl=${encodeURIComponent(safeCallback)}&error=oauth`,
      });
      if (authError) {
        setError(authError.message || labels.signInError);
        setPending(null);
      }
    } catch {
      setError(labels.signInError);
      setPending(null);
    }
  };

  if (providers.length === 0) {
    return <p className="text-muted-foreground text-center text-sm">{labels.unavailable}</p>;
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </p>
      ) : null}

      {providers.map((provider) => {
        const isPending = pending === provider.id;
        return (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            disabled={pending !== null}
            onClick={() => void handleSignIn(provider.id)}
            className="border-border hover:bg-muted flex h-12 w-full items-center justify-center gap-3 rounded-full text-sm font-bold transition-colors"
            aria-busy={isPending}
          >
            <Icon
              name={isPending ? "progress_activity" : provider.icon}
              className={`size-5 ${isPending ? "animate-spin" : ""}`}
            />
            {isPending ? labels.signingIn : dict[provider.labelKey]}
          </Button>
        );
      })}
    </div>
  );
}
