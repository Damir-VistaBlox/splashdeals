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
  const labels = {
    title: t.sign_in_title ?? "Prijava na SplashDeals",
    description: t.sign_in_desc ?? "Prijavite se putem jednog od naloga",
    badge: t.sign_in_badge ?? "Brza prijava",
    error: t.sign_in_error ?? "Prijava nije uspela. Pokušajte ponovo.",
    note: t.sign_in_note ?? "Posle prijave vraćamo vas na karte i čuvamo aktivnu kupovinu.",
    benefitTickets: t.sign_in_benefit_tickets ?? "Karte odmah u nalogu",
    benefitHistory: t.sign_in_benefit_history ?? "Istorija i računi na jednom mestu",
    benefitSupport: t.sign_in_benefit_support ?? "Brža podrška za postojeće kupovine",
  };
  const sp = await searchParams;
  const callbackUrl = isSafeCallbackPath(sp.callbackUrl) ? sp.callbackUrl : "/moje-karte";

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect(callbackUrl);
  }

  const oauthError = sp.error ? labels.error : null;
  const providers = getEnabledBuyerSocialProviders();

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-3 py-8 sm:min-h-[60vh] sm:px-4 sm:py-12">
      <div className="border-border from-background via-background to-muted/30 w-full max-w-sm space-y-6 rounded-[1.75rem] border bg-gradient-to-b p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)] sm:space-y-8 sm:p-8">
        <div className="space-y-3 text-center">
          <p className="text-muted-foreground text-[10px] font-black tracking-[0.22em] uppercase">
            {labels.badge}
          </p>
          <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-full">
            <span className="text-lg font-black">SD</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
            {labels.title}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">{labels.description}</p>
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

        <div className="grid gap-2 rounded-[1.35rem] border border-white/70 bg-white/70 p-3 text-left">
          <p className="text-foreground text-xs font-black tracking-[0.18em] uppercase">
            Splashdeals account
          </p>
          <p className="text-muted-foreground text-sm">{labels.benefitTickets}</p>
          <p className="text-muted-foreground text-sm">{labels.benefitHistory}</p>
          <p className="text-muted-foreground text-sm">{labels.benefitSupport}</p>
        </div>

        <p className="text-muted-foreground text-center text-xs leading-relaxed">{labels.note}</p>
      </div>
    </div>
  );
}
