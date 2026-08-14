"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { resendConfirmationAction } from "@/app/(server)/actions/checkout";

interface TicketData {
  id: string;
  qrHash: string;
  status: string;
  expiryDate: string;
  usageCount: number;
  usageLimit: number;
  holderName: string | null;
  ticketPrice: {
    id: string;
    title: string;
    price: number;
    ticketType: {
      title: string;
      category: {
        name: string;
        facility: {
          id: string;
          name: string;
          slug: string;
        };
      };
    };
  };
}

interface TransactionData {
  id: string;
  orderRef: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  stripeSession: string;
  ticketDetails: unknown;
  facility: { name: string; slug: string } | null;
  issuedTickets: TicketData[];
}

export function OrderDetail({
  transaction,
  dict,
}: {
  transaction: TransactionData;
  dict?: Record<string, any>;
}) {
  const t = (dict?.order_detail as Record<string, any>) || {};
  const account = (dict?.account as Record<string, any>) || {};
  const labels = {
    backToHistory: t.back_to_history ?? account.istorija ?? "Istorija",
    title: t.title ?? "Porudžbina",
    statusCompleted: t.status_completed ?? "Završeno",
    statusPending: t.status_pending ?? "U obradi",
    statusCancelled: t.status_cancelled ?? "Otkazano",
    purchaseDate: t.purchase_date ?? "Datum kupovine",
    facility: t.facility ?? "Objekat",
    unknownFacility: t.unknown_facility ?? "Nepoznato",
    totalPaid: t.total_paid ?? "Ukupno plaćeno",
    ticketsLabel: t.tickets_label ?? "Ulaznice",
    ticketCategoryFallback: t.ticket_category_fallback ?? "Ulaznica",
    ticketTitleFallback: t.ticket_title_fallback ?? "Karta",
    ticketActive: t.ticket_active ?? "Aktivna",
    ticketUsed: t.ticket_used ?? "Iskorišćena",
    ticketInvalid: t.ticket_invalid ?? "Nevažeća",
    validUntil: t.valid_until ?? "Važi do:",
    resendSuccess: t.resend_success ?? "Email sa kartama je ponovo poslat!",
    resendError: t.resend_error ?? "Greška pri slanju email-a.",
    sending: t.sending ?? "Slanje...",
    resendEmail: t.resend_email ?? "Pošalji ponovo email",
    print: t.print ?? "Štampaj",
    addToWallet: t.add_to_wallet ?? "Dodaj u Wallet",
    qrPrefix: t.qr_prefix ?? "QR",
    usageLabel: t.usage_label ?? "Iskorišćeno",
    actionsTitle: t.actions_title ?? "Akcije",
  };
  const [isResending, setIsResending] = useState(false);
  const statusColor =
    transaction.status === "COMPLETED"
      ? "text-primary"
      : transaction.status === "PENDING"
        ? "text-muted-foreground"
        : "text-destructive";

  const formatPrice = (price: number) => new Intl.NumberFormat("sr-RS").format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("sr-RS", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendConfirmationAction(transaction.id);
      if (result.success) {
        toast.success(labels.resendSuccess);
      } else {
        toast.error(labels.resendError);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/moje-karte/istorija"
          className="text-muted-foreground inline-flex min-h-11 items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase"
        >
          <Icon name="arrow_back" className="size-4" />
          {labels.backToHistory}
        </Link>
        <div className="border-border/80 from-background to-muted/20 flex flex-col gap-3 rounded-[1.75rem] border bg-gradient-to-br p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <h1 className="text-foreground text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
              {labels.title}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              #{transaction.orderRef || transaction.id.slice(0, 8)}
            </p>
          </div>
          <div className={`flex items-center gap-2 text-sm font-bold ${statusColor}`}>
            <span className="flex h-2 w-2 rounded-full bg-current" />
            {transaction.status === "COMPLETED"
              ? labels.statusCompleted
              : transaction.status === "PENDING"
                ? labels.statusPending
                : labels.statusCancelled}
          </div>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-muted/20 border-border space-y-4 rounded-[1.75rem] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-muted-foreground">{labels.purchaseDate}</span>
          <span className="text-foreground text-right font-medium">
            {formatDate(transaction.createdAt)}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-muted-foreground">{labels.facility}</span>
          <span className="text-foreground text-right font-medium">
            {transaction.facility?.name || labels.unknownFacility}
          </span>
        </div>
        <div className="border-border flex items-start justify-between gap-4 border-t pt-4 text-base">
          <span className="text-foreground font-bold">{labels.totalPaid}</span>
          <span className="text-foreground text-right text-xl font-black tracking-tight">
            {formatPrice(Number(transaction.totalAmount))} {transaction.currency}
          </span>
        </div>
      </Card>

      {/* Tickets */}
      <div className="space-y-4">
        <h2 className="text-foreground text-sm font-black tracking-widest uppercase">
          {labels.ticketsLabel} ({transaction.issuedTickets.length})
        </h2>
        {transaction.issuedTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="bg-muted/20 border-border overflow-hidden rounded-[1.6rem] shadow-[0_18px_48px_-40px_rgba(15,23,42,0.35)]"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                    {ticket.ticketPrice?.ticketType?.category?.name ||
                      labels.ticketCategoryFallback}
                  </p>
                  <h3 className="text-foreground mt-1 text-lg font-black tracking-tight">
                    {ticket.ticketPrice?.title ||
                      ticket.ticketPrice?.ticketType?.title ||
                      labels.ticketTitleFallback}
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {ticket.ticketPrice?.ticketType?.category?.facility?.name}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                      ticket.status === "ACTIVE"
                        ? "bg-primary/10 text-primary"
                        : ticket.status === "USED"
                          ? "bg-muted/50 text-muted-foreground"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {ticket.status === "ACTIVE"
                      ? labels.ticketActive
                      : ticket.status === "USED"
                        ? labels.ticketUsed
                        : labels.ticketInvalid}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                {ticket.holderName && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Icon name="person" className="text-muted-foreground text-[14px]" />
                    <span className="text-muted-foreground">{ticket.holderName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs">
                  <Icon name="calendar_today" className="text-muted-foreground text-[14px]" />
                  <span className="text-muted-foreground">
                    {labels.validUntil} {formatDate(ticket.expiryDate)}
                  </span>
                </div>
              </div>
              <div className="border-border/70 mt-4 flex items-center justify-between border-t pt-4">
                <p className="text-muted-foreground text-xs font-medium">
                  {labels.qrPrefix} #{ticket.qrHash.slice(0, 8)}
                </p>
                <p className="text-xs font-bold">
                  {labels.usageLabel}: {ticket.usageCount}/{ticket.usageLimit}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h2 className="text-foreground text-sm font-black tracking-widest uppercase">
          {labels.actionsTitle}
        </h2>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            className="h-11 w-full gap-2 rounded-full sm:w-auto"
            onClick={handleResend}
            disabled={isResending}
          >
            <Icon
              name={isResending ? "progress_activity" : "mail"}
              className={isResending ? "animate-spin text-[16px]" : "text-[16px]"}
            />
            {isResending ? labels.sending : labels.resendEmail}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-11 w-full gap-2 rounded-full sm:w-auto"
          >
            <Icon name="print" className="text-[16px]" />
            {labels.print}
          </Button>
          {transaction.issuedTickets.map((ticket, index) => (
            <Button
              key={ticket.id}
              asChild
              variant="outline"
              size="sm"
              className="h-11 w-full rounded-full sm:w-auto"
            >
              <Link href={`/api/wallet/apple?qrHash=${ticket.qrHash}`} className="gap-2">
                <Icon name="download" className="text-[16px]" />
                {transaction.issuedTickets.length > 1
                  ? `${labels.addToWallet} ${index + 1}`
                  : labels.addToWallet}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
