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

async function createTrackedPage(viewport, options = {}) {
  const context = await browser.newContext({
    viewport,
    isMobile: true,
    hasTouch: true,
    reducedMotion: options.reducedMotion ?? "no-preference",
  });
  await mockServices(context);
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];
  const cancelledRequests = [];
  const httpErrors = [];
  const introAssetFailures = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "unknown";
    const url = new URL(request.url());
    const item = { origin: url.origin, path: url.pathname, failure };
    if (failure === "net::ERR_ABORTED") cancelledRequests.push(item);
    else failedRequests.push(item);
    if (url.pathname.includes("/brand/rv-")) introAssetFailures.push(item);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      const url = new URL(response.url());
      const error = { status: response.status(), origin: url.origin, path: url.pathname };
      httpErrors.push(error);
      if (url.pathname.includes("/brand/rv-")) introAssetFailures.push(error);
    }
  });
  await page.addInitScript(() => {
    window.__introTiming = { start: null, end: null };
    const updateTiming = () => {
      const mounted = Boolean(document.querySelector(".rv-intro"));
      if (mounted && window.__introTiming.start === null) {
        window.__introTiming.start = performance.now();
      } else if (!mounted && window.__introTiming.start !== null && window.__introTiming.end === null) {
        window.__introTiming.end = performance.now();
        observer.disconnect();
      }
    };
    const observer = new MutationObserver(updateTiming);
    const observeDocument = () => {
      if (!document.documentElement) return;
      observer.observe(document.documentElement, { childList: true, subtree: true });
      updateTiming();
    };
    if (document.documentElement) observeDocument();
    else document.addEventListener("DOMContentLoaded", observeDocument, { once: true });
  });
  return {
    context,
    page,
    pageErrors,
    consoleErrors,
    failedRequests,
    cancelledRequests,
    httpErrors,
    introAssetFailures,
  };
}

async function waitForIntroCompletion(page, timeout = 7_000) {
  await page.waitForFunction(
    () => window.__introTiming?.end !== null && window.__introTiming?.end !== undefined,
    null,
    { timeout },
  );
  return page.evaluate(() => window.__introTiming.end - window.__introTiming.start);
}

async function waitForVisibleIntroCopySnapshot(page, timeout = 8_000) {
  await page.waitForFunction(
    () => {
      const intro = document.querySelector(".rv-intro");
      const copy = Array.from(intro?.querySelectorAll("[data-intro-copy]") ?? []);
      return intro
        && copy.length === 4
        && Number.parseFloat(getComputedStyle(intro).opacity) >= 0.95
        && copy.every((element) => {
          const style = getComputedStyle(element);
          return style.visibility === "visible" && Number.parseFloat(style.opacity) >= 0.99;
        });
    },
    null,
    { timeout },
  );
  return page.evaluate(() => {
    const intro = document.querySelector(".rv-intro");
    const copy = Array.from(intro.querySelectorAll("[data-intro-copy]"));
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      copy: copy.map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          text: element.textContent.trim(),
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          fontFamily: style.fontFamily,
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          opacity: Number.parseFloat(style.opacity),
          visibility: style.visibility,
          whiteSpace: style.whiteSpace,
        };
      }),
    };
  });
}

function assertCopyFitsViewport(snapshot, fontLabel) {
  assert.equal(snapshot.copy.length, 4, `${fontLabel}: expected all intro copy`);
  for (const item of snapshot.copy) {
    assert.ok(item.text.length > 0, `${fontLabel}: copy text should be present`);
    assert.equal(item.visibility, "visible", `${fontLabel}: copy should be visible`);
    assert.ok(item.opacity >= 0.99, `${fontLabel}: copy should be fully revealed`);
    assert.ok(item.fontSize >= 8, `${fontLabel}: copy should have a readable computed size`);
    assert.ok(item.width > 0 && item.height > 0, `${fontLabel}: copy should have a rendered box`);
    assert.ok(
      item.left >= -0.5 && item.right <= snapshot.viewport.width + 0.5,
      `${fontLabel}: horizontal overflow for "${item.text}" (${item.left.toFixed(1)}–${item.right.toFixed(1)}px)`,
    );
    assert.ok(
      item.top >= -0.5 && item.bottom <= snapshot.viewport.height + 0.5,
      `${fontLabel}: vertical overflow for "${item.text}" (${item.top.toFixed(1)}–${item.bottom.toFixed(1)}px)`,
    );
    assert.ok(
      Math.abs(item.centerX - snapshot.viewport.width / 2) <= 1,
      `${fontLabel}: "${item.text}" is not centered`,
    );
  }
}

