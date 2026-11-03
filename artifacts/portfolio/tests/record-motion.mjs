// Build first. This harness records real frames with API fixtures; it never writes production telemetry.
// PORTFOLIO_BUILD_DIRECTORY=... CHROMIUM_PATH=... MOTION_EVIDENCE_DIR=... node tests/record-motion.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { mockServices } from './helpers/services.mjs';
assert.ok(process.env.PORTFOLIO_BUILD_DIRECTORY);
const output = path.resolve(process.env.MOTION_EVIDENCE_DIR ?? 'motion-evidence');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args:['--no-sandbox'] });
const results = [];
try {
  for (const width of (process.env.MOTION_WIDTHS ?? '360,390,430,768,1280').split(',').map(Number)) {
    const height = width === 1280 ? 900 : 844, record = width === 390 || width === 1280;
    const context = await browser.newContext({ viewport:{width,height}, isMobile:width<768, hasTouch:width<1024,
      reducedMotion:'no-preference', ...(record ? {recordVideo:{dir:output,size:{width,height}}} : {}) });
    await mockServices(context);
    const page = await context.newPage(), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const shot = name => page.screenshot({path:path.join(output,`${width}-${name}.png`)});
    await page.goto('http://localhost:4173',{waitUntil:'domcontentloaded'});
    await page.locator('#rv-intro').waitFor({state:'visible'});
    await page.waitForTimeout(3650); await shot('intro');
    await page.locator('#rv-intro').waitFor({state:'detached'});
    await page.waitForTimeout(1700); await shot('hero');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
    if (width<1024) {
      await page.getByTestId('button-mobile-menu').click();
      await page.waitForTimeout(300); await shot('menu-enter');
      await page.waitForTimeout(1000); await shot('menu-open');
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>getComputedStyle(document.querySelector('#mobile-navigation')).display==='none');
    }
    const settle = () => page.evaluate(()=>new Promise(resolve=>{
      let last=scrollY, still=0; const tick=()=>{still=Math.abs(scrollY-last)<.5?still+1:0;last=scrollY;
        if(still>=20)resolve();else requestAnimationFrame(tick);};requestAnimationFrame(tick);
    }));
    const go = async selector => {
      await settle();
      const target = await page.locator(selector).first().evaluate(el=>scrollY+el.getBoundingClientRect().top-innerHeight*.18);
      await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),target);
      await page.waitForTimeout(1500);
      const expected = await page.evaluate(y=>Math.min(Math.max(0,y),document.documentElement.scrollHeight-innerHeight),target);
      assert.ok(Math.abs(await page.evaluate(()=>scrollY)-expected)<3,`${width} ${selector} scroll target`);
    };
    await page.mouse.move(width/2,height/2);
    if (width === 390) {
      const input = await context.newCDPSession(page);
      const before = await page.evaluate(() => scrollY);
      await input.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{x:195,y:650}] });
      for(let y=620;y>=250;y-=30){ await input.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y}]});await page.waitForTimeout(16); }
      await input.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await settle();
      assert.ok(await page.evaluate(()=>scrollY)>before+100,'native touch scroll progresses');
      await input.detach();await go('#home');
    }
    if(record){for(let i=0;i<24;i++){await page.mouse.wheel(0,55);await page.waitForTimeout(100);}await settle();await shot('hero-exit');}
    for(const [selector,label] of [['#about','about'],['#projects','projects'],['#journey','journey'],['#contact','contact'],['.portfolio-closing-footer','footer']]) {
      await go(selector); await shot(label);
      if(record){for(let i=0;i<10;i++){await page.mouse.wheel(0,65);await page.waitForTimeout(100);}
        await page.mouse.wheel(0,1100);await settle();await page.waitForTimeout(400);
        await page.mouse.wheel(0,-650);await settle();await page.waitForTimeout(400);}
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,`${width} ${label} overflow`);
    }
    await go('[data-project-row]');
    const point=await page.evaluate(()=>scrollY), depth=page.locator('[data-project-depth]').first();
    const matrix=()=>depth.evaluate(el=>[...new DOMMatrixReadOnly(getComputedStyle(el).transform).toFloat64Array()]);
    const forward=await matrix();await page.mouse.wheel(0,350);await settle();await page.waitForTimeout(500);const moved=await matrix();
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),point);await page.waitForTimeout(1500);const reverse=await matrix();
    assert.ok(forward.some((v,i)=>Math.abs(v-moved[i])>.001),`${width} depth moves`);
    assert.ok(forward.every((v,i)=>Math.abs(v-reverse[i])<.2),`${width} depth retraces`);
    await page.waitForTimeout(700);const stopped=await matrix();
    assert.ok(reverse.every((v,i)=>Math.abs(v-stopped[i])<.02),`${width} stop drift`);
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(400);
    assert.equal(await depth.evaluate(el=>getComputedStyle(el).transform),'none');
    await go('#contact');assert.ok(await page.locator('#contact h2').evaluate(el=>el.getBoundingClientRect().height>0));
    assert.deepEqual(errors,[]);
    results.push({width,height,overflow:'pass',reverse:'pass',stopped:'pass',reducedMotion:'pass',errors});
    const video=page.video();await context.close();if(video)await video.saveAs(path.join(output,`rv-motion-${width}.webm`));
    console.log(`PASS ${width}x${height}`);
  }
  // Optional comparison: the supplied HTML runs with the project's same GSAP version.
  if(process.env.INTRO_REFERENCE_HTML){
    const context=await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir:output,size:{width:390,height:844}}});
    const html=(await readFile(process.env.INTRO_REFERENCE_HTML,'utf8')).replace('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js','/gsap.js');
    await context.route('http://intro-reference.test/**',async route=>route.fulfill({contentType:route.request().url().endsWith('gsap.js')?'application/javascript':'text/html',body:route.request().url().endsWith('gsap.js')?await readFile(new URL('../node_modules/gsap/dist/gsap.min.js',import.meta.url)):html}));
    const page=await context.newPage();await page.goto('http://intro-reference.test');await page.waitForTimeout(3650);
    await page.screenshot({path:path.join(output,'reference-intro.png')});await page.waitForTimeout(2500);
    const video=page.video();await context.close();await video.saveAs(path.join(output,'reference-intro.webm'));
  }
} finally {await browser.close();await writeFile(path.join(output,process.env.MOTION_WIDTHS ? 'acceptance-'+process.env.MOTION_WIDTHS+'.json' : 'acceptance.json'),JSON.stringify({fontMode:'System fonts in fixtures; live preview checked separately',results},null,2));}
