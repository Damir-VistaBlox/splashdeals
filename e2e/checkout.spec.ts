/**
 * 🌊 Splashdeals Checkout E2E Test Suite
 *
 * Tests the full payment lifecycle:
 *   1. POST /api/checkout → creates Stripe Checkout Session
 *   2. DB → verifies PENDING Transaction is created
 *   3. Stripe Checkout → user fills test card → pays
 *   4. Stripe redirect → /success page loads
 *   5. Webhook → IssuedTickets minted, Transaction → SUCCESS
 *   6. GET /api/checkout/status → returns SUCCESS
 *   7. Idempotency → replaying webhook doesn't duplicate tickets
 *
 * ⚠️ Before running:
 *   1. Start dev server: npm run dev
 *   2. `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`
 *   3. Copy the signing secret (whsec_xxx) into .env as STRIPE_WEBHOOK_SECRET
 *   4. Set STRIPE_SECRET_KEY to your sk_live_xxx or sk_test_xxx key
 *   5. Update e2e/fixtures/test-data.ts with real ticket IDs from your DB
 *
 * Usage:
 *   npx playwright test e2e/checkout.spec.ts
 *   npx playwright test e2e/checkout.spec.ts --headed  (see the browser)
 */

import { test, expect } from "@playwright/test";
import { getStripeClient, buildSignedWebhookPayload, waitForFulfillment, TEST_CARDS } from "./helpers/stripe";
import { TEST_TICKETS, TEST_USER } from "./fixtures/test-data";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import fs from "node:fs";
import path from "node:path";

// Manually load .env
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  }
} catch {
  // .env not found or error reading
}

// ──────────────────────────────────────────────
// Prisma Client for DB assertions
// ──────────────────────────────────────────────
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL || "" }),
});

// ──────────────────────────────────────────────
// Guard: fail fast if test data isn't configured
// ──────────────────────────────────────────────
test.beforeAll(() => {
  if (TEST_TICKETS.ADULT_DAY_PASS.id.startsWith("REPLACE")) {
    throw new Error(
      "❌ Test data not configured! Update e2e/fixtures/test-data.ts with real ticket IDs from your database."
    );
  }
});

// ──────────────────────────────────────────────
// Track session across tests
// ──────────────────────────────────────────────
let sessionId: string = "";

// ──────────────────────────────────────────────
// Cleanup after ALL tests
// ──────────────────────────────────────────────
test.afterAll(async () => {
  if (sessionId && prisma) {
    console.log(`🧹 Cleaning up test session: ${sessionId}`);
    try {
      await prisma.issuedTicket.deleteMany({
        where: { transaction: { stripeSession: sessionId } },
      });
      await prisma.transaction.deleteMany({
        where: { stripeSession: sessionId },
      });
    } catch (e) {
      console.warn(`[TEST CLEANUP] Failed: ${e}`);
    }
    await prisma.$disconnect().catch(() => {});
  }
});

