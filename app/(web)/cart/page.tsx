import { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { CartClient } from "./_components/CartClient";

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

  const [dict, params] = await Promise.all([getDictionary(), searchParams]);
  const checkoutCancelled = params.checkout === "cancelled";

  // Noindex cart page — skip low-value WebPage JsonLd.
  return <CartClient dict={dict} checkoutCancelled={checkoutCancelled} />;
}
