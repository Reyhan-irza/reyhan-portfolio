import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { chromium } from 'playwright-core';
import { mockServices } from './helpers/services.mjs';

test('PRD production motion acceptance', {skip: !process.env.PORTFOLIO_BUILD_DIRECTORY, timeout:90000}, async t => {
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  await mockServices(context);
  const page=await context.newPage(); page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(['error','warning'].includes(m.type()) && !(m.location().url.includes('/rest/v1/admins?') && m.text().includes('406')))errors.push(m.text());});
  try {
    await page.goto('http://localhost:4173');
    await page.locator('#home h1').waitFor({state:'attached'});
    if (await page.locator('.rv-intro-skip').isVisible()) await page.locator('.rv-intro-skip').click();
    await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
    await t.test('marquee continuity at 360/390/430/tablet/desktop',async()=>{
      for(const width of [360,390,430,768,1280,1440]){
        await page.setViewportSize({width,height:844});
        const tracks=await page.locator('[data-band-track]').evaluateAll(nodes=>nodes.map(el=>({duration:getComputedStyle(el).animationDuration,timing:getComputedStyle(el).animationTimingFunction,width:el.getBoundingClientRect().width,groups:[...el.children].map(n=>({text:n.textContent,width:n.getBoundingClientRect().width}))})));
        for(const v of tracks){assert.equal(v.duration,'0s');assert.equal(v.groups[0].text,v.groups[1].text);assert.ok(Math.abs(v.width/2-v.groups[0].width)<1);}
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      }
      await page.setViewportSize({width:390,height:844});
    });
    await t.test('body theme follows section boundaries both ways',async()=>{
      for(const selector of ['#projects','#about','#projects']){
        await page.locator(selector).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY+100,behavior:'instant'}));
        await page.waitForTimeout(1200);
        const v=await page.locator(selector).evaluate(el=>({expected:getComputedStyle(el).getPropertyValue('--canvas').trim(),actual:getComputedStyle(document.body).backgroundColor}));
        assert.equal(v.actual,`rgb(${v.expected.slice(1).match(/../g).map(x=>parseInt(x,16)).join(', ')})`);
      }
    });
    await t.test('project modal locks Lenis and restores keyboard focus',async()=>{
      await page.getByTestId('button-details-1').click();
      await page.getByTestId('project-detail-dialog').waitFor({state:'visible'});
      await page.waitForFunction(()=>document.documentElement.classList.contains('lenis-stopped'));
      await page.keyboard.press('Escape');
      await page.getByTestId('project-detail-dialog').waitFor({state:'hidden'});
      await page.waitForFunction(()=>!document.documentElement.classList.contains('lenis-stopped'));
      await page.waitForFunction(()=>document.activeElement?.getAttribute('data-testid')==='button-details-1');
    });
    await t.test('live reduced motion keeps menu usable and every reveal visible',async()=>{
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForFunction(()=>!document.documentElement.classList.contains('lenis'));
      assert.equal(await page.locator('[data-band-track]').first().evaluate(el=>getComputedStyle(el).animationName),'none');
      assert.ok(await page.locator('[data-reveal], [data-reveal-group] > *').evaluateAll(nodes=>nodes.every(el=>Number(getComputedStyle(el).opacity)===1)));
      await page.getByTestId('button-mobile-menu').click();
      await page.locator('#mobile-navigation').getByRole('link',{name:'Contact'}).click();
      await page.waitForFunction(()=>location.hash==='#contact'&&document.body.style.overflow!=='hidden');
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
    });
    await t.test('route cleanup releases Lenis and the body lock',async()=>{
      await page.getByRole('button',{name:'Developer Access',exact:true}).click();
      await page.waitForURL('**/admin');
      // React's passive cleanup runs after the route URL commits.
      await page.waitForFunction(()=>!document.documentElement.classList.contains('lenis')&&document.body.style.overflow!=='hidden');
      await page.goBack();
      await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
    });
    await t.test("developer form rejects invalid input and accepts the isolated account",async()=>{
      await page.goto('http://localhost:4173/admin');
      const password=randomUUID();
      await page.route('**/rest/v1/admins?*',route=>{
        const query=new URL(route.request().url()).searchParams;
        const ok=query.get('username')==='eq.motion-review' && query.get('password')==='eq.'+password;
        return route.fulfill(ok?{json:{id:9}}:{status:406,json:{code:'PGRST116',message:'No matching row'}});
      });
      await page.getByPlaceholder('Enter username').fill('motion-review');
      await page.getByPlaceholder('Enter password').fill('invalid-input');
      await page.locator('form button[type=submit]').click();
      await page.getByText('Invalid username or password.').waitFor();
      await page.getByPlaceholder('Enter password').fill(password);
      await page.locator('form button[type=submit]').click();
      await page.waitForURL('**/admin/dashboard');
    });
    await t.test('CPU 4x scrolling progresses without hidden reading content',async tc=>{
      // Independent navigation prevents a failed route assertion from cascading.
      await page.goto('http://localhost:4173');
      await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
      const cdp=await context.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
      try{
        await page.waitForTimeout(1800);
        const sampling=page.evaluate(()=>new Promise(resolve=>{let last=performance.now();const frames=[];const tick=now=>{frames.push(now-last);last=now;if(frames.length<180)requestAnimationFrame(tick);else{frames.sort((a,b)=>a-b);resolve({median:frames[90],p95:frames[171],over50ms:frames.filter(v=>v>50).length});}};requestAnimationFrame(tick);}));
        await page.mouse.move(200,500);
        for(let i=0;i<6;i++){await page.mouse.wheel(0,350);await page.waitForTimeout(180);}
        tc.diagnostic(`CPU 4x frame intervals (ms): ${JSON.stringify(await sampling)}`);
        assert.ok(await page.evaluate(()=>scrollY>1000)); await page.waitForTimeout(1500);
        assert.equal(await page.locator('[data-reveal]').evaluateAll(nodes=>nodes.filter(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight*.88&&Number(getComputedStyle(el).opacity)<.99;}).length),0);
      }finally{await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});await cdp.detach();}
    });
    assert.deepEqual(errors,[]);
  }finally{await context.close();await browser.close();}
});
