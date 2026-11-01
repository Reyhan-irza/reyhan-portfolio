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

async function settleLayout(page) {
  await page.waitForTimeout(320);
  await page.evaluate(() => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
}

async function scrollInstantly(page, top) {
  const target = await page.evaluate((requestedTop) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const clampedTop = Math.max(0, Math.min(requestedTop, maxScroll));
    window.scrollTo({ top: clampedTop, behavior: "instant" });
    return clampedTop;
  }, top);
  await page.waitForFunction((expectedTop) => Math.abs(window.scrollY - expectedTop) < 3, target);
  await settleLayout(page);
}

async function dismissIntro(page) {
  await page.locator(".rv-intro-skip").click();
  await page.locator(".rv-intro").waitFor({ state: "detached" });
  await page.waitForFunction(() => document.querySelector("#home h1") !== null);
  await settleLayout(page);
}

async function assertVisibleBox(locator, label) {
  const revealed = await locator.evaluate((element) => new Promise((resolve) => {
    const startedAt = performance.now();
    const waitForReveal = () => {
      const style = getComputedStyle(element);
      if (style.visibility !== "visible") {
        resolve(false);
        return;
      }
      if (Number(style.opacity) >= 0.94) {
        resolve(true);
        return;
      }
      if (performance.now() - startedAt >= 2_500) {
        resolve(false);
        return;
      }
      requestAnimationFrame(waitForReveal);
    };
    waitForReveal();
  }));
  assert.ok(revealed, `${label} should finish its visible entrance`);

  const box = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      visibility: style.visibility,
      opacity: Number(style.opacity),
      width: rect.width,
      height: rect.height,
    };
  });
  assert.equal(box.visibility, "visible", `${label} should remain visible`);
  assert.ok(box.opacity >= 0.94, `${label} should be fully revealed, got opacity ${box.opacity}`);
  assert.ok(box.width > 0 && box.height > 0, `${label} should retain a visible layout box`);
}

