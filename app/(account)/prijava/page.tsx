import { getDictionary } from "@/lib/dictionaries";
import { isSafeCallbackPath } from "@/lib/auth/callback-url";
import { SignInButtons } from "./_components/SignInButtons";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/(server)/lib/auth";
import { getEnabledBuyerSocialProviders } from "@/lib/auth/social-providers";

export const metadata: Metadata = {
  title: "Prijava",
  robots: { index: false, follow: false },
};

/**
 * Buyer sign-in — platform shell, no portal subnav.
 * Compact card on 390px; main already has pb-16 for BottomNav.
 */
export default async function PrijavaPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const dict = await getDictionary();
  const t = dict.account;
  const sp = await searchParams;
  const callbackUrl = isSafeCallbackPath(sp.callbackUrl) ? sp.callbackUrl : "/moje-karte";

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect(callbackUrl);
  }

  const oauthError = sp.error ? t.sign_in_error || "Prijava nije uspela. Pokušajte ponovo." : null;
  const providers = getEnabledBuyerSocialProviders();

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-3 py-8 sm:min-h-[60vh] sm:px-4 sm:py-12">
      <div className="border-border w-full max-w-sm space-y-6 rounded-xl border p-5 sm:space-y-8 sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
            {t.sign_in_title}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">{t.sign_in_desc}</p>
        </div>

        {oauthError ? (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-3 py-2 text-center text-sm font-medium"
          >
            {oauthError}
          </p>
        ) : null}

        <SignInButtons dict={t} callbackUrl={callbackUrl} providers={providers} />
      </div>
    </div>
  );
}
