import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { CartClient } from "./_components/CartClient";
import { getCartAction } from "@/app/(server)/actions/cart";
import { connection } from "next/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return {
    title: dict.cart?.title || "Vaša Korpa | Splashdeals",
    description: dict.cart?.description || "Pregledajte vaše izabrane ulaznice za akva parkove.",
    robots: { index: false, follow: false },
    alternates: { canonical: null },
    openGraph: {
      title: dict.cart?.title || "Vaša Korpa | Splashdeals",
      description: dict.cart?.description || "Pregledajte vaše izabrane ulaznice za akva parkove.",
      images: ["/og-image.png"],
      locale: "sr_RS",
      type: "website",
    },
  };
}

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  await connection();

  const [dict, params, cartResult] = await Promise.all([
    getDictionary(),
    searchParams,
    getCartAction(),
  ]);
  const checkoutCancelled = params.checkout === "cancelled";
  const initialItems = cartResult.success ? cartResult.data?.items || [] : [];
  const initialLocked = cartResult.success ? Boolean(cartResult.data?.locked) : false;
  const initialPromo = cartResult.success ? (cartResult.data?.appliedPromo ?? null) : null;

  // Noindex cart page — skip low-value WebPage JsonLd.
  return (
    <CartClient
      dict={dict}
      checkoutCancelled={checkoutCancelled}
      initialItems={initialItems}
      initialLocked={initialLocked}
      initialPromo={initialPromo}
    />
  );
}
