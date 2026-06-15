"use client";
import { Icon } from "@/components/ui/Icon";

import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CartFloatingButton() {
  const {} = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const totalItems = useCart((state) => state.getTotalItems());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted || totalItems === 0) return null;

  return (
    <Link
      href={`/cart`}
      className="fixed bottom-8 right-8 z-50 bg-cyan-500 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-all group active:scale-95"
    >
      <div className="relative">
        <Icon name="shopping_cart" className="text-[24px]" />
        <span className="absolute -top-2 -right-2 bg-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-500">
          {totalItems}
        </span>
      </div>
    </Link>
  );
}
