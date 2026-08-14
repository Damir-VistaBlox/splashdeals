"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import type { CartDictionary, DiscountInfo } from "@/lib/types/cart";

interface CartSummaryProps {
  totalBeforeDiscount: number;
  total: number;
  currency?: string;
  discount: DiscountInfo | null;
  dict: { cart?: CartDictionary } & Record<string, unknown>;
  promoCode: string;
  promoError: string;
  promoLoading: boolean;
  isCheckingOut: boolean;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  onCheckout: () => void;
}

export function CartSummary({
  totalBeforeDiscount,
  total,
  currency = "RSD",
  discount,
  dict,
  promoCode,
  promoError,
  promoLoading,
  isCheckingOut,
  onPromoCodeChange,
  onApplyPromo,
  onRemovePromo,
  onCheckout,
}: CartSummaryProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat("sr-RS").format(price);
  const cartDict = dict?.cart;
  const discountAmount = discount
    ? Math.round(totalBeforeDiscount * (discount.discountPercent / 100))
    : 0;
  const promoLabel = cartDict?.promo_label;
  const checkoutLabel = cartDict?.checkout_button || cartDict?.checkout;
  const totalLabel = cartDict?.total_label || cartDict?.total;
  const promoHelpId = promoError ? "cart-promo-error" : discount ? "cart-promo-success" : undefined;

  return (
    <aside aria-labelledby="cart-summary-title" className="space-y-4 sm:space-y-6">
      <Card variant="glass" className="sm:surface-card rounded-[1.75rem] p-4 sm:p-8">
        <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <h2
            id="cart-summary-title"
            className="text-foreground text-[10px] font-black tracking-[0.22em] uppercase"
          >
            {cartDict?.summary}
          </h2>
          <span
            aria-live="polite"
            className="text-primary bg-primary/10 rounded-full px-2.5 py-1 text-[9px] font-black tracking-[0.14em] uppercase"
          >
            {cartDict?.checkout_ready || "Spremno za naplatu"}
          </span>
        </header>

        <ul aria-label="Prednosti naplate" className="mb-4 grid grid-cols-3 gap-2 sm:hidden">
          <li className="rounded-2xl bg-white/66 px-3 py-2 text-center">
            <p className="text-foreground text-[10px] font-black tracking-[0.14em] uppercase">
              {cartDict?.ready_secure || "Sigurno"}
            </p>
            <p className="text-muted-foreground mt-1 text-[11px] font-medium">
              {cartDict?.ready_secure_subtitle || "Plaćanje"}
            </p>
          </li>
          <li className="rounded-2xl bg-white/66 px-3 py-2 text-center">
            <p className="text-foreground text-[10px] font-black tracking-[0.14em] uppercase">
              {cartDict?.ready_promo || "Promo"}
            </p>
            <p className="text-muted-foreground mt-1 text-[11px] font-medium">
              {cartDict?.ready_promo_subtitle || "Kod podržan"}
            </p>
          </li>
          <li className="rounded-2xl bg-white/66 px-3 py-2 text-center">
            <p className="text-foreground text-[10px] font-black tracking-[0.14em] uppercase">
              {cartDict?.ready_delivery || "Karte"}
            </p>
            <p className="text-muted-foreground mt-1 text-[11px] font-medium">
              {cartDict?.ready_delivery_subtitle || "Digitalna dostava"}
            </p>
          </li>
        </ul>

        <dl className="space-y-3">
          <div className="text-foreground flex justify-between text-sm">
            <dt className="text-muted-foreground">{cartDict?.subtotal}</dt>
            <dd className="font-bold tabular-nums">
              {formatPrice(totalBeforeDiscount)} {currency}
            </dd>
          </div>

          {discount && (
            <div className="flex justify-between text-sm">
              <dt className="text-success">
                {cartDict?.discount} ({discount.discountPercent}%)
              </dt>
              <dd className="text-success font-bold tabular-nums">
                -{formatPrice(discountAmount)} {currency}
              </dd>
            </div>
          )}

          <div className="border-border border-t pt-3">
            <div className="flex justify-between text-base">
              <dt className="text-foreground font-bold">{totalLabel}</dt>
              <dd
                aria-live="polite"
                className="text-foreground text-xl font-black tracking-tight tabular-nums"
              >
                {formatPrice(total)} {currency}
              </dd>
            </div>
          </div>
        </dl>

        <form
          className="mt-5 space-y-2 sm:mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            onApplyPromo();
          }}
        >
          <Label
            htmlFor="cart-promo-code"
            className="text-muted-foreground text-[10px] font-black tracking-widest uppercase"
          >
            {promoLabel}
          </Label>
          <div className="flex gap-2">
            <Input
              id="cart-promo-code"
              value={promoCode}
              onChange={(e) => {
                onPromoCodeChange(e.target.value);
              }}
              placeholder={cartDict?.promo_placeholder}
              autoComplete="off"
              enterKeyHint="done"
              aria-invalid={Boolean(promoError)}
              aria-describedby={promoHelpId}
              className="h-11 rounded-xl border-white/70 bg-white/78 text-base sm:text-xs"
            />
            <Button
              type="submit"
              disabled={!promoCode || promoLoading}
              className="h-11 shrink-0 rounded-xl px-4 text-[11px] font-black tracking-[0.12em] uppercase shadow-sm"
            >
              {cartDict?.apply}
            </Button>
          </div>
          {promoError && (
            <p id="cart-promo-error" className="text-destructive text-xs font-medium" role="alert">
              {promoError}
            </p>
          )}
          {discount && !promoError && (
            <p
              id="cart-promo-success"
              className="text-success text-xs font-medium"
              aria-live="polite"
            >
              {discount.code}
            </p>
          )}
          {discount && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemovePromo}
              className="text-destructive/70 hover:text-destructive h-11 px-0 text-[10px] font-black tracking-widest uppercase sm:h-8"
            >
              {cartDict?.remove} {discount.code}
            </Button>
          )}
        </form>

        <Button
          type="button"
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="mt-5 hidden h-14 w-full rounded-2xl text-base font-bold shadow-[0_16px_32px_rgba(6,182,212,0.22)] sm:mt-6 lg:inline-flex"
        >
          {isCheckingOut ? cartDict?.processing : checkoutLabel}
        </Button>
      </Card>

      <Card
        variant="glass"
        aria-label={cartDict?.supported_cards || "Podržane kartice"}
        className="sm:surface-card flex flex-wrap items-center justify-center gap-4 rounded-[1.75rem] p-4 sm:p-6"
      >
        <Image src="/payments/visa.svg" alt="Visa" width={64} height={24} className="h-6 w-auto" />
        <Image
          src="/payments/mastercard.svg"
          alt="Mastercard"
          width={64}
          height={24}
          className="h-6 w-auto"
        />
        <Image
          src="/payments/dinacard.svg"
          alt="DinaCard"
          width={64}
          height={24}
          className="h-6 w-auto"
        />
      </Card>

      {cartDict?.security_notice && (
        <p className="text-muted-foreground px-2 text-center text-[10px] leading-relaxed font-bold sm:px-8">
          {cartDict.security_notice}
        </p>
      )}
      <p className="text-muted-foreground px-2 text-center text-[10px] leading-relaxed font-bold sm:px-8">
        {cartDict?.terms_notice}
      </p>
    </aside>
  );
}
