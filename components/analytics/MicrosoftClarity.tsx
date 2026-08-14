"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

declare global {
  interface Window {
    __splashdealsClarityInitialized?: boolean;
  }
}

const DEFAULT_CLARITY_PROJECT_ID = "wltzabiuq2";

/**
 * Buyer-facing Microsoft Clarity bootstrap.
 * Mounted by `(web)` and `(account)` layouts only — never admin.
 */
export function ClarityScript() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || DEFAULT_CLARITY_PROJECT_ID;

  useEffect(() => {
    if (!projectId || typeof window === "undefined") return;
    if (window.__splashdealsClarityInitialized) return;

    const init = () => {
      if (window.__splashdealsClarityInitialized) return;
      Clarity.init(projectId);
      window.__splashdealsClarityInitialized = true;
    };

    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll"];
    const interactionOptions: AddEventListenerOptions = { passive: true };
    const onFirstInteraction = () => {
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, onFirstInteraction, interactionOptions),
      );
      window.clearTimeout(timeoutId);
      init();
    };
    const timeoutId = window.setTimeout(init, 6000);

    interactionEvents.forEach((eventName) =>
      window.addEventListener(eventName, onFirstInteraction, interactionOptions),
    );

    return () => {
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, onFirstInteraction, interactionOptions),
      );
      window.clearTimeout(timeoutId);
    };
  }, [projectId]);

  return null;
}