// ─── Test 1: Create Checkout Session ─────────────────────────────────────────
test.describe.serial("Full Stripe Checkout Flow", () => {
  test("1. POST /api/checkout — creates Stripe Checkout Session", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: {
        items: [
          {
            ticketId: TEST_TICKETS.ADULT_DAY_PASS.id,
            quantity: TEST_TICKETS.ADULT_DAY_PASS.quantity,
          },
        ],
        email: TEST_USER.email,
        holderName: TEST_USER.name,
      },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("url");
    expect(body.url).toContain("checkout.stripe.com");

    // Extract session ID (cs_live_... for production keys, cs_test_... for test keys)
    const match = body.url.match(/cs_(?:test|live)_[a-zA-Z0-9]+/);
    expect(match).toBeTruthy();
    sessionId = match![0];

    console.log(`✅ Checkout session created: ${sessionId}`);
  });

  // ─── Test 2: Verify DB Transaction ───────────────────────────────────────────
  test("2. DB — PENDING Transaction created", async () => {
    test.skip(!prisma, "DB helper unavailable in this environment");
    expect(sessionId).toBeTruthy();

    // Give the DB a moment to persist
    await new Promise((r) => setTimeout(r, 1_500));

    const transaction = await prisma.transaction.findFirst({
      where: { stripeSession: sessionId },
    });

    expect(transaction).toBeTruthy();
    expect(transaction!.status).toBe("PENDING");
    expect(transaction!.currency).toBe("RSD");
    expect(Number(transaction!.totalAmount)).toBeGreaterThan(0);

    console.log(
      `✅ PENDING transaction found: ${transaction!.id} | RSD ${transaction!.totalAmount}`
    );
  });

  // ─── Test 3: Stripe Checkout — pay with test card ────────────────────────────
  // NOTE: This test requires --headed mode AND Stripe Checkout sandbox access.
  // In CI/headless, Stripe's hosted page may not render properly.
  // Run locally: npm run test:e2e:headed -- --grep "pay with 4242"
  test.skip("3. Stripe Checkout — pay with 4242 test card (requires headed mode)", async ({ page }) => {
    expect(sessionId).toBeTruthy();

    // Retrieve the Checkout Session to get the hosted page URL
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const checkoutUrl = session.url;
    expect(checkoutUrl).toBeTruthy();

    // Navigate to Stripe's hosted Checkout page
    await page.goto(checkoutUrl!, { waitUntil: "networkidle" });
    console.log(`📍 Navigated to Stripe Checkout`);

    // Wait for the Stripe Checkout iframe to render
    await page.waitForTimeout(3_000);

    // Try filling card fields via the most reliable selectors
    // Stripe Checkout uses shadow DOM — we target the iframe
    const checkoutFrame = page.frameLocator("iframe[title*='checkout']").first();

    // Fill card number
    const cardNumberInput = checkoutFrame.locator("input[aria-label*='Card number'], input[name='cardnumber']");
    await cardNumberInput.waitFor({ state: "visible", timeout: 10_000 });
    await cardNumberInput.fill(TEST_CARDS.SUCCESS);
    console.log("💳 Filled card number");

    // Fill expiry date (future date)
    const expInput = checkoutFrame.locator("input[aria-label*='Expiration'], input[name='exp-date']");
    await expInput.fill("12/30");
    console.log("📅 Filled expiry");

    // Fill CVC
    const cvcInput = checkoutFrame.locator("input[aria-label*='CVC'], input[name='cvc']");
    await cvcInput.fill("123");
    console.log("🔐 Filled CVC");

    // Fill cardholder name if field is visible
    const nameInput = checkoutFrame.locator("input[aria-label*='Name'], input[name='cardholder-name']");
    if (await nameInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await nameInput.fill(TEST_USER.name);
      console.log("✍️ Filled name");
    }

    // Submit — look for the pay button
    const submitButton = checkoutFrame.locator("button[type='submit'], button:has-text('Pay')");
    await submitButton.click();
    console.log("🚀 Submitted payment");

    // After successful payment, Stripe redirects to our success page
    await page.waitForURL("**/success**", { timeout: 45_000 });
    console.log(`✅ Redirected to: ${page.url()}`);
  });

  // ─── Test 4: Success page (requires Test 3 to complete first) ───────────────
  test.skip("4. /success — page renders with ticket data (requires Test 3)", async ({ page }) => {
    // The success page hydrates from client-side dictionary + polls /api/checkout/status
    await page.waitForTimeout(2_000);

    // Check the page rendered without crashing
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toBeTruthy();

    // The SuccessClient component should show the transaction was completed
    // Look for confirmation language in either locale
    const successIndicators = [
      "success",
      "uspešno",
      "ticket",
      "karta",
      "wallet",
      "receipt",
      "račun",
    ];

    const hasSuccessContent = successIndicators.some((word) =>
      bodyText.toLowerCase().includes(word)
    );

    // It's acceptable if the page shows "payment successful" in either language
    // If the webhook hasn't fired yet, it will show a polling state
    console.log(`📄 Success page content length: ${bodyText.length} chars`);
    expect(hasSuccessContent || bodyText.includes("session_id")).toBe(true);
  });

  // ─── Test 5: Webhook fulfillment (runs after headed Test 3) ─────────────────
  test.skip("5. DB — webhook minted IssuedTickets (requires Test 3)", async () => {
    test.skip(!prisma, "DB helper unavailable in this environment");
    expect(sessionId).toBeTruthy();

    // Wait for webhook processing
    const fulfilled = await waitForFulfillment(sessionId, "http://127.0.0.1:3000");
    expect(fulfilled).toBe(true);

    // Now verify the DB state
    const transaction = await prisma.transaction.findFirst({
      where: { stripeSession: sessionId },
      include: { issuedTickets: true },
    });

    expect(transaction).toBeTruthy();
    expect(transaction!.status).toBe("SUCCESS");
    expect(transaction!.issuedTickets.length).toBe(TEST_TICKETS.ADULT_DAY_PASS.quantity);

    // Each ticket should have a unique qrHash
    const qrHashes = transaction!.issuedTickets.map((t) => t.qrHash);
    expect(new Set(qrHashes).size).toBe(TEST_TICKETS.ADULT_DAY_PASS.quantity);

    console.log(
      `✅ ${transaction!.issuedTickets.length} tickets minted for session ${sessionId}`
    );
  });

  // ─── Test 6: Status endpoint (runs after headed Test 3) ─────────────────────
  test.skip("6. GET /api/checkout/status — returns SUCCESS with tickets (requires Test 3)", async ({ request }) => {
    expect(sessionId).toBeTruthy();

    const res = await request.get(`/api/checkout/status?session_id=${sessionId}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("SUCCESS");
    expect(body.issuedTickets).toBeDefined();
    expect(body.issuedTickets.length).toBe(TEST_TICKETS.ADULT_DAY_PASS.quantity);
    expect(body.issuedTickets[0]).toHaveProperty("qrHash");
    expect(body.issuedTickets[0]).toHaveProperty("status", "ACTIVE");
  });

  // ─── Test 7: Idempotency (runs after headed Test 3 + 5) ─────────────────────
  test.skip("7. Idempotency — replaying webhook doesn't duplicate tickets (requires Test 3)", async () => {
    test.skip(!prisma, "DB helper unavailable in this environment");
    expect(sessionId).toBeTruthy();

    // Count current tickets
    const beforeCount = await prisma.issuedTicket.count({
      where: { transaction: { stripeSession: sessionId } },
    });

    // Simulate a webhook replay by constructing a signed event
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret) {
      const { payload, signature } = buildSignedWebhookPayload(session, webhookSecret);

      const res = await fetch(
        "http://127.0.0.1:3000/api/webhooks/stripe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Stripe-Signature": signature,
          },
          body: payload,
        }
      );
      expect(res.status).toBe(200);
    }

    // Give the handler a moment
    await new Promise((r) => setTimeout(r, 2_000));

    // Verify no new tickets were created
    const afterCount = await prisma.issuedTicket.count({
      where: { transaction: { stripeSession: sessionId } },
    });
    expect(afterCount).toBe(beforeCount);

    console.log(`✅ Idempotency verified: ${beforeCount} tickets before and after replay`);
  });
});

// ─── Edge Case: Checkout API validation ──────────────────────────────────────
test.describe("Checkout API validation", () => {
  test("POST /api/checkout — rejects empty items", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: { items: [] },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/checkout — rejects zero quantity", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: {
        items: [{ ticketId: TEST_TICKETS.ADULT_DAY_PASS.id, quantity: 0 }],
      },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/checkout — rejects over-limit quantity", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: {
        items: [{ ticketId: TEST_TICKETS.ADULT_DAY_PASS.id, quantity: 51 }],
      },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/checkout — rejects invalid ticket ID", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: {
        items: [{ ticketId: "00000000-0000-0000-0000-000000000000", quantity: 1 }],
      },
    });
    expect(res.status()).toBe(404);
  });

  test("POST /api/checkout — rejects missing required fields", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: { items: [{ ticketId: "not-a-uuid" }] },
    });
    expect(res.status()).toBe(400);
  });
});

// ─── Edge Case: Status endpoint ──────────────────────────────────────────────
test.describe("Status endpoint edge cases", () => {
  test("GET /api/checkout/status — returns 400 without session_id", async ({ request }) => {
    const res = await request.get("/api/checkout/status");
    expect(res.status()).toBe(400);
  });

  test("GET /api/checkout/status — returns PENDING for unknown session", async ({ request }) => {
    const res = await request.get(
      "/api/checkout/status?session_id=cs_live_nonexistent_session_id"
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("PENDING");
  });
});
