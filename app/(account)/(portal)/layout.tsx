import { getDictionary } from "@/lib/dictionaries";
import { AccountPortalNav } from "@/components/account/AccountPortalNav";
import { StaffRoleBanner } from "@/components/account/StaffRoleBanner";
import { headers } from "next/headers";
import { auth } from "@/app/(server)/lib/auth";
import { isStaffOrOwnerRole } from "@/lib/auth/account-paths";

/**
 * Authenticated buyer portal chrome:
 * desktop sidebar + mobile horizontal chips (not a second BottomNav).
 * Mobile: compact padding + short chip labels for 390px.
 */
export default async function AccountPortalLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary();
  const t = dict.account;
  const session = await auth.api.getSession({ headers: await headers() });

  const links = [
    {
      href: "/moje-karte",
      label: t.moje_karte || "Moje karte",
      mobileLabel: t.chip_tickets || "Karte",
      icon: "confirmation_number",
    },
    {
      href: "/moje-karte/istorija",
      label: t.istorija || "Istorija kupovina",
      mobileLabel: t.chip_history || "Istorija",
      icon: "history",
    },
    {
      href: "/omiljeni",
      label: t.omiljeni || "Omiljeni objekti",
      mobileLabel: t.chip_favorites || "Omiljeni",
      icon: "favorite",
    },
    {
      href: "/moje-recenzije",
      label: t.moje_recenzije || "Moje recenzije",
      mobileLabel: t.chip_reviews || "Recenzije",
      icon: "star",
    },
    {
      href: "/nalog",
      label: t.profile || "Nalog",
      mobileLabel: t.chip_profile || "Nalog",
      icon: "person",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-8 sm:py-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-10">
      <AccountPortalNav
        links={links}
        title={t.title || "Moj nalog"}
        logoutLabel={t.odjava || "Odjava"}
        dict={dict}
      />
      <div className="min-w-0 flex-1 space-y-4 pb-6 sm:space-y-6 sm:pb-8">
        {isStaffOrOwnerRole(session?.user?.role) ? (
          <StaffRoleBanner dict={dict} role={session?.user?.role} />
        ) : null}
        {children}
      </div>
    </div>
  );
}
