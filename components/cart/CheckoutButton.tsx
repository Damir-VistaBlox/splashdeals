"use client";

import Image from "next/image";
import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { IdentitySetupDialog } from "@/components/shared/IdentitySetupDialog";

/**
 * CheckoutButton Component
 * Handles the direct purchase flow by collecting the user's email 
 * and redirecting them to the Stripe Checkout session.
 */
export function CheckoutButton({ 
  ticketId, 
  price,
  currency = "RSD",
  requiresIdentity = false,
  requiresPhoto = false,
}: { 
  ticketId: string; 
  price: number;
  currency?: string;
  requiresIdentity?: boolean;
  requiresPhoto?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showIdentityDialog, setShowIdentityDialog] = useState(false);

  const startCheckout = () => {
    // 📳 HTML5 Vibration API: Premium Haptic Impulse
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }

    if (requiresIdentity || requiresPhoto) {
      setShowIdentityDialog(true);
      return;
    }

    handleCheckout({});
  };

  const handleCheckout = async ({ holderName, holderPhotoUrl }: { holderName?: string; holderPhotoUrl?: string }) => {
    try {
      setIsLoading(true);
      setError("");
      setShowIdentityDialog(false);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: [{
            ticketId,
            quantity: 1
          }],
          holderName,
          holderPhotoUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške prilikom inicijalizacije plaćanja.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Sistem nije vratio link za plaćanje.");
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : "Došlo je do greške. Pokušajte ponovo.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <LiquidButton
        onClick={startCheckout}
        isLoading={isLoading}
        size="lg"
        className="w-full h-16 text-lg font-bold"
      >
        Kupi za {price} {currency === "EUR" ? "€" : "RSD"}
      </LiquidButton>

      <IdentitySetupDialog 
        open={showIdentityDialog}
        onOpenChange={setShowIdentityDialog}
        requiresIdentity={requiresIdentity}
        requiresPhoto={requiresPhoto}
        onComplete={handleCheckout}
      />
      
      <div className="flex items-center justify-center gap-2 mt-4 opacity-50 select-none">
        <Image src="https://cdn.brandfolder.io/5H075830/at/pwhv6m-48v9oo-6fndw6/Stripe_Logo_rev.png" alt="Stripe" width={80} height={16} className="h-4 w-auto grayscale invert" unoptimized />
        <span className="text-[10px] uppercase font-bold tracking-widest text-white">Secure Checkout</span>
      </div>
    </div>
  );
}

