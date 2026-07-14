import { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getDictionary } from "@/lib/dictionaries";
import { prisma } from "@/app/(server)/lib/prisma";
import { auth } from "@/app/(server)/lib/auth";
import { headers } from "next/headers";
import type { CartItem } from "@/lib/types/cart";
import { CheckoutButton } from "./_components/CheckoutButton";

export const metadata: Metadata = {
  title: "Naplata | Splashdeals",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default async function CheckoutPage() {
  await connection();

  const dict = await getDictionary();

  // Require authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/prijava");
  }

  // Read cart from server
  const cartSession = await prisma.cartSession.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { cartItems: true },
  });

  if (!cartSession || cartSession.cartItems.length === 0) {
    redirect("/cart");
  }

  // Re-validate prices against DB
  const validatedItems: CartItem[] = [];
  let needsUpdate = false;
  let totalBeforeDiscount = 0;

  for (const item of cartSession.cartItems) {
    const ticketPrice = await prisma.ticketPrice.findUnique({
      where: { id: item.ticketPriceId },
      include: {
        ticketType: {
          include: {
            category: { include: { facility: true } },
          },
        },
      },
    });

    if (
      !ticketPrice ||
      !ticketPrice.isActive ||
      ticketPrice.ticketType.category.facility.status !== "ACTIVE"
    ) {
      // Item no longer available — skip it
      continue;
    }

    const currentPrice = Number(ticketPrice.price);
    if (currentPrice !== item.price) {
      needsUpdate = true;
    }
    totalBeforeDiscount += currentPrice * item.quantity;

    validatedItems.push({
      id: item.id,
      ticketId: item.ticketPriceId,
      quantity: item.quantity,
      title: item.title,
      price: currentPrice,
      currency: item.currency,
      facilityId: item.facilityId,
      facilityName: item.facilityName ?? undefined,
      category: item.category ?? undefined,
      validityType: item.validityType ?? undefined,
      requiresIdentity: item.requiresIdentity,
      requiresPhoto: item.requiresPhoto,
      imageUrl: item.imageUrl,
      minPeople: item.minPeople ?? undefined,
      maxPeople: item.maxPeople ?? undefined,
      updatedAt: item.updatedAt.getTime(),
    });
  }

  if (validatedItems.length === 0) {
    redirect("/cart");
  }

  // Persist any price changes
  if (needsUpdate) {
    for (const item of validatedItems) {
      await prisma.cartSessionItem.update({
        where: { id: item.id },
        data: { price: item.price },
      });
    }
  }

  const requiresIdentity = validatedItems.some((i) => i.requiresIdentity);
  const requiresPhoto = validatedItems.some((i) => i.requiresPhoto);

  return (
    <div className="container mx-auto min-h-[60vh] max-w-2xl px-4 py-12">
      <h1 className="text-foreground mb-8 text-center text-3xl font-black tracking-tighter uppercase italic">
        {dict.cart?.checkout_title || "Završite Kupovinu"}
      </h1>

      <div className="bg-card border-border rounded-2xl border p-6 shadow-sm">
        {/* Item summary */}
        <div className="divide-border divide-y">
          {validatedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-foreground font-medium">{item.title}</p>
                <p className="text-muted-foreground text-sm">
                  {item.facilityName && `${item.facilityName} · `}
                  {dict.cart?.quantity_label || "Komada"}: {item.quantity}
                </p>
              </div>
              <p className="text-foreground font-semibold tabular-nums">
                {new Intl.NumberFormat("sr-RS").format(item.price * item.quantity)} RSD
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-foreground text-lg font-bold">
            {dict.cart?.total || "Ukupno"}
          </span>
          <span className="text-foreground text-lg font-bold tabular-nums">
            {new Intl.NumberFormat("sr-RS").format(totalBeforeDiscount)} RSD
          </span>
        </div>

        {/* Complete Purchase Button */}
        <div className="mt-6">
          <CheckoutButton
            items={validatedItems.map((i) => ({
              ticketPriceId: i.ticketId,
              quantity: i.quantity,
            }))}
            requiresIdentity={requiresIdentity}
            requiresPhoto={requiresPhoto}
            dict={dict}
          />
        </div>
      </div>
    </div>
  );
}
