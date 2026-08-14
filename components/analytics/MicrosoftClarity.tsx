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

    Clarity.init(projectId);
    window.__splashdealsClarityInitialized = true;
  }, [projectId]);

  return null;
}
