"use client";

import { RouteErrorBoundary } from "@/components/ui/RouteErrorBoundary";

export default function HowItWorksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorBoundary error={error} reset={reset} subtitleKey="how_it_works_subtitle" />;
}
