"use client";

import { useEffect } from "react";
import { useBreadcrumb, type BreadcrumbItem } from "@/hooks/use-breadcrumb";

interface BreadcrumbInjectorProps {
  items: BreadcrumbItem[];
  backHref?: string;
}

/**
 * 🧭 BreadcrumbInjector
 * Injects breadcrumb data into the global Header via Zustand store.
 * Renders nothing — purely a side-effect component.
 */
export function BreadcrumbInjector({ items, backHref }: BreadcrumbInjectorProps) {
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs(items, backHref);
    return () => clearBreadcrumbs();
  }, [items, backHref, setBreadcrumbs, clearBreadcrumbs]);

  return null;
}
