import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright-core";
import { mockServices } from "./helpers/services.mjs";

test("mobile intro activates music, comments stay public and five stars celebrate after saving", {
  skip: !process.env.PORTFOLIO_BUILD_DIRECTORY,
  timeout: 35_000,
}, async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mockServices(context);
    await context.addInitScript(() => {
      window.audioStarts = [];
      HTMLMediaElement.prototype.play = function () {
        if (this.src.endsWith("/music.mp3")) window.audioStarts.push(navigator.userActivation.isActive);
        return Promise.resolve();
      };
    });
    let rejectRating = false;
    await context.route("**/rest/v1/rpc/submit_portfolio_rating", route => rejectRating
      ? route.fulfill({ status: 400, json: { message: "Fixture rejection" } })
      : route.fulfill({ json: null }));
    const page = await context.newPage();
    await page.goto("http://localhost:4173/");
    const continueButton = page.getByRole("button", { name: "KETUK DIMANA SAJA UNTUK LANJUT" });
    await continueButton.waitFor({ timeout: 10_000 });
    assert.deepEqual(await page.evaluate(() => window.audioStarts), []);
    await page.touchscreen.tap(195, 175);
    await page.locator("#rv-intro").waitFor({ state: "detached" });
    assert.deepEqual(await page.evaluate(() => window.audioStarts), [true]);
    await page.reload();
    await page.getByRole("button", { name: "Skip introduction" }).tap();
    assert.deepEqual(await page.evaluate(() => window.audioStarts), [true]);
    assert.equal(await page.locator(".secondary-archive").getAttribute("open"), null);
    assert.equal(await page.locator("#comments").count(), 1);
    assert.equal(await page.locator(".secondary-archive #comments").count(), 0);

    const star = page.getByRole("button", { name: "5 dari 5 bintang" });
    const dots = star.locator(".rating-burst i");
    rejectRating = true;
    await star.tap();
    await page.getByText(/Rating belum tersimpan/).waitFor();
    assert.ok(await dots.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === "0")));
    rejectRating = false;
    await star.tap();
    await page.waitForFunction(() => [...document.querySelectorAll(".rating-burst i")]
      .some(node => Number(getComputedStyle(node).opacity) > 0));
    assert.equal(await star.getAttribute("aria-pressed"), "true");
  } finally {
    await browser.close();
  }
});
