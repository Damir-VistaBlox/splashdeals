"use client";

import dynamic from "next/dynamic";

type AddToCartButtonProps = {
  ticket: {
    id: string;
    title: string;
    price: number | string;
    currency: string;
    validityType: string;
    requiresIdentity?: boolean;
    requiresPhoto?: boolean;
    minPeople?: number;
    maxPeople?: number | null;
    imageUrl?: string | null;
    facility: {
      id: string;
      name: string;
      category: string;
    };
  };
  className?: string;
};

const AddToCartButton = dynamic(
  () => import("@/components/cart/AddToCartButton").then((mod) => mod.AddToCartButton),
  {
    ssr: false,
    loading: () => (
      <span
        aria-hidden
        className="border-border bg-background/92 inline-flex min-h-12 min-w-12 rounded-[1.15rem] border shadow-sm shadow-slate-200/70 sm:min-h-12 sm:min-w-12 sm:rounded-2xl"
      />
    ),
  },
);

export function LazyAddToCartButton(props: AddToCartButtonProps) {
  return <AddToCartButton {...props} />;
}
