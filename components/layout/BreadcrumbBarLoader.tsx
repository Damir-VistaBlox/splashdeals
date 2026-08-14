"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import type { Dict } from "@/lib/types";

interface FacilityMap {
  [slug: string]: { name: string; category: string };
}

type BreadcrumbBarComponent = ComponentType<{
  dict: Dict;
  facilityMap?: FacilityMap;
}>;

/**
 * Breadcrumbs are hidden on core landing routes, so load the client breadcrumb logic after mount.
 */
export function BreadcrumbBarLoader({
  dict,
  facilityMap,
}: {
  dict: Dict;
  facilityMap?: FacilityMap;
}) {
  const [BreadcrumbBar, setBreadcrumbBar] = useState<BreadcrumbBarComponent | null>(null);

  useEffect(() => {
    let active = true;

    void import("@/components/layout/BreadcrumbBar").then((mod) => {
      if (active) {
        setBreadcrumbBar(() => mod.BreadcrumbBar);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return BreadcrumbBar ? <BreadcrumbBar dict={dict} facilityMap={facilityMap} /> : null;
}
