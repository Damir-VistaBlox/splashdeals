"use client";

import { useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";

/**
 * 🌊 Splashdeals Web Vitals Reporter
 * Automatically measures and reports performance metrics according to core-web-vitals standards.
 * Integrates directly into the Next.js 16 lifecycle via `useReportWebVitals`.
 * Reference: https://web.dev/articles/vitals
 */
export function WebVitals() {
  const seenMetrics = useRef(new Set<string>());

  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
      return;
    }

    const { id, name, label, value } = metric;
    const metricKey = `${id}:${name}`;
    if (seenMetrics.current.has(metricKey)) {
      return;
    }
    seenMetrics.current.add(metricKey);

    const body = JSON.stringify({
      id,
      name,
      label,
      value: value.toString(),
      path: window.location.pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/vitals", body);
      return;
    }

    fetch("/api/analytics/vitals", {
      body,
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => {
      // Metrics should never interfere with route work.
    });
  });

  return null;
}
