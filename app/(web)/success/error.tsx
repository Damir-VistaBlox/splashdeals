"use client"

import { RouteErrorBoundary } from "@/components/ui/RouteErrorBoundary"

export default function SuccessError({
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
      subtitleKey="success_subtitle" 
    />
  )
}
