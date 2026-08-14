"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const DEFAULT_PROJECT_ID = "wltzabiuq2";

let clarityStarted = false;

/**
 * Microsoft Clarity bootstrap for user-facing surfaces only.
 *
 * Mounted from `(web)` and `(account)` route-group layouts.
 * Intentionally NOT mounted from admin layouts.
 */
export function MicrosoftClarity() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID || DEFAULT_PROJECT_ID;

    if (!projectId || clarityStarted) return;

    Clarity.init(projectId);
    clarityStarted = true;
  }, []);

  return null;
}
