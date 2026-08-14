import { chromium, devices } from "@playwright/test";

const url = process.argv[2];
const deviceName = process.argv[3] || "iPhone 13";
const outputPath = process.argv[4] || "/tmp/waited-screenshot.png";
const waitMs = Number(process.argv[5] || 3000);

if (!url) {
  console.error("Usage: node scripts/waited-screenshot.mjs <url> [deviceName] [outputPath] [waitMs]");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...(devices[deviceName] || devices["iPhone 13"]),
});
const page = await context.newPage();

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(waitMs);
await page.screenshot({ path: outputPath, fullPage: false });

await context.close();
await browser.close();

console.log(JSON.stringify({ url, deviceName, outputPath, waitMs }, null, 2));
