"use client";

import * as React from "react";

type FallbackRender = (props: { error: Error | null; reset: () => void }) => React.ReactNode;

interface ErrorBoundaryProps {
  /**
   * Static React node, or a render function.
   * IMPORTANT: when used from a Server Component, only pass a static node —
   * never a function (RSC cannot serialize functions into Client Component props).
   */
  fallback: React.ReactNode | FallbackRender;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (typeof fallback === "function") {
        return fallback({ error: this.state.error, reset: this.reset });
      }
      return fallback;
    }

    return this.props.children;
  }
}
