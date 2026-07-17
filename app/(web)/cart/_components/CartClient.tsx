"use client";

import * as React from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import type { CartItem, DiscountInfo, CartDictionary, IdentityDictionary } from "@/lib/types/cart";
import { IdentitySetupDialog } from "@/components/shared/IdentitySetupDialog";
import {
  createCheckoutSessionAction,
  cancelCheckoutSessionAction,
} from "@/app/(server)/actions/checkout";
import { validatePromoCodeAction } from "@/app/(server)/actions/campaigns";
import { reconcileCartAction, setCartPromoAction } from "@/app/(server)/actions/cart";
import {
  claimGuestCartAction,
  resolveGuestCartConflictAction,
} from "@/app/(server)/actions/guest-cart-claim";
import { trackBeginCheckout } from "@/lib/analytics/events";
import { useServerCart } from "@/hooks/use-server-cart";
import { authClient } from "@/lib/auth-client";
import { buildPrijavaUrl } from "@/lib/auth/callback-url";
import { mutateCartLine } from "@/lib/cart/mutate-cart-line";
import {
  clearGuestClaimConflict,
  GUEST_CLAIM_CONFLICT_EVENT,
  isGuestClaimHandled,
  markGuestClaimHandled,
  readGuestClaimConflict,
  storeGuestClaimConflict,
} from "@/lib/cart/guest-claim-conflict";
import { getCartTotalItems } from "@/lib/cart/cart-totals";
import { cartCurrency, type CartReconcileNotice } from "@/lib/cart/cart-helpers";
import { clearPersistedPromo, loadPersistedPromo, persistPromo } from "@/lib/cart/promo-persist";
import { CartItemList } from "./CartItemList";
import { CartSummary } from "./CartSummary";
import { GuestCartConflictModal } from "./GuestCartConflictModal";
import { useRouter } from "next/navigation";

