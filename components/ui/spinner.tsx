/**
 * 🔄 Spinner
 * Shared loading spinner used across the facility page for async operations.
 * Uses the same SVG pattern as the inline spinners — extracted here for consistency.
 */

import { CSSProperties } from "react";

interface SpinnerProps {
  className?: string;
  style?: CSSProperties;
}

export function Spinner({ className = "", style }: SpinnerProps) {
  return (
    <svg
      className={`text-primary animate-spin ${className}`}
      style={{ width: "1.25rem", height: "1.25rem", ...style }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function SpinnerLg({ className = "", style }: SpinnerProps) {
  return (
    <svg
      className={`text-primary animate-spin ${className}`}
      style={{ width: "2rem", height: "2rem", ...style }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
