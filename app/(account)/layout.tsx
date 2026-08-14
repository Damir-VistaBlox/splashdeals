import * as React from "react";
import { getDictionary } from "@/lib/dictionaries";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { GAScript } from "@/components/analytics/GoogleAnalytics";
import { ClarityScript } from "@/components/analytics/MicrosoftClarity";
import { WebVitals } from "@/app/(web)/_components/WebVitals";
import { getFacilityMap } from "@/lib/layout/facility-map";

/**
 * Account route group layout — same platform chrome as `(web)`.
 * Portal subnav lives in `(portal)/layout.tsx` (not on /prijava).
 */
export default async function AccountRootLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary();
  const facilityMap = await getFacilityMap();

  return (
    <>
      <WebVitals />
      <GAScript />
      <ClarityScript />
      <PlatformShell dict={dict} facilityMap={facilityMap} showStructuredData={false}>
        {children}
      </PlatformShell>
    </>
  );
}
