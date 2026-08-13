import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildPublicTicketUrl,
  buildSuccessPageUrl,
  getPublicSiteUrl,
} from "@/app/(server)/lib/ticket-assets";

describe("ticket assets helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers NEXT_PUBLIC_SITE_URL for public URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.splashdeals.rs/");
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://fallback.example");

    expect(getPublicSiteUrl()).toBe("https://www.splashdeals.rs");
    expect(buildPublicTicketUrl("abc123")).toBe("https://www.splashdeals.rs/verify/abc123");
    expect(buildSuccessPageUrl("cs_test_123")).toBe(
      "https://www.splashdeals.rs/success?session_id=cs_test_123",
    );
  });

  it("falls back to NEXT_PUBLIC_BASE_URL when needed", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://preview.splashdeals.rs/");

    expect(getPublicSiteUrl()).toBe("https://preview.splashdeals.rs");
  });
});
