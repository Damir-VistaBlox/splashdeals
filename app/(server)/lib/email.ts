import "server-only";
import { prisma } from "./prisma";
import { getDictionary } from "@/lib/dictionaries";
import { sendListmonkTransactionalEmail } from "./listmonk";
import {
  buildTicketDeliveryHtml,
  buildTicketDeliveryText,
} from "./email-templates/ticket-delivery";
import {
  buildCartUrl,
  buildTicketBarcodeImageUrl,
  buildPublicTicketUrl,
  buildTicketQrImageUrl,
  buildSuccessPageUrl,
} from "./ticket-assets";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
): Promise<void> {
  await sendListmonkTransactionalEmail({ to, subject, html, text });
}

export async function sendOrderConfirmation(transactionId: string): Promise<void> {
  const dict = await getDictionary();
  const e = dict.email;

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      user: { select: { email: true, name: true } },
      facility: {
        select: {
          name: true,
          slug: true,
          city: true,
          streetName: true,
          streetNumber: true,
          postalCode: true,
        },
      },
      issuedTickets: {
        include: {
          ticketPrice: {
            select: {
              label: true,
              ticketType: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!transaction || !transaction.user.email || !transaction.stripeSession) return;

  const tickets = await Promise.all(
    transaction.issuedTickets.map(async (ticket) => ({
      title:
        ticket.ticketPrice?.label ||
        ticket.ticketPrice?.ticketType?.title ||
        e.order_confirmation_ticket_default,
      qrImageUrl: buildTicketQrImageUrl(ticket.qrHash),
      barcodeImageUrl: buildTicketBarcodeImageUrl(ticket.id),
      ticketId: ticket.id,
      ticketUrl: buildPublicTicketUrl(ticket.qrHash),
      qrHash: ticket.qrHash,
      expiryDate: ticket.expiryDate,
      usageLimit: ticket.usageLimit,
    })),
  );
  const facilityAddress = [
    `${transaction.facility.streetName} ${transaction.facility.streetNumber}`.trim(),
    `${transaction.facility.postalCode} ${transaction.facility.city}`.trim(),
  ]
    .filter(Boolean)
    .join(", ");

  const html = buildTicketDeliveryHtml(
    {
      facilityName: transaction.facility.name,
      facilityAddress,
      customerName: transaction.user.name || transaction.user.email,
      tickets,
      totalAmount: Number(transaction.totalAmount),
      orderRef: transaction.orderRef,
      successPageUrl: buildSuccessPageUrl(transaction.stripeSession),
    },
    dict,
  );
  const text = buildTicketDeliveryText(
    {
      facilityName: transaction.facility.name,
      facilityAddress,
      customerName: transaction.user.name || transaction.user.email,
      tickets,
      totalAmount: Number(transaction.totalAmount),
      orderRef: transaction.orderRef,
      successPageUrl: buildSuccessPageUrl(transaction.stripeSession),
    },
    dict,
  );
  const subject = e.ticket_delivery_subject.replace("{facility}", transaction.facility.name);
  await sendEmail(transaction.user.email, subject, html, text);
}

export async function sendRecoveryEmail(email: string, items: any[]) {
  const dict = await getDictionary();
  const e = dict.email;

  const html = `<p>${e.recovery_intro}</p>
    <ul>${items.map((i: any) => `<li>${i.quantity}x ${i.title}</li>`).join("")}</ul>
    <a href="${buildCartUrl()}" style="display:block;padding:12px;background:#000;color:#fff;text-align:center;border-radius:8px;">${e.recovery_view_cart}</a>`;
  await sendEmail(email, e.recovery_subject, html);
}
