"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IdentitySetupDialog } from "@/components/shared/IdentitySetupDialog";
import { createCheckoutSessionAction } from "@/app/(server)/actions/checkout";
import { trackBeginCheckout } from "@/lib/analytics/events";
import { toast } from "sonner";

interface CheckoutButtonProps {
  items: { ticketPriceId: string; quantity: number }[];
  requiresIdentity: boolean;
  requiresPhoto: boolean;
  dict: Record<string, any>;
}

export function CheckoutButton({
  items,
  requiresIdentity,
  requiresPhoto,
  dict,
}: CheckoutButtonProps) {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [showIdentityDialog, setShowIdentityDialog] = React.useState(false);

  const handleCheckout = React.useCallback(
    async (holderName?: string, holderPhotoUrl?: string) => {
      setIsCheckingOut(true);
      try {
        trackBeginCheckout({
          items: items.map((i) => ({
            ticketId: i.ticketPriceId,
            ticketTitle: "",
            price: 0,
            quantity: i.quantity,
            facilityName: "",
          })),
        });

        const result = await createCheckoutSessionAction({
          items,
          holderName: holderName || null,
          holderPhotoUrl: holderPhotoUrl || null,
        });

        if (!result.success) {
          throw new Error(result.error || "Greška pri obradi kupovine.");
        }

        if (result.data?.url) {
          // Cart is cleared server-side in fulfillOrder (webhook) after payment is confirmed.
          window.location.href = result.data.url;
        } else {
          throw new Error("Nema URL-a za preusmeravanje.");
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Neočekivana greška.";
        toast.error(msg);
      } finally {
        setIsCheckingOut(false);
      }
    },
    [items],
  );

  const handleClick = () => {
    if (requiresIdentity || requiresPhoto) {
      setShowIdentityDialog(true);
    } else {
      handleCheckout();
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full text-base font-bold"
        disabled={isCheckingOut}
        onClick={handleClick}
      >
        {isCheckingOut
          ? dict.cart?.processing || "Obrada..."
          : dict.cart?.checkout || "Plati"}
      </Button>

      <IdentitySetupDialog
        open={showIdentityDialog}
        onOpenChange={setShowIdentityDialog}
        requiresIdentity={requiresIdentity}
        requiresPhoto={requiresPhoto}
        onComplete={(data) => {
          setShowIdentityDialog(false);
          handleCheckout(data.holderName, data.holderPhotoUrl);
        }}
      />
    </>
  );
}
