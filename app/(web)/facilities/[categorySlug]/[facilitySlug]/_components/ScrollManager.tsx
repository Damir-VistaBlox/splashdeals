"use client";

import { useEffect } from "react";

export function ScrollManager() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // Detect if path matches the dynamic tickets landing pattern
      const isTicketsPath = pathname.endsWith("/dnevne-ulaznice");

      if (isTicketsPath || hash) {
        // Use a small micro-task delay to ensure Next.js hydration and rendering are complete
        setTimeout(() => {
          let targetElement = null;

          if (hash) {
            const targetId = hash.replace("#", "");
            targetElement = document.getElementById(targetId);
          }

          // Fallback to `#deals` section if specific element isn't found or path is `/dnevne-ulaznice`
          if (!targetElement) {
            targetElement = document.getElementById("deals");
          }

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      }
    }
  }, []);

  return null;
}
