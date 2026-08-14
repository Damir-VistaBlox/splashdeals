import { chromium, devices } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const targetUrl = process.argv[2] || "http://127.0.0.1:3002/";
const outputDir = process.argv[3] || "/tmp/lcp-attribution";

const deviceMatrix = [
  { name: "iPhone 13", key: "iphone13" },
  { name: "Pixel 7", key: "pixel7" },
];

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const deviceInfo of deviceMatrix) {
  const context = await browser.newContext({
    ...devices[deviceInfo.name],
  });

  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    connectionType: "cellular3g",
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.addInitScript(() => {
    window.__lcpProbe = {
      entries: [],
      supported: typeof PerformanceObserver !== "undefined",
    };

    if (typeof PerformanceObserver === "undefined") return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const element = entry.element || null;
        let attr = null;

        if (element) {
          attr = element.getAttribute("data-lcp-probe");
          if (!attr) {
            attr = `lcp-${Math.random().toString(36).slice(2, 10)}`;
            element.setAttribute("data-lcp-probe", attr);
          }
        }

        window.__lcpProbe.entries.push({
          entryType: entry.entryType,
          startTime: entry.startTime,
          renderTime: entry.renderTime || null,
          loadTime: entry.loadTime || null,
          size: entry.size || null,
          id: entry.id || null,
          url: entry.url || null,
          elementTag: element?.tagName || null,
          elementId: element?.id || null,
          elementClass: element?.className || null,
          elementText: element?.textContent?.trim().slice(0, 220) || null,
          outerHTML: element?.outerHTML?.slice(0, 700) || null,
          probeAttr: attr,
          rect: element
            ? {
                x: element.getBoundingClientRect().x,
                y: element.getBoundingClientRect().y,
                width: element.getBoundingClientRect().width,
                height: element.getBoundingClientRect().height,
              }
            : null,
        });
      }
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "hidden") observer.disconnect();
      },
      { once: true },
    );
  });

  await page.goto(targetUrl, { waitUntil: "load" });
  await page.waitForTimeout(3500);

  const probe = await page.evaluate(() => {
    const entries = window.__lcpProbe?.entries || [];
    return {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio,
      },
      entries,
      finalEntry: entries.at(-1) || null,
      h1: (() => {
        const node = document.querySelector("h1");
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return {
          text: node.textContent?.trim().slice(0, 220) || null,
          outerHTML: node.outerHTML.slice(0, 500),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        };
      })(),
    };
  });

  if (probe.finalEntry?.probeAttr) {
    await page.evaluate((attr) => {
      const node = document.querySelector(`[data-lcp-probe="${attr}"]`);
      if (!node) return;
      node.setAttribute(
        "style",
        `${node.getAttribute("style") || ""}; outline: 4px solid #ef4444 !important; outline-offset: 4px !important;`,
      );
    }, probe.finalEntry.probeAttr);
  }

  const screenshotPath = path.join(outputDir, `${deviceInfo.key}-home-lcp.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });

  results.push({
    device: deviceInfo.name,
    throttleProfile: {
      latencyMs: 150,
      downloadMbps: 1.6,
      uploadKbps: 750,
      cpuSlowdownRate: 4,
    },
    screenshotPath,
    ...probe,
  });

  await context.close();
}

await browser.close();

const reportPath = path.join(outputDir, "report.json");
await fs.writeFile(
  reportPath,
  JSON.stringify({ targetUrl, generatedAt: new Date().toISOString(), results }, null, 2),
);

console.log(JSON.stringify({ reportPath, results }, null, 2));
