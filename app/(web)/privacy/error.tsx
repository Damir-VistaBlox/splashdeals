"use client"

import { RouteErrorBoundary } from "@/components/ui/RouteErrorBoundary"

export default function PrivacyError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteErrorBoundary 
      error={error} 
      reset={reset} 
      subtitleKey="privacy_subtitle" 
    />
  )
}
