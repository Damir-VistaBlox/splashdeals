import { prisma } from "@/app/(server)/lib/prisma";
import { getDictionary } from "@/lib/dictionaries";
import { requireAccountSession } from "@/lib/auth/require-account-session";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moje karte",
  robots: { index: false, follow: false },
};

async function getUserTickets(userId: string) {
  return prisma.issuedTicket.findMany({
    where: { userId },
    include: {
      ticketPrice: {
        include: {
          ticketType: {
            include: {
              category: {
                include: { facility: { select: { id: true, name: true, slug: true } } },
              },
            },
          },
        },
      },
      transaction: { select: { orderRef: true, totalAmount: true, createdAt: true } },
    },
    orderBy: { expiryDate: "asc" },
  });
}

export default async function MojeKartePage() {
  const session = await requireAccountSession("/moje-karte");
  const dict = await getDictionary();
  const t = dict.account;
  const labels = {
    title: t.moje_karte ?? "Moje karte",
    active: t.active_tickets_label ?? "Aktivne",
    expiring: t.expiring_tickets_label ?? "Uskoro ističu",
    total: t.total_tickets_label ?? "Ukupno kupljeno",
    noTickets: t.no_tickets ?? "Još uvek nemate aktivnih karata.",
    noTicketsDesc: t.no_tickets_desc ?? "Kada kupite karte, one će se pojaviti ovde.",
    browseFacilities: t.browse_facilities ?? "Pogledaj ponudu",
    ticketReady: t.ticket_ready ?? "Spremna za ulaz",
    ticketHolder: t.ticket_holder ?? "Vlasnik karte",
    orderRef: t.order_ref ?? "Porudžbina",
    ticketExpires: t.ticket_expires ?? "Ističe",
    ticketActive: t.ticket_active ?? "Aktivna",
    qrAlt: t.ticket_qr_alt ?? "QR kod ulaznice",
  };

  const tickets = await getUserTickets(session.user.id);
  const activeTickets = tickets.filter(
    (ticket) => ticket.status === "ACTIVE" && ticket.usageCount < ticket.usageLimit,
  );
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const expiringSoonCount = activeTickets.filter(
    (ticket) => ticket.expiryDate < sevenDaysFromNow,
  ).length;

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
            {labels.title}
          </h1>
          <p className="text-muted-foreground mt-1 truncate text-sm font-medium">
            {session.user.name}
          </p>
        </div>
        <Card className="border-border/70 from-background to-muted/40 grid gap-3 rounded-[1.75rem] bg-gradient-to-br p-4 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.38)] sm:grid-cols-3 sm:p-5">
          <div>
            <p className="text-muted-foreground text-[11px] font-black tracking-[0.2em] uppercase">
              {labels.active}
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight">{activeTickets.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-black tracking-[0.2em] uppercase">
              {labels.expiring}
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight">{expiringSoonCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-black tracking-[0.2em] uppercase">
              {labels.total}
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight">{tickets.length}</p>
          </div>
        </Card>
      </div>

      {activeTickets.length === 0 ? (
        <Card className="border-border flex flex-col items-center gap-4 rounded-[1.75rem] p-8 text-center sm:p-12">
          <Icon name="confirmation_number" className="text-muted-foreground size-10 sm:size-12" />
          <div>
            <p className="mb-1 font-bold">{labels.noTickets}</p>
            <p className="text-muted-foreground text-sm">{labels.noTicketsDesc}</p>
          </div>
          <Link
            href="/akva-parkovi"
            className="bg-primary text-primary-foreground inline-flex h-11 min-h-11 items-center rounded-full px-6 text-sm font-bold"
          >
            {labels.browseFacilities}
          </Link>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {activeTickets.map((ticket) => {
            const facility = ticket.ticketPrice?.ticketType?.category?.facility;
            const isExpiring = ticket.expiryDate < sevenDaysFromNow;
            return (
              <Card
                key={ticket.id}
                className="border-border from-background via-background to-muted/25 flex flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br shadow-[0_18px_52px_-40px_rgba(15,23,42,0.38)]"
              >
                <div className="flex items-start justify-between gap-3 border-b p-4">
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
                      {labels.ticketReady}
                    </p>
                    <p className="mt-1 truncate text-sm font-bold">
                      {facility?.name || t.facility || "Objekat"}
                    </p>
                    <p className="text-muted-foreground text-[11px] font-medium">
                      {ticket.ticketPrice?.ticketType?.title}
                    </p>
                  </div>
                  <Badge
                    variant={isExpiring ? "secondary" : "default"}
                    className="shrink-0 rounded-full px-2.5 py-1 text-[9px]"
                  >
                    {isExpiring
                      ? `${labels.ticketExpires} ${ticket.expiryDate.toLocaleDateString("sr-Latn")}`
                      : labels.ticketActive}
                  </Badge>
                </div>
                <div className="flex flex-col gap-4 p-4">
                  <div className="bg-background relative mx-auto aspect-square w-full max-w-[11rem] overflow-hidden rounded-[1.35rem] border p-2 shadow-sm">
                    {ticket.qrHash && (
                      <Image
                        src={`/api/qr/${ticket.qrHash}`}
                        alt={labels.qrAlt}
                        fill
                        className="object-contain p-3"
                      />
                    )}
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-[13px] font-bold">
                      {ticket.holderName || session.user.name || labels.ticketHolder}
                    </p>
                    <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-[11px] font-medium">
                      <Icon name="schedule" className="size-3.5" />
                      {ticket.expiryDate.toLocaleDateString("sr-Latn")}
                    </div>
                  </div>
                  <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-[1rem] border px-3 py-2 text-center text-[10px] font-medium">
                    {ticket.transaction?.orderRef && (
                      <span>
                        {labels.orderRef}: {ticket.transaction.orderRef}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
