import { requireAccountSession } from "@/lib/auth/require-account-session";
import { getDictionary } from "@/lib/dictionaries";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import type { Metadata } from "next";
import { ProfileNameForm } from "./_components/ProfileNameForm";
import { prisma } from "@/app/(server)/lib/prisma";

export const metadata: Metadata = {
  title: "Nalog",
  robots: { index: false, follow: false },
};

function initials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  }
  return (email?.[0] || "?").toUpperCase();
}

export default async function NalogPage() {
  const session = await requireAccountSession("/nalog");
  const dict = await getDictionary();
  const t = dict.account as Record<string, string>;
  const labels = {
    title: t.profile ?? t.title ?? "Nalog",
    description: t.profile_desc ?? "Pregled i podešavanja vašeg profila",
    userFallback: t.profile_user_fallback ?? "Korisnik",
    emailVerified: t.email_verified ?? "Email potvrđen",
    emailUnverified: t.email_unverified ?? "Email nije potvrđen",
    verifiedBadge: t.profile_verified_badge ?? "Potvrđen email",
    pendingBadge: t.profile_pending_badge ?? "Email na proveri",
    providerEmail: t.provider_email ?? "Email",
    editProfile: t.edit_profile ?? "Izmena profila",
    displayName: t.display_name ?? "Ime za prikaz",
    displayNameHint: t.display_name_hint ?? "Ime koje će biti prikazano na kartama i recenzijama.",
    displayNameValidation: t.display_name_validation ?? "Unesite ime sa najmanje 2 karaktera.",
    save: t.save_profile ?? "Sačuvaj",
    saving: t.saving ?? "Čuvanje…",
    profileSaved: t.profile_saved ?? "Profil sačuvan",
    saveError: t.profile_save_error ?? "Greška pri čuvanju",
    linkedProviders: t.linked_providers ?? "Povezani nalozi",
    quickLinks: t.quick_links ?? "Brze prečice",
    privacy: t.privacy_link ?? "Politika privatnosti",
    terms: t.terms_link ?? "Uslovi korišćenja",
    tickets: t.moje_karte ?? "Moje karte",
    favorites: t.omiljeni ?? "Omiljeni",
    reviews: t.moje_recenzije ?? "Recenzije",
    history: t.istorija ?? "Istorija",
    charactersLeft: t.characters_left ?? "Preostalo karaktera",
  };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      role: true,
      accounts: { select: { providerId: true } },
    },
  });

  const displayName = user?.name || session.user.name || "";
  const email = user?.email || session.user.email || "";
  const image = user?.image || session.user.image;
  const providers = user?.accounts?.map((a) => a.providerId) || [];

  const quickLinks = [
    { href: "/moje-karte", label: labels.tickets, icon: "confirmation_number" },
    { href: "/omiljeni", label: labels.favorites, icon: "favorite" },
    { href: "/moje-recenzije", label: labels.reviews, icon: "star" },
    { href: "/moje-karte/istorija", label: labels.history, icon: "history" },
  ];

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
          {labels.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">{labels.description}</p>
      </div>

      <Card className="border-border from-background to-muted/20 flex flex-col gap-4 rounded-[1.85rem] bg-gradient-to-br p-4 shadow-[0_20px_56px_-42px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <Avatar className="size-16 ring-4 ring-white/80 sm:size-16">
          {image ? <AvatarImage src={image} alt="" /> : null}
          <AvatarFallback className="text-base font-bold sm:text-lg">
            {initials(displayName, email)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-base font-black sm:text-lg">
            {displayName || labels.userFallback}
          </p>
          <p className="text-muted-foreground truncate text-sm break-all">{email}</p>
          <p className="text-muted-foreground text-xs">
            {user?.emailVerified ? labels.emailVerified : labels.emailUnverified}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto sm:justify-end">
          <span className="bg-muted text-foreground rounded-full px-3 py-1 text-[10px] font-black tracking-wide uppercase">
            {providers[0] || labels.providerEmail}
          </span>
          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-black tracking-wide uppercase">
            {user?.emailVerified ? labels.verifiedBadge : labels.pendingBadge}
          </span>
        </div>
      </Card>

      <Card className="border-border space-y-4 rounded-[1.75rem] p-4 sm:p-6">
        <h2 className="text-sm font-black tracking-widest uppercase">{labels.editProfile}</h2>
        <ProfileNameForm
          initialName={displayName}
          labels={{
            name: labels.displayName,
            hint: labels.displayNameHint,
            validation: labels.displayNameValidation,
            save: labels.save,
            saving: labels.saving,
            success: labels.profileSaved,
            error: labels.saveError,
            characters_left: labels.charactersLeft,
          }}
        />
      </Card>

      {providers.length > 0 ? (
        <Card className="border-border space-y-3 rounded-[1.75rem] p-4 sm:p-6">
          <h2 className="text-sm font-black tracking-widest uppercase">{labels.linkedProviders}</h2>
          <ul className="space-y-2">
            {providers.map((p) => (
              <li
                key={p}
                className="border-border bg-muted/30 flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium capitalize"
              >
                <Icon name="link" className="text-primary size-4 shrink-0" />
                <span className="truncate">{p}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-sm font-black tracking-widest uppercase">{labels.quickLinks}</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-border hover:border-primary/40 hover:bg-muted/20 flex min-h-11 items-center gap-3 rounded-[1.3rem] border px-4 py-3 text-sm font-bold transition-colors"
            >
              <Icon name={link.icon} className="text-primary size-5 shrink-0" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground pb-2 text-xs leading-relaxed">
        <Link href="/privacy" className="underline underline-offset-2">
          {labels.privacy}
        </Link>
        {" · "}
        <Link href="/terms" className="underline underline-offset-2">
          {labels.terms}
        </Link>
      </p>
    </div>
  );
}
