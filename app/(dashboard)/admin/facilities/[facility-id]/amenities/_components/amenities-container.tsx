"use client"

import * as React from "react"
import { AmenitiesError } from "./amenities-error-boundary"
import { CompactAmenitiesTable } from "./facility-amenities-compact"

interface ErrorBoundaryProps {
  fallback: (props: { error: Error; resetErrorBoundary: () => void }) => React.ReactNode
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Amenities Module Boundary Exception caught:", error, errorInfo)
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary
      })
    }

    return this.props.children
  }
}

interface AmenitiesContainerProps {
  facilityId: string
  allAmenities: Array<{
    id: string
    name: string
    icon: string
    category: string | null
    isSeeded: boolean
    type: "BOOLEAN" | "QUANTIFIABLE" | "TEXT"
  }>
  initialFacilityAmenities: Array<{
    facilityId: string
    amenityId: string
    value: string | null
    imageUrl: string | null
    displayOrder: number
    isActive: boolean
    isFeatured: boolean
    scheduledAt: Date | null
  }>
}

export function CompactAmenitiesTableContainer(props: AmenitiesContainerProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <AmenitiesError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <CompactAmenitiesTable {...props} />
    </ErrorBoundary>
  )
}