export function CartClient({
  dict,
  checkoutCancelled = false,
  initialItems,
  initialLocked = false,
  initialPromo = null,
}: {
  dict: {
    cart?: CartDictionary;
    identity?: IdentityDictionary;
  } & Record<string, unknown>;
  checkoutCancelled?: boolean;
  /** RSC-seeded cart lines to reduce skeleton flash (#686 M10). */
  initialItems?: CartItem[];
  initialLocked?: boolean;
  initialPromo?: DiscountInfo | null;
}) {
  const cartDict = dict.cart;
  const identityDict = dict.identity;
  const router = useRouter();
  const { data: authSession, isPending: isAuthPending } = authClient.useSession();
  const items = useServerCart((s) => s.items);
  const locked = useServerCart((s) => s.locked);
  const refresh = useServerCart((s) => s.refresh);
  const setItems = useServerCart((s) => s.setItems);
  const setLocked = useServerCart((s) => s.setLocked);
  const notifyUpdated = useServerCart((s) => s.notifyUpdated);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [isCancellingCheckout, setIsCancellingCheckout] = React.useState(false);
  const [showIdentityDialog, setShowIdentityDialog] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState(
    () => initialPromo?.code || loadPersistedPromo()?.code || "",
  );
  const [promoError, setPromoError] = React.useState("");
  const [promoLoading, setPromoLoading] = React.useState(false);
  const [discount, setDiscount] = React.useState<DiscountInfo | null>(
    () => initialPromo || loadPersistedPromo(),
  );
  const [removedItems, setRemovedItems] = React.useState<CartReconcileNotice[]>([]);
  const [changedItems, setChangedItems] = React.useState<CartReconcileNotice[]>([]);
  const [conflict, setConflict] = React.useState<{
    guestFacilityName: string;
    userFacilityName: string;
  } | null>(null);
  const [resolvingConflict, setResolvingConflict] = React.useState(false);
  const [isBootstrapping, setIsBootstrapping] = React.useState(true);
  const [mutatingItemIds, setMutatingItemIds] = React.useState<Set<string>>(() => new Set());
  const claimHandledRef = React.useRef(false);
  const seededRef = React.useRef(false);
  const discountRef = React.useRef<DiscountInfo | null>(initialPromo || null);

  React.useEffect(() => {
    discountRef.current = discount;
  }, [discount]);

  // Seed store from RSC snapshot once (before first paint of real content).
  React.useLayoutEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
    setLocked(Boolean(initialLocked));
    if (initialPromo) {
      persistPromo(initialPromo);
    }
  }, [initialItems, initialLocked, initialPromo, setItems, setLocked]);

  const totalBeforeDiscount = items.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.quantity,
    0,
  );
  const discountAmount = discount
    ? Math.round(totalBeforeDiscount * (discount.discountPercent / 100))
    : 0;
  const total = totalBeforeDiscount - discountAmount;
  const currency = cartCurrency(items);
  const requiresIdentity = items.some((i) => i.requiresIdentity);
  const requiresPhoto = items.some((i) => i.requiresPhoto);
  const cartFacilityId = items[0]?.facilityId;
  const totalTickets = getCartTotalItems(items);

  const headingCount =
    items.length > 0
      ? (
          cartDict?.lines_and_tickets ||
          cartDict?.items_count ||
          "{lines} stavki · {tickets} karata"
        )
          .replace("{lines}", String(items.length))
          .replace("{tickets}", String(totalTickets))
          .replace("{count}", String(totalTickets))
      : cartDict?.empty_title || cartDict?.empty;

  const softRefresh = React.useCallback(async () => {
    await refresh();
  }, [refresh]);

  const applyDiscount = React.useCallback((next: DiscountInfo | null) => {
    setDiscount(next);
    persistPromo(next);
    void setCartPromoAction(next).catch(() => {
      // Non-fatal — sessionStorage still holds the promo for remount.
    });
  }, []);

  const reconcileAndRefresh = React.useCallback(async () => {
    const reconcile = await reconcileCartAction();
    if (reconcile.success && reconcile.data) {
      setRemovedItems(reconcile.data.removedItems);
      setChangedItems(reconcile.data.changedItems);
      setLocked(Boolean(reconcile.data.locked));
    }
    await refresh();
  }, [refresh, setLocked]);

  const revalidateAppliedPromo = React.useCallback(
    async (applied: DiscountInfo | null) => {
      if (!applied?.code) return;

      const nextItems = useServerCart.getState().items;
      if (nextItems.length === 0) {
        applyDiscount(null);
        setPromoError("");
        return;
      }

      const facilityId = nextItems[0]?.facilityId;
      const nextTotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const result = await validatePromoCodeAction(applied.code, facilityId, nextTotal);

      if (result.success && result.data?.valid) {
        applyDiscount({
          campaignId: result.data.campaignId,
          code: applied.code,
          discountPercent: result.data.discountPercent,
        });
        return;
      }

      applyDiscount(null);
      const message = cartDict?.promo_cleared || cartDict?.promo_invalid || "";
      setPromoError(message);
      if (message) toast.info(message);
    },
    [applyDiscount, cartDict?.promo_cleared, cartDict?.promo_invalid],
  );

  React.useEffect(() => {
    if (isAuthPending) return;

    let active = true;
    const timer = requestAnimationFrame(async () => {
      setIsMounted(true);
      setIsBootstrapping(true);
      try {
        if (!claimHandledRef.current) {
          claimHandledRef.current = true;
          if (authSession?.user) {
            const userId = authSession.user.id;
            const pendingConflict = readGuestClaimConflict(userId);
            if (pendingConflict) {
              setConflict(pendingConflict);
            } else if (!isGuestClaimHandled(userId)) {
              const claim = await claimGuestCartAction();
              if (!active) return;
              if (claim.success && claim.data?.action === "conflict") {
                storeGuestClaimConflict(userId, {
                  guestFacilityName: claim.data.guestFacilityName,
                  userFacilityName: claim.data.userFacilityName,
                });
                setConflict({
                  guestFacilityName: claim.data.guestFacilityName,
                  userFacilityName: claim.data.userFacilityName,
                });
              } else {
                markGuestClaimHandled(userId);
              }
            }
          }
        }
        await reconcileAndRefresh();
        const applied = discountRef.current;
        if (active && applied) {
          await revalidateAppliedPromo(applied);
        }
      } finally {
        if (active) setIsBootstrapping(false);
      }
    });
    return () => {
      active = false;
      cancelAnimationFrame(timer);
    };
  }, [isAuthPending, authSession?.user, reconcileAndRefresh, revalidateAppliedPromo]);

  React.useEffect(() => {
    const userId = authSession?.user?.id;
    if (!userId) return;

    const onConflict = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        userId?: string;
        guestFacilityName?: string;
        userFacilityName?: string;
      };
      if (detail?.userId && detail.userId !== userId) return;
      if (detail?.guestFacilityName && detail?.userFacilityName) {
        setConflict({
          guestFacilityName: detail.guestFacilityName,
          userFacilityName: detail.userFacilityName,
        });
      }
    };

    window.addEventListener(GUEST_CLAIM_CONFLICT_EVENT, onConflict);
    return () => window.removeEventListener(GUEST_CLAIM_CONFLICT_EVENT, onConflict);
  }, [authSession?.user?.id]);

  const handleResolveConflict = async (choice: "guest" | "user") => {
    setResolvingConflict(true);
    try {
      const result = await resolveGuestCartConflictAction({ choice });
      if (!result.success) {
        toast.error(result.error || cartDict?.conflict_resolve_error);
        return;
      }
      const userId = authSession?.user?.id;
      if (userId) {
        clearGuestClaimConflict(userId);
        markGuestClaimHandled(userId);
      }
      setConflict(null);
      toast.success(
        choice === "guest" ? cartDict?.conflict_kept_guest : cartDict?.conflict_kept_user,
      );
      await reconcileAndRefresh();
      await revalidateAppliedPromo(discount);
    } finally {
      setResolvingConflict(false);
    }
  };

  const handleDismissConflict = () => {
    setConflict(null);
  };

  const cancellationHandledRef = React.useRef(false);
  React.useEffect(() => {
    if (!checkoutCancelled || cancellationHandledRef.current) return;
    cancellationHandledRef.current = true;

    let active = true;
    cancelCheckoutSessionAction()
      .then(async (result) => {
        if (!active) return;
        if (result.success) {
          toast.info(cartDict?.checkout_cancelled);
          setLocked(false);
          await reconcileAndRefresh();
          window.history.replaceState({}, "", "/cart");
        } else {
          toast.error(result.error || cartDict?.checkout_cancel_error);
        }
      })
      .catch(() => {
        if (active) toast.error(cartDict?.checkout_cancel_error);
      });

    return () => {
      active = false;
    };
  }, [checkoutCancelled, reconcileAndRefresh, cartDict, setLocked]);

  const handleCancelCheckout = async () => {
    setIsCancellingCheckout(true);
    try {
      const result = await cancelCheckoutSessionAction();
      if (!result.success) {
        toast.error(result.error || cartDict?.checkout_cancel_error);
        return;
      }
      toast.info(cartDict?.checkout_cancelled);
      setLocked(false);
      await reconcileAndRefresh();
      notifyUpdated();
    } catch {
      toast.error(cartDict?.checkout_cancel_error);
    } finally {
      setIsCancellingCheckout(false);
    }
  };

  const withMutating = async (itemId: string, fn: () => Promise<void>) => {
    setMutatingItemIds((prev) => new Set(prev).add(itemId));
    try {
      await fn();
    } finally {
      setMutatingItemIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (!itemId) return;
    await withMutating(itemId, async () => {
      const result = await mutateCartLine({
        itemId,
        mode: "setQuantity",
        quantity: newQuantity,
        errorFallback: cartDict?.update_error,
      });
      if (!result.ok) {
        toast.error(result.error || cartDict?.update_error);
        await softRefresh();
        return;
      }
      await revalidateAppliedPromo(discount);
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!itemId) return;
    await withMutating(itemId, async () => {
      const result = await mutateCartLine({
        itemId,
        mode: "removeLine",
        errorFallback: cartDict?.remove_error,
      });
      if (!result.ok) {
        toast.error(result.error || cartDict?.remove_error);
        await softRefresh();
        return;
      }
      await revalidateAppliedPromo(discount);
    });
  };

  const handleApplyPromo = async () => {
    setPromoLoading(true);
    try {
      const result = await validatePromoCodeAction(promoCode, cartFacilityId, totalBeforeDiscount);
      if (result.success && result.data?.valid) {
        const next: DiscountInfo = {
          campaignId: result.data.campaignId,
          code: promoCode,
          discountPercent: result.data.discountPercent,
        };
        applyDiscount(next);
        setPromoError("");
        toast.success(cartDict?.promo_applied);
      } else {
        const promoData = result.success ? result.data : null;
        setPromoError(
          promoData && !promoData.valid ? promoData.error : cartDict?.promo_invalid || "",
        );
      }
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    applyDiscount(null);
    clearPersistedPromo();
    setPromoCode("");
    setPromoError("");
  };

  const handleStartCheckout = () => {
    if (locked) {
      toast.error(cartDict?.locked_description || cartDict?.checkout_error);
      return;
    }
    if (!isAuthPending && !authSession?.user) {
      router.push(buildPrijavaUrl("/cart"));
      return;
    }

    trackBeginCheckout({
      items: items.map((i) => ({
        ticketId: i.ticketId,
        facilityName: i.facilityName || "",
        ticketTitle: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    if (requiresIdentity || requiresPhoto) {
      setShowIdentityDialog(true);
    } else {
      processCheckout({});
    }
  };

  const processCheckout = async ({
    holderName,
    holderPhotoUrl,
  }: {
    holderName?: string;
    holderPhotoUrl?: string;
  }) => {
    try {
      if (!isAuthPending && !authSession?.user) {
        router.push(buildPrijavaUrl("/cart"));
        return;
      }

      setIsCheckingOut(true);
      setShowIdentityDialog(false);

      await reconcileAndRefresh();

      const result = await createCheckoutSessionAction({
        holderName,
        holderPhotoUrl,
        promoCode: discount?.code ?? null,
      });

      if (!result.success) {
        if (result.error?.toLowerCase().includes("prijavljen")) {
          router.push(buildPrijavaUrl("/cart"));
          return;
        }
        toast.error(result.error || cartDict?.checkout_start_error || cartDict?.checkout_error);
        return;
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error(cartDict?.checkout_url_error || cartDict?.checkout_error);
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : cartDict?.checkout_error || "Greška";
      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Seeded items can show immediately while auth/claim finishes.
  const showSkeleton = !isMounted || (isBootstrapping && items.length === 0 && isAuthPending);

  if (showSkeleton) {
    return (
      <div className="mx-auto min-h-[50vh] max-w-7xl px-4 pt-8 pb-28 sm:px-12 sm:pt-12 sm:pb-32">
        <div className="bg-muted/30 mb-6 h-8 w-40 animate-pulse rounded-lg" />
        <div className="bg-muted/20 h-28 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[50vh] max-w-7xl px-3 pt-6 pb-[calc(10.5rem+env(safe-area-inset-bottom,0px))] sm:px-12 sm:pt-12 sm:pb-32">
      <GuestCartConflictModal
        open={Boolean(conflict)}
        guestFacilityName={conflict?.guestFacilityName || ""}
        userFacilityName={conflict?.userFacilityName || ""}
        resolving={resolvingConflict}
        onChooseGuest={() => handleResolveConflict("guest")}
        onChooseUser={() => handleResolveConflict("user")}
        onDismiss={handleDismissConflict}
        dict={cartDict}
      />
      <div className="mb-6 sm:mb-12">
        <p className="text-muted-foreground mb-2 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-3">
          {cartDict?.title}
        </p>
        <h1 className="text-foreground text-2xl leading-none font-black tracking-tighter sm:text-5xl">
          {headingCount}
        </h1>
        {items.length === 0 && cartDict?.empty_subtitle && (
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            {cartDict.empty_subtitle}
          </p>
        )}
      </div>

      {locked && (
        <div
          role="status"
          className="border-warning/30 bg-warning/10 mb-6 rounded-2xl border p-4 sm:p-5"
        >
          <p className="text-warning text-sm font-black tracking-wide uppercase">
            {cartDict?.locked_title || "Plaćanje je u toku"}
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {cartDict?.locked_description}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isCancellingCheckout}
            onClick={() => void handleCancelCheckout()}
            className="mt-4 min-h-11 rounded-xl"
          >
            {isCancellingCheckout
              ? cartDict?.cancel_checkout_processing || "Otkazivanje..."
              : cartDict?.cancel_checkout || "Otkaži plaćanje"}
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-10 sm:pt-20">
          <div className="bg-muted/20 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24">
            <Icon
              name="shopping_bag"
              className="text-muted-foreground/30 text-[36px] sm:text-[40px]"
            />
          </div>
          <p className="text-muted-foreground mt-5 max-w-xs text-center text-sm font-medium sm:mt-6">
            {cartDict?.empty_description}
          </p>
          <Link href="/akva-parkovi">
            <Button variant="ghost" className="mt-4 min-h-11 px-4">
              {cartDict?.browse}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            <CartItemList
              items={items}
              dict={dict}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              removedItems={removedItems}
              changedItems={changedItems}
              mutatingItemIds={mutatingItemIds}
            />
          </div>
          <CartSummary
            totalBeforeDiscount={totalBeforeDiscount}
            total={total}
            currency={currency}
            discount={discount}
            dict={dict}
            promoCode={promoCode}
            promoError={promoError}
            promoLoading={promoLoading}
            isCheckingOut={isCheckingOut || locked}
            onPromoCodeChange={(code) => {
              setPromoCode(code);
              setPromoError("");
            }}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            onCheckout={handleStartCheckout}
          />
        </div>
      )}

      {items.length > 0 && (
        <div className="border-border/50 bg-background/98 pointer-events-auto fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] z-[999] border-t px-4 py-3 backdrop-blur-[40px] md:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                {cartDict?.total_label || cartDict?.total}
              </p>
              <p className="text-foreground text-lg leading-none font-black tabular-nums">
                {new Intl.NumberFormat("sr-RS").format(total)}{" "}
                <span className="text-primary text-xs">{currency}</span>
              </p>
            </div>
            {locked ? (
              <Button
                type="button"
                variant="outline"
                disabled={isCancellingCheckout}
                onClick={() => void handleCancelCheckout()}
                className="h-12 min-h-12 min-w-[9.5rem] shrink-0 touch-manipulation rounded-2xl px-5 text-sm font-bold"
              >
                {isCancellingCheckout
                  ? cartDict?.cancel_checkout_processing
                  : cartDict?.cancel_checkout}
              </Button>
            ) : (
              <Button
                onClick={handleStartCheckout}
                disabled={isCheckingOut}
                className="h-12 min-h-12 min-w-[9.5rem] shrink-0 touch-manipulation rounded-2xl px-5 text-sm font-bold"
              >
                {isCheckingOut
                  ? cartDict?.processing
                  : cartDict?.checkout_button || cartDict?.checkout}
              </Button>
            )}
          </div>
        </div>
      )}

      <IdentitySetupDialog
        open={showIdentityDialog}
        onOpenChange={setShowIdentityDialog}
        requiresIdentity={requiresIdentity}
        requiresPhoto={requiresPhoto}
        onComplete={processCheckout}
        initialHolderName={authSession?.user?.name}
        dict={identityDict}
      />
    </div>
  );
}
