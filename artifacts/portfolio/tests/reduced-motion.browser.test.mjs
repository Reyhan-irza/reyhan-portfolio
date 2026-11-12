import { mockServices } from "./helpers/services.mjs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";
import { chromium } from "playwright-core";

const portfolioRoot = fileURLToPath(new URL("..", import.meta.url));
let viteProcess;
let browser;

after(async () => {
  await browser?.close();
  if (viteProcess && viteProcess.exitCode === null) {
    viteProcess.kill("SIGTERM");
    await new Promise((resolve) => viteProcess.once("exit", resolve));
  }
});

async function findOpenPort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  try {
    return execFileSync("which", ["chromium"], { encoding: "utf8" }).trim();
  } catch {
    throw new Error("Chromium was not found. Set CHROMIUM_PATH to a Chromium executable.");
  }
}

async function waitForServer(url, processOutput) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (viteProcess.exitCode !== null) {
      throw new Error(`Vite exited before becoming ready:\n${processOutput()}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await delay(100);
  }
  throw new Error(`Vite did not become ready at ${url}:\n${processOutput()}`);
}

async function assertPopupOpens(context, page, selector, expectedPath) {
  // Headless Chromium may download PDFs instead of opening a PDF viewer.
  // Check the actual file bytes and requested URL in either browser mode.
  if (expectedPath.endsWith(".pdf")) {
    const link = page.locator(selector);
    const href = await link.getAttribute("href");
    assert.ok(new URL(href, page.url()).pathname.endsWith(expectedPath));
    assert.equal(await link.getAttribute("target"), "_blank");
    if (process.env.PORTFOLIO_BUILD_DIRECTORY) {
      const { readFile } = await import('node:fs/promises');
      const bytes = await readFile(path.join(process.env.PORTFOLIO_BUILD_DIRECTORY, new URL(href, page.url()).pathname));
      assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    } else {
      const response = await context.request.get(new URL(href, page.url()).href);
      assert.ok(response.ok());
      assert.equal((await response.body()).subarray(0, 5).toString(), "%PDF-");
    }
    const requested = context.waitForEvent("request", (request) => new URL(request.url()).pathname.endsWith(expectedPath));
    await link.click();
    await requested;
    return;
  }
  const popupPromise = context.waitForEvent("page");
  await page.locator(selector).click();
  const popup = await popupPromise;
  await popup.waitForURL((url) => url.pathname.endsWith(expectedPath), { timeout: 10_000 });
  assert.ok(popup.url().endsWith(expectedPath), `Expected popup to open ${expectedPath}, got ${popup.url()}`);
  await popup.close();
}

test("journey and all certificates stay visible and usable with reduced motion", { timeout: 120_000 }, async (t) => {
  const port = process.env.PORTFOLIO_BUILD_DIRECTORY ? 0 : await findOpenPort();
  const baseUrl = process.env.PORTFOLIO_BUILD_DIRECTORY ? "http://localhost:4173" : `http://127.0.0.1:${port}`;
  const vitePath = path.join(portfolioRoot, "node_modules/vite/bin/vite.js");
  const viteEnv = { ...process.env, PORT: String(port), BASE_PATH: "/" };
  delete viteEnv.REPL_ID;

  let output = "";
  if (!process.env.PORTFOLIO_BUILD_DIRECTORY) {
  viteProcess = spawn(process.execPath, [
    vitePath,
    "--config",
    path.join(portfolioRoot, "vite.config.ts"),
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort",
  ], { cwd: portfolioRoot, env: viteEnv, stdio: ["ignore", "pipe", "pipe"] });
  viteProcess.stdout.setEncoding("utf8").on("data", (chunk) => { output += chunk; });
  viteProcess.stderr.setEncoding("utf8").on("data", (chunk) => { output += chunk; });
  await waitForServer(baseUrl, () => output);
  }

  browser = await chromium.launch({
    executablePath: findChromium(),
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
    acceptDownloads: true,
  });
  await mockServices(context);
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && document.querySelectorAll("#journey [data-education-row]").length === 4
    && document.querySelectorAll("#achievement > .award-record").length === 3
    && !document.querySelector(".rv-intro"),
  );

  await t.test("all education rows and achievement cards are fully visible before scrolling", async () => {
    const visibleContent = await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll("#journey [data-education-row]"),
        ...document.querySelectorAll("#achievement > .award-record"),
      ];
      return elements.map((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          label: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 60),
          opacity: Number(style.opacity),
          visibility: style.visibility,
          width: rect.width,
          height: rect.height,
        };
      });
    });

    assert.equal(visibleContent.length, 7, "Expected four education rows and three achievement cards");
    for (const item of visibleContent) {
      assert.equal(item.visibility, "visible", `${item.label} should not be hidden`);
      assert.ok(item.opacity >= 0.99, `${item.label} should be fully opaque, got ${item.opacity}`);
      assert.ok(item.width > 0 && item.height > 0, `${item.label} should have a visible layout box`);
    }
  });

  await t.test("all certificate previews load and open their full-size files", async () => {
    const previews = [
      {
        selector: '[data-testid="link-certificate-preview"]',
        viewSelector: '[data-testid="link-view-certificate"]',
        downloadSelector: '[data-testid="link-download-certificate"]',
        file: "sertifikat-lks-it-software-solution-2025.pdf",
        downloadName: "sertifikat-lks-it-software-solution-2025.pdf",
      },
      {
        selector: '[data-testid="link-pustaka-certificate-preview"]',
        viewSelector: '[data-testid="link-view-pustaka-certificate"]',
        downloadSelector: '[data-testid="link-download-pustaka-certificate"]',
        file: "sertifikat-apresiasi-inovasi-digital-2026.webp",
        downloadName: "sertifikat-apresiasi-inovasi-digital-2026.webp",
      },
      {
        selector: '[data-testid="link-cadiak-certificate-preview"]',
        viewSelector: '[data-testid="link-view-cadiak-certificate"]',
        downloadSelector: '[data-testid="link-download-cadiak-certificate"]',
        file: "sertifikat-cadiak-ctf-2026.pdf",
        downloadName: "sertifikat-cadiak-ctf-2026.pdf",
      },
    ];

    for (const preview of previews) {
      const link = page.locator(preview.selector);
      await link.scrollIntoViewIfNeeded();
      await page.waitForFunction((selector) => {
        const image = document.querySelector(`${selector} img`);
        return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      }, preview.selector);

      const assetResponse = await page.evaluate(async (selector) => {
        const href = document.querySelector(selector)?.getAttribute("href");
        if (!href) throw new Error(`Missing certificate link for ${selector}`);
        const response = await fetch(href);
        return { status: response.status, contentType: response.headers.get("content-type") };
      }, preview.selector);
      assert.equal(assetResponse.status, 200, `${preview.file} should be served successfully`);
      assert.match(assetResponse.contentType ?? "", /^(application\/pdf|image\/webp)/);

      assert.equal(await link.getAttribute("target"), "_blank");
      assert.ok((await link.getAttribute("href")).endsWith(preview.file));
      assert.equal(await link.isVisible(), true);
      await assertPopupOpens(context, page, preview.selector, preview.file);
      await assertPopupOpens(context, page, preview.viewSelector, preview.file);

      const downloadLink = page.locator(preview.downloadSelector);
      assert.equal(await downloadLink.getAttribute("download"), preview.downloadName);
      const downloadPromise = page.waitForEvent("download");
      await downloadLink.click();
      const download = await downloadPromise;
      assert.equal(download.suggestedFilename(), preview.downloadName);
    }
  });

  await t.test("rating submission recovers from a summary error and persists the selection", async () => {
    let summaryAvailable = false;
    let submitted;
    await page.route("**/rest/v1/portfolio_rating_summary*", (route) => summaryAvailable
      ? route.fulfill({ json: { rating_count: 1, average_rating: 4 } })
      : route.fulfill({ status: 503, json: { message: "Summary temporarily unavailable" } }));
    await page.route("**/rest/v1/rpc/submit_portfolio_rating", (route) => {
      submitted = route.request().postDataJSON();
      summaryAvailable = true;
      return route.fulfill({ status: 204, body: "" });
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText("Rating belum dapat dimuat. Periksa koneksi Supabase.", { exact: true }).waitFor();
    await page.getByRole("button", { name: "4 dari 5 bintang", exact: true }).click();
    await page.getByText("Terima kasih, penilaian Anda sudah tersimpan.", { exact: true }).waitFor();
    assert.equal(submitted.p_rating, 4);
    assert.match(submitted.p_visitor_id, /^[0-9a-f-]{36}$/i);
    assert.equal(await page.getByText("Rating belum dapat dimuat. Periksa koneksi Supabase.", { exact: true }).count(), 0);
    await page.getByText("4.0 / 5", { exact: true }).waitFor();
    await page.reload({ waitUntil: "domcontentloaded" });
    const selectedStar = page.getByRole("button", { name: "4 dari 5 bintang", exact: true });
    await selectedStar.waitFor();
    assert.equal(await selectedStar.getAttribute("aria-pressed"), "true");
  });

  await t.test("fixed palette ignores OS changes and saved preferences", async () => {
    const fixed = await browser.newContext({ reducedMotion: "reduce", colorScheme: "light" });
    await mockServices(fixed);
    await fixed.addInitScript(() => localStorage.setItem("rv-theme", "light"));
    try {
      const page = await fixed.newPage();
      await page.goto(baseUrl);
      await page.locator("#home h1").waitFor();
      for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({ colorScheme });
        assert.equal(await page.getByRole("button", { name: /^(light|dark) mode$/i }).count(), 0);
        assert.ok(await page.locator("html").evaluate(el => el.classList.contains("dark") && !el.dataset.theme));
        for (const width of [320,390,768,1280]) {
          await page.setViewportSize({width,height:900});
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        }
        await page.getByTestId("button-details-1").click();
        const dialog = page.getByTestId("project-detail-dialog");
        const colors = await dialog.evaluate(el => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
        assert.notEqual(colors[0], colors[1]);
        await page.keyboard.press("Escape");
        await dialog.waitFor({state:"detached"});
      }
    } finally { await fixed.close(); }
  });

  await t.test("mobile intro fits, typing changes, and music controls remain inside their card", async () => {
    const motionContext = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 390, height: 844 } });
    await mockServices(motionContext);
    try {
      const mobile = await motionContext.newPage();
      await mobile.goto(baseUrl);
      await mobile.locator('#rv-intro .name').waitFor();
      for (const width of [320, 390]) {
        await mobile.setViewportSize({ width, height: 844 });
        const name = await mobile.locator('#rv-intro .name').boundingBox();
        assert.ok(name.x >= 0 && name.x + name.width <= width, 'intro name fits viewport');
      }
      await mobile.getByRole('button', { name: 'Skip introduction' }).click();
      await mobile.waitForFunction(() => document.querySelector('.hero-typing-loop')?.textContent.trim().length > 3);
      const first = await mobile.locator('.hero-typing-loop').textContent();
      await mobile.waitForFunction(value => document.querySelector('.hero-typing-loop')?.textContent !== value, first);
      await mobile.locator('.secondary-archive summary').click();
      const slider = mobile.getByRole('slider', { name: 'Volume' });
      const bounds = await slider.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 320, 'volume stays inside viewport');
    } finally { await motionContext.close(); }
  });

  await t.test("home renders when legacy theme storage is blocked", async () => {
    const blockedContext = await browser.newContext({ reducedMotion: "reduce", colorScheme: "light" });
    await mockServices(blockedContext);
    await blockedContext.addInitScript(() => {
      const originalGet = Storage.prototype.getItem;
      const originalSet = Storage.prototype.setItem;
      Storage.prototype.getItem = function(key) {
        if (key === 'rv-theme') throw new DOMException('Blocked', 'SecurityError');
        return originalGet.call(this, key);
      };
      Storage.prototype.setItem = function(key, value) {
        if (key === 'rv-theme') throw new DOMException('Blocked', 'SecurityError');
        return originalSet.call(this, key, value);
      };
    });
    try {
      const blockedPage = await blockedContext.newPage();
      await blockedPage.goto(baseUrl);
      await blockedPage.locator("#home h1").waitFor();
      assert.ok(await blockedPage.locator("html").evaluate(el => el.classList.contains("dark") && !el.dataset.theme));
    } finally { await blockedContext.close(); }
  });

  await t.test("a rendering failure leaves the static portfolio reachable", { skip: Boolean(process.env.PORTFOLIO_BUILD_DIRECTORY) }, async () => {
    const fallbackContext = await browser.newContext({ reducedMotion: "reduce" });
    try {
      await mockServices(fallbackContext);
      await fallbackContext.route("**/src/components/HeroSection.tsx", (route) => route.fulfill({
        contentType: "application/javascript",
        body: 'export default function HeroSection() { throw new Error("Simulated render failure"); }',
      }));
      const fallbackPage = await fallbackContext.newPage();
      await fallbackPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await fallbackPage.getByText("Motion is unavailable. This static portfolio version is still usable.", { exact: true }).waitFor();
      assert.equal(await fallbackPage.getByRole("heading", { name: "Reyhan Irza Alvano", exact: true }).count(), 1);
      assert.ok(await fallbackPage.getByRole("link", { name: "Contact", exact: true }).count() > 0);
    } finally {
      await fallbackContext.close();
    }
  });

  await context.close();
  assert.deepEqual(pageErrors, [], `Unexpected browser errors: ${pageErrors.join("; ")}`);
});
