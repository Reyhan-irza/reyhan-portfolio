// Build the frontend, set PORTFOLIO_BUILD_DIRECTORY, CHROMIUM_PATH and MOTION_EVIDENCE_DIR.
// Optional REVIEW_BASELINE=1 captures the corresponding states from the previous build.
import assert from "node:assert/strict";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";
import { mockServices } from "./helpers/services.mjs";

const heights = {
  360: 800,
  390: 844,
  430: 932,
  768: 1024,
  1280: 900,
  1440: 900,
};
const widths = (process.env.MOTION_WIDTHS || "390,1440,360,430,768,1280")
  .split(",")
  .map(Number);
const baseline = process.env.REVIEW_BASELINE === "1",
  out = path.resolve(process.env.MOTION_EVIDENCE_DIR);
assert.ok(process.env.PORTFOLIO_BUILD_DIRECTORY);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
const round = (value) => Number(value.toFixed(3));

async function review(width) {
  const height = heights[width],
    film = !baseline && [390, 1440].includes(width);
  const ctx = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 768,
    hasTouch: width < 1024,
    ...(film ? { recordVideo: { dir: out, size: { width, height } } } : {}),
  });
  try {
    await mockServices(ctx);
    const page = await ctx.newPage(),
      errors = [],
      result = { width, height, errors };
    page.on("pageerror", (error) => errors.push(error.message));
    const shot = (label) =>
      page.screenshot({ path: path.join(out, width + "-" + label + ".png") });
    const wait = (ms) => page.waitForTimeout(ms);
    const scrollY = () => page.evaluate(() => window.scrollY);
    const go = async (top, ms = 680) => {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        top,
      );
      await wait(ms);
    };
    const jump = async (selector, at = 0.2) =>
      go(
        await page
          .locator(selector)
          .first()
          .evaluate(
            (el, k) =>
              el.getBoundingClientRect().top + scrollY - innerHeight * k,
            at,
          ),
        1050,
      );
    const rows = page.locator("[data-project-row]");
    const poses = () =>
      rows.evaluateAll((nodes) =>
        nodes.map((row) => {
          const box = row.getBoundingClientRect(),
            mask = row.querySelector("[data-card-mask]");
          return {
            top: Math.round(box.top + scrollY),
            height: box.height,
            mask:
              Math.abs(
                new DOMMatrixReadOnly(getComputedStyle(mask).transform).m42,
              ) / mask.offsetHeight,
            copy: Number(
              getComputedStyle(row.querySelector(".project-copy")).opacity,
            ),
            actions: row.querySelectorAll(
              ".project-actions a,.project-actions button",
            ).length,
          };
        }),
      );
    async function gesture(delta, steps, gap) {
      if (width === 390) {
        const cdp = await ctx.newCDPSession(page),
          x = width * 0.48,
          y = height * (delta > 0 ? 0.8 : 0.25);
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x, y }],
        });
        for (let i = 1; i <= steps; i++) {
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x, y: y - (delta * i) / steps }],
          });
          await wait(gap);
        }
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await cdp.detach();
      } else {
        for (let i = 0; i < steps; i++) {
          await page.mouse.wheel(0, delta / steps);
          await wait(gap);
        }
      }
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            let stable = 0,
              last = scrollY;
            const tick = () => {
              stable = Math.abs(scrollY - last) < 0.25 ? stable + 1 : 0;
              last = scrollY;
              if (stable >= 14) resolve();
              else requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }),
      );
      await wait(350);
    }
    await page.goto("http://localhost:4173/", {
      waitUntil: "domcontentloaded",
    });
    await page.locator("#rv-intro").waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (film) {
      await wait(2750);
      if (await page.locator("#rv-intro").isVisible()) await shot("intro");
    } else if (await page.locator(".rv-intro-skip").isVisible())
      await page.locator(".rv-intro-skip").click();
    await page.locator("#rv-intro").waitFor({ state: "detached" });
    await wait(1700);
    await shot("hero");
    if (!baseline) {
      result.fonts = await page.evaluate(() =>
        Array.from(document.fonts)
          .filter((f) => f.status === "loaded")
          .map((f) => f.family),
      );
      assert.ok(
        result.fonts.includes("Outfit") && result.fonts.includes("Manrope"),
      );
      const open = page.getByTestId("button-mobile-menu");
      await open.click();
      await wait(330);
      if (film) await shot("menu-entry");
      await wait(1100);
      await shot("menu");
      result.menuWidth = round(
        (await page.locator("#mobile-navigation").boundingBox()).width,
      );
      await page.keyboard.press("Escape");
      await page.locator("#mobile-navigation").waitFor({ state: "hidden" });
      assert.ok(await open.evaluate((el) => el === document.activeElement));
    }
    await jump("#technology-bands");
    await shot("logos");
    if (!baseline) {
      const x = () =>
        page
          .locator("[data-band-track]")
          .first()
          .evaluate(
            (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
          );
      const y = await scrollY(),
        start = await x();
      await go(y + 145);
      const end = await x();
      await wait(300);
      result.logoSize = round(
        (await page.locator(".technology-band__mark svg").first().boundingBox())
          .width,
      );
      result.logoDrift = round(Math.abs(end - (await x())));
      await go(y);
      result.logoReverseError = round(Math.abs(start - (await x())));
      assert.ok(
        Math.abs(end - start) > 10 &&
          result.logoDrift < 1 &&
          result.logoReverseError < 1,
      );
    }
    await jump("#projects h2");
    await shot("projects");
    if (film) {
      await jump("[data-project-row]", 0.94);
      const start = await scrollY();
      await gesture(340, 20, 34);
      const slow = await scrollY();
      await gesture(395, 6, 20);
      const fast = await scrollY();
      await wait(450);
      await gesture(-260, 13, 34);
      const back = await scrollY();
      result.input = {
        kind: width === 390 ? "native touch" : "wheel",
        slow: slow - start,
        fast: fast - slow,
        reverse: back - fast,
      };
      assert.ok(slow > start && fast > slow && back < fast);
    }
    if (!baseline) {
      const original = await poses();
      result.cards = [];
      for (let i = 0; i < original.length; i++) {
        const r = original[i],
          distance = Math.min(r.height * 0.9, height * 0.8),
          start = r.top - height * 0.96,
          at = start + distance * 0.49;
        await go(at);
        const mid = await poses();
        assert.ok(
          mid[i].mask > 0.05 && mid[i].mask < 0.85,
          JSON.stringify({ width, i, r, mid: mid[i] }),
        );
        assert.ok(
          mid.every(
            (v, j) => i === j || (j < i ? v.mask < 0.02 : v.mask > 0.85),
          ),
        );
        if (i === 1) await shot("card-mid");
        await go(start + distance + 55);
        const full = await poses();
        assert.ok(
          full[i].mask < 0.02 && full[i].copy > 0.99 && full[i].actions === 3,
        );
        await go(at);
        const reverse = await poses();
        const delta = round(Math.abs(mid[i].mask - reverse[i].mask)),
          drift = Math.abs(r.top - full[i].top);
        assert.ok(delta < 0.015 && drift <= 1);
        result.cards.push({
          title: await rows.nth(i).locator("h3").innerText(),
          middle: round(mid[i].mask),
          end: round(full[i].mask),
          reverseError: delta,
          layoutShift: drift,
        });
        await go(r.top - height * 0.13);
        await shot("card-" + (i + 1));
      }
    } else {
      await jump(
        width < 1024
          ? "[data-project-row]:nth-child(2)"
          : "[data-project-stage]",
        0.13,
      );
      await shot("card-2");
    }
    for (const key of ["about", "journey", "github", "contact"]) {
      await jump("#" + key + " h2");
      await shot(key);
    }
    if (!baseline) {
      result.githubEdges = await page
        .locator(".github-heading h2,.github-stats,.github-profile-link")
        .evaluateAll((els) =>
          els.map((el) => Math.round(el.getBoundingClientRect().left)),
        );
      assert.equal(new Set(result.githubEdges).size, 1);
    }
    await go(
      await page.evaluate(() => document.documentElement.scrollHeight),
      1200,
    );
    await shot("closing");
    if (!baseline) {
      const track = page.locator("[data-closing-track]"),
        x = () =>
          track.evaluate(
            (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
          );
      const initial = await x();
      await wait(380);
      assert.ok(Math.abs(initial - (await x())) > 1);
      await page.getByRole("button", { name: "Jeda teks berjalan" }).click();
      const frozen = await x();
      await wait(350);
      assert.ok(Math.abs(frozen - (await x())) < 0.5);
      result.closingSize = round(
        await track
          .locator("span")
          .first()
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      );
      result.overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      assert.ok(result.overflow <= 1);
    }
    if (film) {
      await wait(750);
      result.filmEndSeconds = round(
        await page.evaluate(() => performance.now() / 1000),
      );
    }
    for (const [key, sel] of Object.entries({
      hero: "#home h1",
      about: "#about h2",
      work: "#projects h2",
      github: "#github h2",
      contact: "#contact h2",
    })) {
      await jump(sel, 0.23);
      await wait(650);
      const heading = page.locator(sel).first(),
        r = await heading.boundingBox();
      const x = Math.max(0, Math.floor(r.x - 5)),
        y = Math.max(0, Math.floor(r.y - 5));
      const clip = {
        x,
        y,
        width: Math.min(width - x, Math.ceil(r.width + 10)),
        height: Math.min(height - y, Math.ceil(r.height + 10)),
      };
      const glyph = (state) =>
        page.screenshot({
          clip,
          path: path.join(out, width + "-ink-" + key + "-" + state + ".png"),
        });
      await glyph("render");
      await heading.evaluate((el) => el.classList.add("rv-pixel-proof"));
      const open = await page.addStyleTag({
        content:
          ".rv-pixel-proof,.rv-pixel-proof *{overflow:visible!important;clip-path:none!important}",
      });
      await glyph("unmasked");
      await open.evaluate((el) => el.remove());
      await heading.evaluate((el) => el.classList.remove("rv-pixel-proof"));
    }
    if (!baseline) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await wait(400);
      assert.ok(
        await rows
          .locator("[data-project-lift]")
          .evaluateAll((els) =>
            els.every((el) => getComputedStyle(el).transform === "none"),
          ),
      );
    }
    assert.deepEqual(errors, []);
    await writeFile(
      path.join(out, width + ".json"),
      JSON.stringify(result, null, 2) + "\n",
    );
    const video = page.video();
    await page.close();
    if (video) await video.saveAs(path.join(out, width + ".webm"));
    console.log("PASS", width, height);
  } finally {
    await ctx.close();
  }
}
try {
  for (const width of widths) await review(width);
} finally {
  await browser.close();
}