async function assertNoOverflow(page, width) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.equal(dimensions.viewport, width);
  assert.ok(
    dimensions.document <= width && dimensions.body <= width,
    `Horizontal overflow: ${JSON.stringify(dimensions)}`,
  );
}

async function assertClean(pageState, testContext) {
  assert.deepEqual(pageState.pageErrors, [], `JavaScript errors: ${pageState.pageErrors.join("; ")}`);
  const isUnrelatedDataServiceError = (error) =>
    (error.status === 401 && error.path.endsWith("/rest/v1/visitors"))
    || (
      error.status === 403
      && error.origin === "https://api.github.com"
      && error.path.startsWith("/users/Reyhan-irza")
    );
  const unrelatedDataServiceErrors = pageState.httpErrors.filter(isUnrelatedDataServiceError);
  const unexpectedHttpErrors = pageState.httpErrors.filter((error) => !isUnrelatedDataServiceError(error));
  assert.deepEqual(
    unexpectedHttpErrors,
    [],
    `Unexpected HTTP errors: ${JSON.stringify(unexpectedHttpErrors)}`,
  );
  const unexpectedConsoleErrors = pageState.consoleErrors.filter(
    (message) => {
      const status = Number(message.match(/status of (\d+)/)?.[1]);
      return !unrelatedDataServiceErrors.some((error) => error.status === status);
    },
  );
  assert.deepEqual(
    unexpectedConsoleErrors,
    [],
    `Unexpected console errors: ${unexpectedConsoleErrors.join("; ")}`,
  );
  assert.deepEqual(
    pageState.failedRequests,
    [],
    `Unexpected failed requests: ${JSON.stringify(pageState.failedRequests)}`,
  );
  assert.deepEqual(pageState.introAssetFailures, [], `Intro asset failures: ${JSON.stringify(pageState.introAssetFailures)}`);
  const visitorTelemetryCancels = pageState.cancelledRequests.filter(
    (request) => request.path.endsWith("/rest/v1/visitors"),
  );
  if (unrelatedDataServiceErrors.length > 0 || visitorTelemetryCancels.length > 0) {
    testContext.diagnostic(
      `Unrelated data-service network results: ${unrelatedDataServiceErrors.map((error) => `${error.status} ${new URL(error.origin).hostname}${error.path}`).join(", ") || "none"}; ${visitorTelemetryCancels.length} visitor-request cancellation(s).`,
    );
  }
}

