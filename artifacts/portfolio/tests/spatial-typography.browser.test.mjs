import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { mockServices } from './helpers/services.mjs';

const viewports = [[360, 800], [390, 844], [430, 932], [768, 1024], [1280, 900], [1440, 900]];

test('sans typography, four certificates and independent spatial scenes', {
  skip: !process.env.PORTFOLIO_BUILD_DIRECTORY,
  timeout: 180_000,
}, async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
  const evidence = process.env.SPATIAL_EVIDENCE_DIRECTORY;
  const results = [];
  if (evidence) await mkdir(evidence, { recursive: true });
  try {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1024 });
      try {
        await mockServices(context);
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('http://localhost:4173/');
        await page.locator('#home h1').waitFor({ state: 'attached' });
        if (await page.locator('.rv-intro-skip').isVisible()) await page.locator('.rv-intro-skip').click();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1850);
        const capture = async name => {
          if (evidence && [390, 1440].includes(width)) await page.screenshot({ path: path.join(evidence, `${width}-${name}.png`) });
        };
        const go = async top => {
          await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
          await page.waitForTimeout(900);
        };
        const jump = async selector => {
          const top = await page.locator(selector).first().evaluate(el => el.getBoundingClientRect().top + scrollY - innerHeight * .18);
          await go(top);
        };
        await capture('hero');
        const forbiddenFonts = await page.locator('body *').evaluateAll(elements => elements
          .filter(el => el.childNodes.length && Array.from(el.childNodes).some(node => node.nodeType === 3 && node.textContent.trim()))
          .map(el => ({ text: el.textContent.trim().slice(0, 45), family: getComputedStyle(el).fontFamily }))
          .filter(item => /Times|Georgia|Fraunces|RV Editorial/i.test(item.family) || item.family === 'serif'));
        assert.deepEqual(forbiddenFonts, [], `legacy serif at ${width}`);
        const cdp = await context.newCDPSession(page);
        await cdp.send('DOM.enable');
        await cdp.send('CSS.enable');
        const { root } = await cdp.send('DOM.getDocument');
        const platformFonts = {};
        for (const selector of ['#home [data-hero-title-line]', '.project-heading-accent', '.github-description']) {
          const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
          const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
          platformFonts[selector] = fonts.filter(font => font.glyphCount > 0).map(font => font.familyName);
          assert.ok(platformFonts[selector].length, `rendered font for ${selector}`);
          assert.ok(!platformFonts[selector].some(font => /Times|Georgia|Fraunces/i.test(font)));
        }
        const cards = page.locator('[data-project-row]');
        const poses = [];
        for (let index = 0; index < 3; index++) {
          const card = cards.nth(index);
          const layout = await card.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight }));
          const distance = Math.min(layout.height * .9, height * .8);
          const middle = layout.top - height * .96 + distance * .65;
          const pose = () => card.locator('[data-project-plane]').evaluate(el => {
            const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
            return { x: m.m13, y: m.m23, z: m.m43 };
          });
          await go(middle);
          const entry = await pose();
          assert.ok(Math.abs(entry.x) + Math.abs(entry.y) > .002, `3D entry at ${width}/${index}`);
          await capture(`project-${index + 1}-entry`);
          await go(Math.max(layout.top - height * .96 + distance + 80, layout.top - height * .12 + 40));
          const rest = await pose();
          assert.ok(Math.abs(rest.x) + Math.abs(rest.y) < .002);
          if (index === 1) await capture('project');
          await go(middle);
          const reversed = await pose();
          assert.ok(Math.abs(entry.x - reversed.x) + Math.abs(entry.y - reversed.y) < .02);
          poses.push(entry);
        }
        assert.equal(new Set(poses.map(pose => `${Math.sign(pose.x)},${Math.sign(pose.y)}`)).size, 3);
        await jump('[data-testid="link-dicoding-certificate-preview"]');
        const certificate = page.getByTestId('link-dicoding-certificate-preview');
        await certificate.locator('img').evaluate(image => image.decode());
        assert.ok(await certificate.locator('img').evaluate(image => image.naturalWidth > 700));
        assert.equal(await certificate.getAttribute('href'), '/sertifikat-dicoding-microsoft-fabric-2026.jpeg');
        assert.equal(await page.getByTestId('link-download-dicoding-certificate').getAttribute('download'), 'sertifikat-dicoding-microsoft-fabric-2026.jpeg');
        assert.equal(await page.locator('[data-award-record]').count(), 4);
        await capture('certificate');
        await jump('#closing-type');
        await page.mouse.move(0, 0);
        const strip = page.locator('#closing-type');
        assert.ok(await strip.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('#contact')) & Node.DOCUMENT_POSITION_FOLLOWING)));
        assert.equal(await strip.locator('button').count(), 0);
        const tracks = strip.locator('[data-closing-track]');
        assert.equal(await tracks.count(), 2);
        const positions = () => tracks.evaluateAll(nodes => nodes.map(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41));
        const first = await positions();
        await page.waitForTimeout(400);
        const next = await positions();
        assert.ok(next[0] < first[0] - 1 && next[1] > first[1] + 1, `opposing tracks at ${width}`);
        const seams = await tracks.evaluateAll(nodes => nodes.map(el => Math.abs(el.children[0].getBoundingClientRect().width - el.children[1].getBoundingClientRect().width)));
        assert.ok(seams.every(error => error < .1));
        await capture('marquee');
        await strip.focus();
        const stopped = await positions();
        await page.waitForTimeout(250);
        assert.ok((await positions()).every((value, index) => Math.abs(value - stopped[index]) < .5));
        await page.keyboard.press('Tab');
        await jump('#github h2');
        await capture('github');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(400);
        const reduced = await page.locator('[data-project-plane],[data-award-plane],[data-hero-sculpture],[data-closing-track]').evaluateAll(nodes => nodes.every(el => getComputedStyle(el).transform === 'none'));
        assert.ok(reduced, `reduced motion at ${width}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert.equal(overflow, 0);
        assert.deepEqual(errors, []);
        results.push({ width, height, platformFonts, projectPoses: poses, marqueeDelta: next.map((x, i) => x - first[i]), seams, overflow, reducedMotion: reduced, errors });
      } finally { await context.close(); }
    }
    if (evidence) await writeFile(path.join(evidence, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  } finally { await browser.close(); }
});