test("scroll-linked sections stay aligned when phone width changes", { timeout: 90_000 }, async (t) => {
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

  const phoneContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  await mockServices(phoneContext);
  const phonePage = await phoneContext.newPage();
  const pageErrors = [];
  phonePage.on("pageerror", (error) => pageErrors.push(error.message));

  await phonePage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await phonePage.waitForFunction(() =>
    document.querySelector("#home")
    && document.querySelectorAll("#journey [data-education-row]").length === 4
    && document.querySelectorAll("#achievement > .award-record").length === 2,
  );
  await dismissIntro(phonePage);

  await t.test("hero scroll motion continues after resizing across phone layouts", async () => {
    const hero = phonePage.locator("#home");
    const title = phonePage.locator("[data-hero-title-depth]");
    await assertVisibleBox(phonePage.locator("#home h1"), "hero heading");
    await assertVisibleBox(phonePage.locator("[data-hero-bio]"), "hero introduction");

    const midpoint = await hero.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return window.scrollY + rect.top + rect.height * 0.34;
    });
    await scrollInstantly(phonePage, midpoint);
    const beforeResize = await title.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
    });

    await phonePage.setViewportSize({ width: 700, height: 844 });
    await settleLayout(phonePage);
    await assertVisibleBox(phonePage.locator("#home h1"), "hero heading after resize");
    await assertVisibleBox(phonePage.locator("[data-hero-bio]"), "hero introduction after resize");

    const afterResize = await title.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
    });
    assert.ok(Math.abs(afterResize - beforeResize) < 3, `Hero animation jumped after resize (${beforeResize}px to ${afterResize}px)`);

    await scrollInstantly(phonePage, (await phonePage.evaluate(() => window.scrollY)) + 140);
    const afterScroll = await title.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
    });
    assert.ok(afterScroll < afterResize - 0.4, "Hero scroll-linked transform should keep progressing after resize");
  });

  await t.test("education progress matches the resized timeline position", async () => {
    const timeline = phonePage.locator("#journey .education-timeline");
    const targetForProgress = async (progress) => timeline.evaluate((element, targetProgress) => {
      const rect = element.getBoundingClientRect();
      const documentTop = window.scrollY + rect.top;
      const documentBottom = documentTop + rect.height;
      const start = documentTop - window.innerHeight * 0.7;
      const end = documentBottom - window.innerHeight * 0.34;
      return start + (end - start) * targetProgress;
    }, progress);
    const state = () => phonePage.evaluate(() => {
      const timelineElement = document.querySelector("#journey .education-timeline");
      const rect = timelineElement.getBoundingClientRect();
      const documentTop = window.scrollY + rect.top;
      const documentBottom = documentTop + rect.height;
      const start = documentTop - window.innerHeight * 0.7;
      const end = documentBottom - window.innerHeight * 0.34;
      const progress = Math.max(0, Math.min(0.999999, (window.scrollY - start) / (end - start)));
      const active = Array.from(document.querySelectorAll("#journey [data-education-row]"))
        .findIndex((row) => row.getAttribute("data-education-active") === "true");
      return {
        expectedIndex: Math.min(3, Math.floor(progress * 4)),
        activeIndex: active,
        rowCount: document.querySelectorAll("#journey [data-education-row]").length,
      };
    });

    await scrollInstantly(phonePage, await targetForProgress(0.46));
    const beforeResize = await state();
    assert.ok(beforeResize.activeIndex >= 0, "An education milestone should be active before resize");

    await phonePage.setViewportSize({ width: 390, height: 844 });
    await settleLayout(phonePage);
    await phonePage.setViewportSize({ width: 700, height: 844 });
    await settleLayout(phonePage);
    const afterResize = await state();

    assert.equal(afterResize.rowCount, 4, "All education milestones should remain mounted");
    assert.ok(afterResize.activeIndex >= 0, "An education milestone should remain active after resize");
    assert.ok(
      Math.abs(afterResize.activeIndex - afterResize.expectedIndex) <= 1,
      `Education progress should follow its resized trigger position (expected near ${afterResize.expectedIndex}, got ${afterResize.activeIndex})`,
    );
    for (const row of await phonePage.locator("#journey [data-education-row]").all()) {
      await assertVisibleBox(row, "education milestone");
    }

    await scrollInstantly(phonePage, await targetForProgress(0.84));
    const afterFurtherScroll = await state();
    assert.equal(afterFurtherScroll.expectedIndex, 3, "Further scrolling should reach the final education milestone");
    assert.equal(afterFurtherScroll.activeIndex, 3, "The final milestone should activate after resizing and continued scrolling");
  });

  await t.test("award content remains revealed when resizing partway through each card", async () => {
    const firstAward = phonePage.locator("#achievement > .award-record").nth(0);
    const secondAward = phonePage.locator("#achievement > .award-record").nth(1);
    const scrollCardPartway = async (card) => {
      const top = await card.evaluate((element) =>
        window.scrollY + element.getBoundingClientRect().top + element.getBoundingClientRect().height * 0.42 - window.innerHeight * 0.45,
      );
      await scrollInstantly(phonePage, top);
    };

    await scrollCardPartway(firstAward);
    await assertVisibleBox(firstAward, "2025 award card before resize");
    await phonePage.setViewportSize({ width: 390, height: 844 });
    await settleLayout(phonePage);
    await phonePage.setViewportSize({ width: 700, height: 844 });
    await settleLayout(phonePage);
    await assertVisibleBox(firstAward, "2025 award card after resize");

    await scrollCardPartway(secondAward);
    await assertVisibleBox(secondAward, "2026 award card before resize");
    await phonePage.setViewportSize({ width: 390, height: 844 });
    await settleLayout(phonePage);
    await phonePage.setViewportSize({ width: 700, height: 844 });
    await settleLayout(phonePage);
    await assertVisibleBox(secondAward, "2026 award card after resize");
  });

  await t.test("reading reveals reverse with scroll and settle without hiding text", async () => {
    await phonePage.setViewportSize({ width: 390, height: 844 });
    await settleLayout(phonePage);
    const note = phonePage.locator('.story-note').first();
    const top = await note.evaluate(el => el.getBoundingClientRect().top + scrollY - new DOMMatrix(getComputedStyle(el).transform).m42);
    const read = () => note.evaluate(el => ({ y: new DOMMatrix(getComputedStyle(el).transform).m42, opacity: Number(getComputedStyle(el).opacity) }));
    await scrollInstantly(phonePage, top - 800);
    await phonePage.waitForTimeout(500);
    const entering = await read();
    await scrollInstantly(phonePage, top - 500);
    await phonePage.waitForTimeout(500);
    const settled = await read();
    await scrollInstantly(phonePage, top - 800);
    await phonePage.waitForTimeout(500);
    const reversed = await read();
    assert.ok(entering.y > settled.y + 3, 'Entrance follows scroll position');
    assert.ok(Math.abs(settled.y) < 1, 'Text settles before the reading zone');
    assert.ok(Math.abs(reversed.y - entering.y) < 2, 'Reverse scroll returns to the same pose');
    assert.equal(reversed.opacity, 1, 'Reading text remains visible');
  });

  await t.test("reading reveals respond to live reduced-motion changes", async () => {
    const note = phonePage.locator(".story-note").first();
    const positionBeforeNote = () => note.evaluate((element) =>
      element.getBoundingClientRect().top + scrollY
      - new DOMMatrix(getComputedStyle(element).transform).m42 - 800);

    for (let cycle = 0; cycle < 2; cycle += 1) {
      await phonePage.emulateMedia({ reducedMotion: "reduce" });
      await settleLayout(phonePage);
      await scrollInstantly(phonePage, await positionBeforeNote());
      await phonePage.waitForFunction(() =>
        getComputedStyle(document.querySelector(".story-note")).transform === "none");
      await assertVisibleBox(note, "Reduced-motion reading surface");

      await phonePage.emulateMedia({ reducedMotion: "no-preference" });
      await settleLayout(phonePage);
      await scrollInstantly(phonePage, await positionBeforeNote());
      await phonePage.waitForFunction(() =>
        new DOMMatrix(getComputedStyle(document.querySelector(".story-note")).transform).m42 > 3);
      await assertVisibleBox(note, "Restored reading motion");
    }
  });

  await phoneContext.close();

  await t.test("desktop project story still pins while scrolling", async () => {
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      hasTouch: true,
      reducedMotion: "no-preference",
    });
    await mockServices(desktopContext);
    const desktopPage = await desktopContext.newPage();
    desktopPage.on("pageerror", (error) => pageErrors.push(error.message));
    await desktopPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await desktopPage.waitForFunction(() => document.querySelector("[data-project-stage]") !== null);
    await dismissIntro(desktopPage);
    await desktopPage.waitForFunction(() =>
      document.querySelector("[data-project-stage]")?.parentElement?.classList.contains("pin-spacer"),
    );

    const pinStart = await desktopPage.locator("[data-project-stage]").evaluate((element) =>
      window.scrollY + element.getBoundingClientRect().top - 96 + 80,
    );
    await scrollInstantly(desktopPage, pinStart);
    const pinnedPosition = await desktopPage.locator("[data-project-stage]").evaluate((element) => ({
      top: element.getBoundingClientRect().top,
      position: getComputedStyle(element).position,
      hasPinSpacer: element.parentElement?.classList.contains("pin-spacer") ?? false,
    }));
    assert.equal(pinnedPosition.hasPinSpacer, true, "Desktop project stage should retain its ScrollTrigger pin spacer");
    assert.equal(pinnedPosition.position, "fixed", "Desktop project stage should enter its pinned position");
    assert.ok(Math.abs(pinnedPosition.top - 96) < 4, `Desktop project stage should pin at its configured offset, got ${pinnedPosition.top}px`);

    await scrollInstantly(desktopPage, pinStart + 100);
    const continuedPinTop = await desktopPage.locator("[data-project-stage]").evaluate((element) =>
      element.getBoundingClientRect().top,
    );
    assert.ok(Math.abs(continuedPinTop - pinnedPosition.top) < 2, "Desktop pin should remain stable as scrolling continues");
    await desktopContext.close();
  });

  assert.deepEqual(pageErrors, [], `Unexpected browser errors: ${pageErrors.join("; ")}`);
});
