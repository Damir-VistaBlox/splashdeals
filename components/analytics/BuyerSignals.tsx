"use client";

import { GAScript } from "@/components/analytics/GoogleAnalytics";
import { ClarityScript } from "@/components/analytics/MicrosoftClarity";
import { WebVitals } from "@/app/(web)/_components/WebVitals";

/**
 * Buyer-facing analytics and vitals only.
 * Loaded lazily from public/account server layouts so initial route chunks stay leaner.
 */
export function BuyerSignals() {
  return (
    <>
      <WebVitals />
      <GAScript />
      <ClarityScript />
    </>
  );
}
