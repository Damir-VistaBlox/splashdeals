import { expect, test, type Page } from "@playwright/test";

async function waitForApp(page: Page) {
  await page.goto("/");
  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.locator("header")).toBeVisible({ timeout: 30_000 });
}

test.describe("mobile viewport qa", () => {
  test("iphone-width public and account entry surfaces", async ({ page }) => {
    test.setTimeout(45_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await waitForApp(page);

    await page.screenshot({ path: "/tmp/qa-home-iphone-top.png", fullPage: false });
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "/tmp/qa-home-iphone-scrolled.png", fullPage: false });

    await page.goto("/akva-parkovi");
    await expect(page.locator("h1")).toBeVisible({ timeout: 30_000 });
    await page.screenshot({ path: "/tmp/qa-category-iphone.png", fullPage: false });

    await page.goto("/search?q=beograd");
    await expect(page.locator("h1")).toBeVisible({ timeout: 30_000 });
    await page.screenshot({ path: "/tmp/qa-search-iphone.png", fullPage: false });

    await page.goto("/prijava");
    await expect(page.locator("h1")).toContainText(/prijava|login/i, { timeout: 30_000 });
    await page.screenshot({ path: "/tmp/qa-signin-iphone.png", fullPage: false });
  });

  test("android-width cart and sticky chrome", async ({ page }) => {
    test.setTimeout(45_000);
    await page.setViewportSize({ width: 412, height: 915 });
    await waitForApp(page);

    const bottomNav = page.getByRole("navigation", { name: /mobilna navigacija/i });
    await expect(bottomNav).toBeVisible({ timeout: 30_000 });

    await page.goto("/cart");
    await expect(page.locator("#main-content")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("#cart-page-title")).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: "/tmp/qa-cart-android.png", fullPage: false });

    await page.goto("/search?q=beograd");
    await expect(page.locator("h1")).toBeVisible({ timeout: 30_000 });
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "/tmp/qa-search-android-scrolled.png", fullPage: false });
  });
});
