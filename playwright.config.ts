import { defineConfig } from "@playwright/test";

/**
 * 🌊 Splashdeals E2E Test Configuration
 * Targets the full Stripe checkout flow in test mode.
 *
 * Prerequisites:
 *   1. Stripe CLI running: stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
 *   2. .env.test with STRIPE_SECRET_KEY (sk_test_...) and STRIPE_WEBHOOK_SECRET (whsec_...)
 *   3. Test DB seeded with active tickets
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report" }]]
    : [["list"], ["html", { outputFolder: "playwright-report" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3000",
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  // WebServer management disabled for sandbox compatibility.
  // Start the dev server manually BEFORE running tests:
  //   npm run dev
  // Then:
  //   npm run test:e2e
  webServer: undefined,
});
