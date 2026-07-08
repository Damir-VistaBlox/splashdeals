"use client";

import { RouteErrorBoundary } from "@/components/ui/RouteErrorBoundary";

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorBoundary error={error} reset={reset} subtitleKey="cart_subtitle" />;
}
