"use client";

import { RouteErrorBoundary } from "@/components/ui/RouteErrorBoundary";

export default function InterceptedSearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorBoundary
      error={error}
      reset={reset}
      subtitleKey="modal_search_subtitle"
      isModal={true}
    />
  );
}
