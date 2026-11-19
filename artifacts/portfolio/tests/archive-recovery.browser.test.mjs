import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright-core";
import { mockServices } from "./helpers/services.mjs";

test("a failed archive chunk keeps Contact and the portfolio navigation usable", {
  skip: !process.env.PORTFOLIO_BUILD_DIRECTORY,
  timeout: 30_000,
}, async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await mockServices(context);
    await context.route("**/assets/SecondaryArchive-*.js", route => route.abort());
    const page = await context.newPage();
    await page.goto("http://localhost:4173/#contact");
    await page.getByTestId("button-open-secondary-archive").click();
    await page.getByRole("button", { name: "Muat ulang halaman" }).waitFor({ timeout: 5_000 });
    assert.equal(await page.getByRole("navigation", { name: "Main navigation" }).count(), 1);
    assert.equal(await page.locator("#contact .contact-primary-cta").count(), 1);
    assert.equal(await page.getByText("Motion is unavailable.", { exact: false }).count(), 0);
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    assert.equal(await page.getByRole("button", { name: "Close navigation menu" }).getAttribute("aria-expanded"), "true");
  } finally {
    await browser.close();
  }
});
