import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/app/(server)/lib/prisma";
import { buildPrijavaUrl } from "@/lib/auth/callback-url";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Digitalna karta | Splashdeals",
  robots: { index: false, follow: false },
};

export default async function VerifyTicketPage(props: { params: Promise<{ hash: string }> }) {
  const { hash } = await props.params;

  const ticket = await prisma.issuedTicket.findUnique({
    where: { qrHash: hash },
    include: {
      transaction: {
        select: {
          id: true,
          orderRef: true,
          createdAt: true,
        },
      },
      ticketPrice: {
        select: {
          label: true,
          ticketType: {
            select: {
              title: true,
              category: {
                select: {
                  title: true,
                  facility: {
                    select: {
                      name: true,
                      city: true,
                      streetName: true,
                      streetNumber: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const facility = ticket.ticketPrice.ticketType.category.facility;
  const ticketTitle = ticket.ticketPrice.label || ticket.ticketPrice.ticketType.title || "Karta";
  const isActive = ticket.status === "ACTIVE" && ticket.usageCount < ticket.usageLimit;
  const callbackPath = `/verify/${hash}`;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-primary text-xs font-black tracking-[0.32em] uppercase">
            Splashdeals Ticket
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{ticketTitle}</h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base">
            Ovo je javni prikaz vaše digitalne karte. Sačuvajte ovu stranicu ili se prijavite da
            pristupite svim kupljenim kartama u nalogu.
          </p>
        </div>

        <Card className="border-border overflow-hidden p-5 sm:p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <Badge variant={isActive ? "default" : "secondary"} className="text-[10px]">
                {isActive ? "AKTIVNA KARTA" : ticket.status}
              </Badge>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-bold tracking-[0.24em] uppercase">
                  Objekat
                </p>
                <p className="text-xl font-black tracking-tight">{facility.name}</p>
                <p className="text-muted-foreground text-sm">
                  {facility.streetName} {facility.streetNumber}, {facility.city}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase">Ticket ID</p>
                  <p className="font-mono text-sm">{ticket.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase">Order Ref</p>
                  <p className="text-sm font-semibold">{ticket.transaction.orderRef}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase">Važi do</p>
                  <p className="text-sm font-semibold">
                    {ticket.expiryDate.toLocaleDateString("sr-RS", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase">Ulaza</p>
                  <p className="text-sm font-semibold">
                    {ticket.usageCount} / {ticket.usageLimit}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 self-center">
              <div className="bg-muted relative aspect-square w-48 overflow-hidden rounded-2xl">
                <Image
                  src={`/api/qr/${ticket.qrHash}`}
                  alt={`QR kod za kartu ${ticket.id}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="bg-background rounded-2xl border p-3">
                <Image
                  src={`/api/barcode/${ticket.id}`}
                  alt={`Code 128 barcode for ticket ${ticket.id}`}
                  width={260}
                  height={88}
                  className="h-auto w-full max-w-[260px]"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-11">
            <Link href={buildPrijavaUrl(callbackPath)}>Prijavite se za sve karte</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11">
            <Link href="/moje-karte">Otvori moj nalog</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
