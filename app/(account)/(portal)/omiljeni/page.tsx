import { prisma } from "@/app/(server)/lib/prisma";
import { getDictionary } from "@/lib/dictionaries";
import { requireAccountSession } from "@/lib/auth/require-account-session";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omiljeni objekti",
  robots: { index: false, follow: false },
};

async function getUserFavorites(userId: string) {
  return prisma.userFavorite.findMany({
    where: { userId },
    include: {
      facility: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          category: true,
          media: {
            where: { type: "PHOTO", isHero: true },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function OmiljeniPage() {
  const session = await requireAccountSession("/omiljeni");
  const dict = await getDictionary();
  const t = dict.account;
  const labels = {
    title: t.omiljeni ?? "Omiljeni objekti",
    description: t.favorites_desc ?? "Sačuvani objekti spremni za brz povratak i kupovinu.",
    noFavorites: t.no_favorites ?? "Nemate omiljenih objekata.",
    browseFacilities: t.browse_facilities ?? "Pogledaj ponudu",
    savedLabel: t.favorites_saved_label ?? "Sačuvano za kasnije",
    imagePlaceholder: t.image_placeholder ?? "Vizuel uskoro",
  };

  const favorites = await getUserFavorites(session.user.id);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
          {labels.title}
        </h1>
        <p className="text-muted-foreground text-sm font-medium">{labels.description}</p>
      </div>

      {favorites.length === 0 ? (
        <Card className="border-border flex flex-col items-center gap-4 rounded-[1.75rem] p-8 text-center sm:p-12">
          <Icon name="favorite" className="text-muted-foreground size-10 sm:size-12" />
          <p className="text-muted-foreground text-sm font-medium">{labels.noFavorites}</p>
          <Link
            href="/akva-parkovi"
            className="bg-primary text-primary-foreground inline-flex h-11 min-h-11 items-center rounded-full px-6 text-sm font-bold"
          >
            {labels.browseFacilities}
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {favorites.map((fav) => {
            const image = fav.facility.media[0];
            return (
              <Card
                key={fav.facility.id}
                className="border-border group relative flex flex-col overflow-hidden rounded-[1.65rem] shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-colors"
              >
                {/* Touch-safe unfavorite — top-right, outside link hit area stacking */}
                <div className="absolute top-2 right-2 z-20">
                  <FavoriteButton
                    facilityId={fav.facility.id}
                    facilitySlug={fav.facility.slug}
                    isFavorited
                    variant="default"
                    className="bg-background/95 border-border relative top-0 left-0 shadow-sm"
                  />
                </div>
                <Link href={`/${fav.facility.slug}`} className="block min-w-0">
                  <div className="relative h-32 w-full overflow-hidden sm:h-36">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={fav.facility.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="bg-muted flex h-full flex-col items-center justify-center gap-2">
                        <Icon name="auto_awesome" className="text-muted-foreground/50 size-8" />
                        <span className="text-muted-foreground text-[10px] font-medium">
                          {labels.imagePlaceholder}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <span className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
                      {labels.savedLabel}
                    </span>
                    <h3 className="group-hover:text-primary line-clamp-2 pr-10 text-sm font-black uppercase transition-colors">
                      {fav.facility.name}
                    </h3>
                    {fav.facility.city && (
                      <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium">
                        <Icon name="location_on" className="text-primary/70 size-[10px] shrink-0" />
                        <span className="truncate">{fav.facility.city}</span>
                      </span>
                    )}
                    <span className="text-muted-foreground text-[10px] font-medium">
                      {fav.facility.category}
                    </span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
