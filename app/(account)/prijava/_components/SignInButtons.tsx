"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { isSafeCallbackPath } from "@/lib/auth/callback-url";
import { authClient } from "@/lib/auth-client";

interface SignInButtonsProps {
  dict: Record<string, any>;
  /** Server-resolved safe relative path for post-login return. */
  callbackUrl?: string;
}

const providers = [
  { id: "google", labelKey: "sign_in_google", icon: "login" },
  { id: "facebook", labelKey: "sign_in_facebook", icon: "public" },
  { id: "apple", labelKey: "sign_in_apple", icon: "phone_iphone" },
  { id: "twitter", labelKey: "sign_in_twitter", icon: "alternate_email" },
] as const;

type ProviderId = (typeof providers)[number]["id"];

/**
 * Social sign-in for /prijava.
 * Better Auth social login is POST /api/auth/sign-in/social (not /oauth2/authorize).
 * /oauth2/authorize is the OIDC *provider* plugin endpoint and returns 404 here.
 */
export function SignInButtons({ dict, callbackUrl }: SignInButtonsProps) {
  const safeCallback = isSafeCallbackPath(callbackUrl) ? callbackUrl : "/moje-karte";
  const [pending, setPending] = useState<ProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError(
          authError.message || dict.sign_in_error || "Prijava nije uspela. Pokušajte ponovo.",
        );
        setPending(null);
      }
      // On success Better Auth redirects the browser to the provider.
    } catch {
      setError(dict.sign_in_error || "Prijava nije uspela. Pokušajte ponovo.");
      setPending(null);
    }
  };

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
            className="border-border hover:bg-muted flex h-12 w-full items-center justify-center gap-3 rounded-xl text-sm font-bold transition-colors"
          >
            <Icon
              name={isPending ? "progress_activity" : provider.icon}
              className={`size-5 ${isPending ? "animate-spin" : ""}`}
            />
            {dict[provider.labelKey]}
          </Button>
        );
      })}
    </div>
  );
}
