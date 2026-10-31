import { mockServices } from "./helpers/services.mjs";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
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

async function assertActiveMobileSection(page, href, context) {
  await page.waitForFunction((expectedHref) => {
    const links = Array.from(document.querySelectorAll("#mobile-navigation nav a[href]"));
    const currentLinks = links.filter((link) => link.getAttribute("aria-current") === "location");
    const markedLinks = links.filter((link) =>
      Array.from(link.children).some((child) => child.classList.contains("ml-auto")),
    );
    return currentLinks.length === 1
      && markedLinks.length === 1
      && currentLinks[0] === markedLinks[0]
      && currentLinks[0].getAttribute("href") === expectedHref;
  }, href, { timeout: 3000 }).catch(() => {});

  const activeState = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("#mobile-navigation nav a[href]"));
    const currentLinks = links.filter((link) => link.getAttribute("aria-current") === "location");
    const markedLinks = links.filter((link) =>
      Array.from(link.children).some((child) => child.classList.contains("ml-auto")),
    );
    return {
      currentHrefs: currentLinks.map((link) => link.getAttribute("href")),
      markedHrefs: markedLinks.map((link) => link.getAttribute("href")),
    };
  });

  assert.deepEqual(activeState.currentHrefs, [href], `${context}: exactly the matching link should have aria-current`);
  assert.deepEqual(activeState.markedHrefs, [href], `${context}: exactly the matching link should show the active marker`);
}

test("mobile navigation stays reachable and contains scrolling on short screens", { timeout: 60_000 }, async () => {
  const port = await findOpenPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const vitePath = path.join(portfolioRoot, "node_modules/vite/bin/vite.js");
  const viteEnv = { ...process.env, PORT: String(port), BASE_PATH: "/" };
  delete viteEnv.REPL_ID;

  let output = "";
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

  browser = await chromium.launch({
    executablePath: findChromium(),
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  await mockServices(context);
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#home") !== null);
  await page.locator(".rv-intro-skip").click();
  await page.locator(".rv-intro").waitFor({ state: "detached" });
  await page.waitForFunction(() => document.querySelector('[data-testid="button-mobile-menu"]') !== null);

  await page.evaluate(() => {
    const contact = document.querySelector("#contact");
    window.scrollTo({ top: contact.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  });
  await page.waitForFunction(() =>
    document.querySelector("#contact").getBoundingClientRect().top <= window.innerHeight * 0.56
    && document.querySelector('.editorial-nav-link[href="#contact"]')?.getAttribute("aria-current") === "location",
  );
  await page.locator('[data-testid="button-mobile-menu"]').click();
  await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.getAttribute("aria-hidden") === "false");
  await assertActiveMobileSection(page, "#contact", "opening after scrolling to Contact");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.getAttribute("aria-hidden") === "true");

  await page.evaluate(() => {
    window.location.hash = "#journey";
  });
  await page.waitForFunction(() =>
    window.location.hash === "#journey"
    && document.querySelector('.editorial-nav-link[href="#journey"]')?.getAttribute("aria-current") === "location",
  );
  await page.locator('[data-testid="button-mobile-menu"]').click();
  await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.getAttribute("aria-hidden") === "false");
  await assertActiveMobileSection(page, "#journey", "opening after following a section hash");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.getAttribute("aria-hidden") === "true");

  for (const viewport of [
    { name: "short portrait", width: 360, height: 540 },
    { name: "short landscape", width: 844, height: 360 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.evaluate(() => window.scrollTo({ top: 420, behavior: "instant" }));
    const backgroundScrollBeforeOpen = await page.evaluate(() => window.scrollY);
    await page.locator('[data-testid="button-mobile-menu"]').click();
    const panel = page.locator("#mobile-navigation");
    await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.getAttribute("aria-hidden") === "false");
    await page.waitForFunction(() => {
      const menuItems = Array.from(document.querySelectorAll("#mobile-navigation [data-menu-item]"));
      return menuItems.length === 7 && menuItems.every((item) => Number(getComputedStyle(item).opacity) >= 0.99);
    });

    const panelState = await panel.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowX: getComputedStyle(element).overflowX,
        overflowY: getComputedStyle(element).overflowY,
        overscrollBehavior: getComputedStyle(element).overscrollBehavior,
      };
    });
    assert.ok(panelState.left >= 0, `${viewport.name}: menu should not extend beyond the left edge`);
    assert.ok(panelState.right <= viewport.width, `${viewport.name}: menu should not extend beyond the right edge`);
    assert.ok(panelState.scrollWidth <= panelState.clientWidth + 1, `${viewport.name}: menu content should not overflow horizontally`);
    assert.equal(panelState.overflowX, "hidden", `${viewport.name}: horizontal overflow should be clipped`);
    assert.equal(panelState.overflowY, "auto", `${viewport.name}: menu should scroll vertically`);
    assert.equal(panelState.overscrollBehavior, "contain", `${viewport.name}: menu scrolling should not chain to the page`);
    assert.ok(panelState.scrollHeight > panelState.clientHeight, `${viewport.name}: menu should provide internal scrolling`);
    assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden", `${viewport.name}: page scrolling should be locked`);

    await page.mouse.move(12, Math.floor(viewport.height / 2));
    await page.mouse.wheel(0, 180);
    await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.scrollTop > 0);
    assert.equal(
      await page.evaluate(() => window.scrollY),
      backgroundScrollBeforeOpen,
      `${viewport.name}: scrolling the open menu should not move the page behind it`,
    );

    const links = panel.locator("nav a[href]");
    assert.equal(await links.count(), 6, `${viewport.name}: all six section links should be present`);
    for (const link of await links.all()) {
      const label = (await link.innerText()).trim();
      await link.scrollIntoViewIfNeeded();
      const visibleWithinPanel = await link.evaluate((element) => {
        const item = element.getBoundingClientRect();
        const menu = element.closest("#mobile-navigation").getBoundingClientRect();
        return item.top >= menu.top && item.bottom <= menu.bottom;
      });
      assert.ok(visibleWithinPanel, `${viewport.name}: ${label} should be reachable inside the menu`);
    }

    const footer = panel.locator('[data-menu-item]').last();
    await footer.scrollIntoViewIfNeeded();
    const footerVisible = await footer.evaluate((element) => {
      const item = element.getBoundingClientRect();
      const menu = element.closest("#mobile-navigation").getBoundingClientRect();
      return item.top >= menu.top && item.bottom <= menu.bottom;
    });
    assert.ok(footerVisible, `${viewport.name}: menu footer should be reachable inside the menu`);

    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.querySelector("#mobile-navigation")?.getAttribute("aria-hidden") === "true");
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden", `${viewport.name}: closing the menu should restore page scrolling`);
  }

  await context.close();
  assert.deepEqual(pageErrors, [], `Unexpected browser errors: ${pageErrors.join("; ")}`);
});
