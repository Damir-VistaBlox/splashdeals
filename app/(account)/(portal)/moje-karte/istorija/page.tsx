import { prisma } from "@/app/(server)/lib/prisma";
import { getDictionary } from "@/lib/dictionaries";
import { requireAccountSession } from "@/lib/auth/require-account-session";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Istorija kupovina",
  robots: { index: false, follow: false },
};

async function getUserHistory(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    include: {
      issuedTickets: {
        include: {
          ticketPrice: {
            include: {
              ticketType: {
                include: {
                  category: { include: { facility: { select: { name: true } } } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function IstorijaPage() {
  const session = await requireAccountSession("/moje-karte/istorija");
  const dict = await getDictionary();
  const t = dict.account;
  const labels = {
    title: t.istorija ?? "Istorija kupovina",
    description: t.history_desc ?? "Sve kupovine, računi i karte na jednom mestu.",
    noHistory: t.no_history ?? "Još uvek nemate istoriju kupovina.",
    browseFacilities: t.history_empty_cta ?? t.browse_facilities ?? "Pogledaj aktuelne ponude",
    orderRef: t.order_ref ?? "Porudžbina",
    facility: t.facility ?? "Objekat",
    itemCount: t.history_item_count ?? "Broj karata",
    openOrder: t.open_order ?? "Otvori porudžbinu",
  };

  const transactions = await getUserHistory(session.user.id);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
          {labels.title}
        </h1>
        <p className="text-muted-foreground text-sm font-medium">{labels.description}</p>
      </div>

      {transactions.length === 0 ? (
        <Card className="border-border flex flex-col items-center gap-4 rounded-[1.75rem] p-8 text-center sm:p-12">
          <Icon name="history" className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm font-medium">{labels.noHistory}</p>
          <Link
            href="/akva-parkovi"
            className="bg-primary text-primary-foreground inline-flex h-11 min-h-11 items-center rounded-full px-6 text-sm font-bold"
          >
            {labels.browseFacilities}
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const firstTicket = tx.issuedTickets[0];
            const facilityName =
              firstTicket?.ticketPrice?.ticketType?.category?.facility?.name || labels.facility;
            return (
              <Link key={tx.id} href={`/orders/${tx.id}`} className="block">
                <Card className="border-border hover:border-primary/30 hover:bg-muted/20 rounded-[1.6rem] p-4 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-bold">{facilityName}</p>
                      <p className="text-muted-foreground text-[11px] font-medium">
                        {labels.orderRef}: {tx.orderRef}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {tx.createdAt.toLocaleDateString("sr-Latn")}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-primary text-sm font-black">
                        {Number(tx.totalAmount).toLocaleString("sr-RS")} RSD
                      </p>
                      <p className="text-muted-foreground text-[10px] font-medium">
                        {labels.itemCount}: {tx.issuedTickets.length}
                      </p>
                    </div>
                  </div>
                  <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
                      {labels.openOrder}
                    </span>
                    <Icon name="arrow_forward" className="text-primary size-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
