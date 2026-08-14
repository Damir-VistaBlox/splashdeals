import * as React from "react";
import { getDictionary } from "@/lib/dictionaries";
import { BuyerSignalsLoader } from "@/components/analytics/BuyerSignalsLoader";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { getFacilityMap } from "@/lib/layout/facility-map";

export default async function WebLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <>
      <BuyerSignalsLoader />
      <WebLayoutContent modal={modal}>{children}</WebLayoutContent>
    </>
  );
}

async function WebLayoutContent({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  const dict = await getDictionary();
  const facilityMap = await getFacilityMap();

  return (
    <PlatformShell dict={dict} facilityMap={facilityMap}>
      {children}
      {modal ? <React.Suspense fallback={null}>{modal}</React.Suspense> : null}
    </PlatformShell>
  );
}
