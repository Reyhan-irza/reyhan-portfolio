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
    assert.ok(entering.y > settled.y + 28, 'Phone entrance has visible travel, not a barely perceptible nudge');
    assert.ok(Math.abs(settled.y) < 1, `Text settles before the reading zone: ${JSON.stringify({entering, settled, reversed})}`);
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

  await t.test("mobile project depth follows both scroll directions and respects reduced motion", async () => {
    const visual = phonePage.locator('[data-project-visual]').first();
    const image = visual.locator('.project-screenshot');
    const top = await phonePage.locator('[data-project-row]').first().evaluate(el => el.getBoundingClientRect().top + scrollY);
    const pose = () => image.evaluate(el => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      return { scale: matrix.a, y: matrix.m42 };
    });
    await scrollInstantly(phonePage, top - 730);
    const entering = await pose();
    await scrollInstantly(phonePage, top - 240);
    const reading = await pose();
    assert.ok(entering.scale - reading.scale > .06, `Screenshot depth should be visible over a phone swipe: ${JSON.stringify({top, entering, reading})}`);
    await phonePage.waitForTimeout(300);
    const settled = await pose();
    assert.ok(Math.abs(settled.y - reading.y) < 1, 'Screenshot must settle promptly after the gesture');
    await scrollInstantly(phonePage, top - 730);
    const reversed = await pose();
    assert.ok(Math.abs(reversed.scale - entering.scale) < .015, 'Reverse scroll returns to the same screenshot scale');
    assert.ok(Math.abs(reversed.y - entering.y) < 2, 'Reverse scroll returns to the same screenshot position');
    await phonePage.emulateMedia({ reducedMotion: 'reduce' });
    await settleLayout(phonePage);
    assert.equal(await image.evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await visual.evaluate(el => getComputedStyle(el).transform), 'none');
    await phonePage.emulateMedia({ reducedMotion: 'no-preference' });
    await settleLayout(phonePage);
    await scrollInstantly(phonePage, top - 730);
    assert.ok((await pose()).scale > 1.08, 'Project motion must restart when reduced motion is turned off on a phone');
  });

  await t.test("mobile address-bar height changes do not reset scroll triggers", async () => {
    await scrollInstantly(phonePage, 1000);
    await phonePage.waitForTimeout(700);
    await phonePage.evaluate(async () => {
      const { ScrollTrigger } = await import('/src/lib/motion.ts');
      window.__mobileRefreshes = 0;
      window.__countMobileRefresh = () => { window.__mobileRefreshes += 1; };
      ScrollTrigger.addEventListener('refresh', window.__countMobileRefresh);
    });
    const before = await phonePage.evaluate(() => scrollY);
    await phonePage.setViewportSize({ width: 390, height: 790 });
    await phonePage.waitForTimeout(600);
    assert.equal(await phonePage.evaluate(() => window.__mobileRefreshes), 0, 'Small height-only changes should not reset all animated poses');
    assert.ok(Math.abs(await phonePage.evaluate(() => scrollY) - before) < 3, 'Viewport chrome must not jump the document');
    await phonePage.setViewportSize({ width: 430, height: 790 });
    await phonePage.waitForTimeout(600);
    assert.ok(await phonePage.evaluate(() => window.__mobileRefreshes) > 0, 'Real width changes must still refresh layout');
    await phonePage.evaluate(async () => {
      const { ScrollTrigger } = await import('/src/lib/motion.ts');
      ScrollTrigger.removeEventListener('refresh', window.__countMobileRefresh);
      delete window.__countMobileRefresh;
      delete window.__mobileRefreshes;
    });
  });

  await t.test("section titles reveal before supporting copy and reverse as one scene", async () => {
    await phonePage.setViewportSize({ width: 390, height: 844 });
    // Let the debounced body resize and safe refresh finish before recording
    // absolute positions from the previous test's different viewport width.
    await phonePage.waitForTimeout(750);
    const scene = phonePage.locator('#about .story-intro');
    const top = await scene.evaluate(el => el.getBoundingClientRect().top + scrollY);
    const pose = () => scene.evaluate(el => {
      const heading = el.querySelector('h2');
      const copy = el.querySelector('.story-lead');
      const eyebrow = el.querySelector('.section-kicker');
      return {
        rootY: new DOMMatrix(getComputedStyle(el).transform).m42,
        headingY: new DOMMatrix(getComputedStyle(heading).transform).m42,
        clip: parseFloat(getComputedStyle(heading).clipPath.match(/inset\(([\d.]+)/)?.[1] ?? '0'),
        copyY: new DOMMatrix(getComputedStyle(copy).transform).m42,
        copyOpacity: Number(getComputedStyle(copy).opacity),
        eyebrowOpacity: Number(getComputedStyle(eyebrow).opacity),
      };
    });
    await scrollInstantly(phonePage, top - 700);
    const entering = await pose();
    assert.ok(entering.clip > 50, `Title should visibly open from its mask: ${JSON.stringify(entering)}`);
    assert.ok(entering.eyebrowOpacity > entering.copyOpacity + .2, 'Eyebrow leads supporting copy');
    assert.equal(entering.rootY, 0, 'Scroll scene is measured from a stationary container');
    await scrollInstantly(phonePage, top - 300);
    const settled = await pose();
    assert.ok(settled.clip < 1 && Math.abs(settled.headingY) < 1, 'Full title is readable in the reading zone');
    assert.ok(settled.copyOpacity > .99 && Math.abs(settled.copyY) < 1, 'Supporting copy settles fully');
    await scrollInstantly(phonePage, top - 700);
    const reversed = await pose();
    assert.ok(Math.abs(reversed.clip - entering.clip) < 2, `Title mask reverses to the same pose: ${JSON.stringify({entering, reversed})}`);
    await phonePage.emulateMedia({ reducedMotion: 'reduce' });
    await settleLayout(phonePage);
    assert.equal(await scene.locator('h2').evaluate(el => getComputedStyle(el).clipPath), 'none');
    assert.equal((await pose()).copyOpacity, 1, 'Reduced motion must expose supporting copy immediately');
    await phonePage.emulateMedia({ reducedMotion: 'no-preference' });
    await phonePage.setViewportSize({ width: 320, height: 740 });
    await settleLayout(phonePage);
    const narrowTop = await scene.evaluate(el => el.getBoundingClientRect().top + scrollY);
    await scrollInstantly(phonePage, narrowTop - 250);
    assert.ok((await pose()).clip < 1, 'Title still settles after narrow-screen text reflow');
    assert.equal(await phonePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  });

  await t.test("project title lines open in sequence and remain readable with reduced motion", async () => {
    await phonePage.setViewportSize({ width: 390, height: 844 });
    await settleLayout(phonePage);
    const title = phonePage.locator('.projects-title');
    const top = await title.evaluate(el => el.parentElement.parentElement.getBoundingClientRect().top + scrollY);
    const offsets = () => title.locator('[data-heading-line]').evaluateAll(lines =>
      lines.map(el => new DOMMatrix(getComputedStyle(el).transform).m42 / el.getBoundingClientRect().height));
    await scrollInstantly(phonePage, top - 640);
    const entering = await offsets();
    assert.ok(entering[1] - entering[0] > .1, 'Second title line follows the first');
    await scrollInstantly(phonePage, top - 300);
    assert.ok((await offsets()).every(value => Math.abs(value) < .01), 'Both title lines settle');
    await scrollInstantly(phonePage, top - 640);
    const reversed = await offsets();
    assert.ok(reversed.every((value, index) => Math.abs(value - entering[index]) < .03), 'Line choreography reverses with scroll');
    await phonePage.emulateMedia({ reducedMotion: 'reduce' });
    await settleLayout(phonePage);
    assert.ok((await offsets()).every(value => value === 0), 'Reduced motion leaves both lines unmasked');
    await phonePage.emulateMedia({ reducedMotion: 'no-preference' });
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