test("mobile intro pacing, accessibility, visibility, and re-entry", { timeout: 150_000 }, async (t) => {
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

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 360, height: 800 },
  ]) {
    await t.test(`${viewport.width}x${viewport.height}: paced, completes, and stays within viewport`, async (caseContext) => {
      const state = await createTrackedPage(viewport);
      try {
        await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
        await state.page.locator(".rv-intro").waitFor({ state: "visible" });
        await assertNoOverflow(state.page, viewport.width);
        const mobileStyles = await state.page.evaluate(() => {
          const root = document.querySelector(".rv-intro");
          const copy = [...root.querySelectorAll("[data-intro-copy]")];
          return {
            clipPath: getComputedStyle(root).clipPath,
            rootTransform: getComputedStyle(root).transform,
            copyFilters: copy.map((element) => getComputedStyle(element).filter),
          };
        });
        assert.equal(mobileStyles.clipPath, "none", "Mobile exit should not animate a full-screen clip path");
        assert.equal(mobileStyles.rootTransform, "none", "Only the overlay opacity should own the root transition");
        assert.ok(mobileStyles.copyFilters.every((filter) => filter === "none"), "Mobile copy should not use blur filters");

        const duration = await waitForIntroCompletion(state.page);
        caseContext.diagnostic(`Intro visible time: ${Math.round(duration)}ms.`);
        assert.ok(duration >= 2_000, `Intro ended too quickly (${Math.round(duration)}ms)`);
        assert.ok(duration <= 3_000, `Intro blocked access too long (${Math.round(duration)}ms)`);
        await assertNoOverflow(state.page, viewport.width);
        await state.page.waitForFunction(() =>
          [...document.querySelectorAll(".rv-intro img")].every(
            (image) => image.complete && image.naturalWidth > 0,
          ),
        );
        assert.notEqual(await state.page.locator("main#main-content").count(), 0);
        assert.equal(await state.page.evaluate(() => document.body.style.overflow), "");
        await assertClean(state, caseContext);
      } finally {
        await state.context.close();
      }
    });
  }

  await t.test("resizing during the intro does not restart it or create overflow", async (caseContext) => {
    const state = await createTrackedPage({ width: 390, height: 844 });
    try {
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await state.page.locator(".rv-intro").waitFor({ state: "visible" });
      await state.page.setViewportSize({ width: 1280, height: 900 });
      await assertNoOverflow(state.page, 1280);
      await state.page.setViewportSize({ width: 1024, height: 768 });
      await assertNoOverflow(state.page, 1024);
      await state.page.setViewportSize({ width: 390, height: 844 });
      await assertNoOverflow(state.page, 390);
      const duration = await waitForIntroCompletion(state.page);
      caseContext.diagnostic(`Intro completed after viewport changes in ${Math.round(duration)}ms.`);
      assert.ok(duration <= 5_000, `Resize should not leave the intro stuck (${Math.round(duration)}ms)`);
      assert.equal(await state.page.evaluate(() => document.body.style.overflow), "");
      await assertClean(state, caseContext);
    } finally {
      await state.context.close();
    }
  });

  await t.test("reduced motion bypasses the intro without hiding page content", async (caseContext) => {
    const state = await createTrackedPage({ width: 390, height: 844 }, { reducedMotion: "reduce" });
    try {
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await state.page.waitForFunction(() =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
        && !document.querySelector(".rv-intro")
        && document.querySelector("main#main-content"),
      );
      assert.equal(await state.page.evaluate(() => document.body.style.overflow), "");
      await assertNoOverflow(state.page, 390);
      await assertClean(state, caseContext);
    } finally {
      await state.context.close();
    }
  });

  await t.test("an intro image failure releases the page instead of trapping the visitor", async () => {
    const state = await createTrackedPage({ width: 390, height: 844 });
    try {
      await state.page.route("**/brand/rv-piece-01.webp", (route) => route.abort());
      const failedAsset = state.page.waitForEvent("requestfailed", {
        predicate: (request) => request.url().endsWith("/brand/rv-piece-01.webp"),
      });
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await failedAsset;
      await state.page.waitForFunction(
        () => window.__introTiming?.end !== null && window.__introTiming?.end !== undefined,
        null,
        { timeout: 5_000 },
      );
      assert.equal(await state.page.locator(".rv-intro").count(), 0);
      assert.equal(await state.page.evaluate(() => document.body.style.overflow), "");
      assert.notEqual(await state.page.locator("main#main-content").count(), 0);
      assert.deepEqual(state.pageErrors, []);
      assert.equal(
        state.introAssetFailures.filter((failure) => failure.path.endsWith("/brand/rv-piece-01.webp")).length,
        1,
        "The test should verify the intentionally failed asset",
      );
    } finally {
      await state.context.close();
    }
  });

  await t.test("Escape, Skip, reload, and route re-entry remain usable", async (caseContext) => {
    const state = await createTrackedPage({ width: 390, height: 844 });
    try {
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await state.page.locator(".rv-intro").waitFor({ state: "visible" });
      assert.equal(
        await state.page.evaluate(() => document.activeElement?.classList.contains("rv-intro")),
        true,
        "The intro dialog should receive initial focus",
      );
      await state.page.keyboard.press("Tab");
      assert.equal(
        await state.page.evaluate(() => document.activeElement?.classList.contains("rv-intro-skip")),
        true,
        "Tab should move focus to Skip",
      );
      await state.page.keyboard.press("Escape");
      await state.page.locator(".rv-intro").waitFor({ state: "detached" });
      assert.equal(await state.page.evaluate(() => document.body.style.overflow), "");

      await state.page.reload({ waitUntil: "domcontentloaded" });
      await state.page.locator(".rv-intro-skip").waitFor({ state: "visible" });
      await state.page.locator(".rv-intro-skip").click();
      await state.page.locator(".rv-intro").waitFor({ state: "detached" });
      assert.equal(await state.page.evaluate(() => document.body.style.overflow), "");

      await state.page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await state.page.locator(".rv-intro").waitFor({ state: "visible" });
      const replayDuration = await waitForIntroCompletion(state.page);
      caseContext.diagnostic(`Route re-entry intro visible time: ${Math.round(replayDuration)}ms.`);
      assert.ok(replayDuration >= 2_000 && replayDuration <= 3_500);
      await assertNoOverflow(state.page, 390);
      await assertClean(state, caseContext);
    } finally {
      await state.context.close();
    }
  });

  await t.test("intro pauses for a hidden visibilitychange and resumes when visible", async (caseContext) => {
    const state = await createTrackedPage({ width: 360, height: 800 });
    try {
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await state.page.locator(".rv-intro").waitFor({ state: "visible" });
      await delay(450);
      await state.page.evaluate(() => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          get: () => window.__introTestHidden,
        });
        window.__introTestHidden = true;
        document.dispatchEvent(new Event("visibilitychange"));
      });

      await delay(900);
      assert.equal(await state.page.locator(".rv-intro").count(), 1, "Intro should not finish while hidden");
      await state.page.evaluate(() => {
        window.__introTestHidden = false;
        document.dispatchEvent(new Event("visibilitychange"));
      });
      const duration = await waitForIntroCompletion(state.page);
      caseContext.diagnostic(`Elapsed wall time including synthetic hidden interval: ${Math.round(duration)}ms.`);
      assert.ok(duration >= 2_000, `Intro should resume rather than jump to completion (${Math.round(duration)}ms)`);
      await assertNoOverflow(state.page, 360);
      await assertClean(state, caseContext);
    } finally {
      await state.context.close();
    }
  });

  await t.test("4x CPU throttling does not leave the intro stuck or overflowing", async (caseContext) => {
    const state = await createTrackedPage({ width: 390, height: 844 });
    const session = await state.context.newCDPSession(state.page);
    try {
      await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await state.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await state.page.locator(".rv-intro").waitFor({ state: "visible" });
      const duration = await waitForIntroCompletion(state.page, 10_000);
      caseContext.diagnostic(`Intro visible time at CPU throttling 4x: ${Math.round(duration)}ms.`);
      assert.ok(duration >= 2_000, `Intro ended too quickly under throttling (${Math.round(duration)}ms)`);
      assert.ok(duration <= 4_000, `Intro did not complete under throttling (${Math.round(duration)}ms)`);
      await assertNoOverflow(state.page, 390);
      await assertClean(state, caseContext);
    } finally {
      await session.send("Emulation.setCPUThrottlingRate", { rate: 1 }).catch(() => {});
      await session.detach().catch(() => {});
      await state.context.close();
    }
  });
});
