import { getDictionary } from "@/lib/dictionaries";
import { AccountPortalNav } from "@/components/account/AccountPortalNav";
import { StaffRoleBanner } from "@/components/account/StaffRoleBanner";
import { headers } from "next/headers";
import { auth } from "@/app/(server)/lib/auth";
import { isStaffOrOwnerRole } from "@/lib/auth/account-paths";
import { redirect } from "next/navigation";
import { buildPrijavaUrl } from "@/lib/auth/callback-url";

/**
 * Authenticated buyer portal chrome:
 * desktop sidebar + mobile horizontal chips (not a second BottomNav).
 * Mobile: compact padding + short chip labels for 390px.
 */
export default async function AccountPortalLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary();
  const t = dict.account;
  const labels = {
    portalSkip: t.portal_skip ?? "Preskoči na sadržaj naloga",
    portalEyebrow: t.portal_eyebrow ?? "Splashdeals account",
    title: t.title ?? "Moj nalog",
    welcomeBack:
      t.welcome_back ?? "Sve vaše kupovine, sačuvani objekti i profil su spremni na jednom mestu.",
    logout: t.odjava ?? "Odjava",
    tickets: t.moje_karte ?? "Moje karte",
    ticketChip: t.chip_tickets ?? "Karte",
    history: t.istorija ?? "Istorija kupovina",
    historyChip: t.chip_history ?? "Istorija",
    favorites: t.omiljeni ?? "Omiljeni objekti",
    favoritesChip: t.chip_favorites ?? "Omiljeni",
    reviews: t.moje_recenzije ?? "Moje recenzije",
    reviewsChip: t.chip_reviews ?? "Recenzije",
    profile: t.profile ?? "Nalog",
    profileChip: t.chip_profile ?? "Nalog",
  };
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect(buildPrijavaUrl("/moje-karte"));
  }

  const links = [
    {
      href: "/moje-karte",
      label: labels.tickets,
      mobileLabel: labels.ticketChip,
      icon: "confirmation_number",
    },
    {
      href: "/moje-karte/istorija",
      label: labels.history,
      mobileLabel: labels.historyChip,
      icon: "history",
    },
    {
      href: "/omiljeni",
      label: labels.favorites,
      mobileLabel: labels.favoritesChip,
      icon: "favorite",
    },
    {
      href: "/moje-recenzije",
      label: labels.reviews,
      mobileLabel: labels.reviewsChip,
      icon: "star",
    },
    {
      href: "/nalog",
      label: labels.profile,
      mobileLabel: labels.profileChip,
      icon: "person",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-3 sm:gap-6 sm:px-8 sm:py-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-10">
      <a
        href="#account-portal-content"
        className="sr-only focus:not-sr-only focus:rounded-xl focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900"
      >
        {labels.portalSkip}
      </a>
      <AccountPortalNav
        links={links}
        title={labels.title}
        logoutLabel={labels.logout}
        dict={dict}
      />
      <div
        id="account-portal-content"
        tabIndex={-1}
        className="min-w-0 flex-1 space-y-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:space-y-6 sm:pb-8"
      >
        <div className="border-border/70 from-background via-background to-primary/5 rounded-[1.75rem] border bg-gradient-to-br px-4 py-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] sm:px-5 sm:py-5">
          <p className="text-muted-foreground text-[10px] font-black tracking-[0.24em] uppercase">
            {labels.portalEyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
            {labels.title}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed font-medium">
            {labels.welcomeBack}
          </p>
        </div>
        {isStaffOrOwnerRole(session?.user?.role) ? (
          <StaffRoleBanner dict={dict} role={session?.user?.role} />
        ) : null}
        <div className="from-background via-background to-muted/20 rounded-[1.75rem] bg-gradient-to-b p-0 lg:rounded-none lg:bg-none">
          {children}
        </div>
      </div>
    </div>
  );
}
