'use strict';
// Behavioral motion checks. Evidence defaults outside the Git checkout.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium,webkit}=require('playwright');
const base=process.env.TEST_URL||'http://127.0.0.1:4318';
const out=path.resolve(process.env.SCREENSHOT_DIR||path.join(os.tmpdir(),'mtss-motion-evidence'));
fs.mkdirSync(out,{recursive:true});
const report={base,engines:[],simulatedContact:true};
const widths=[320,390,768,1119,1120,1279,1280,1440];
const titles={en:'Software for your business and your next idea.',ar:'حلول برمجية لأعمالك وأفكارك.'};
const serviceIds=['custom','web','mobile-app','backend-api','integration','consulting','support','cloud'];
function instrument(){
 window.__motion={calls:[],observers:new Set(),shifts:[]};
 const animate=Element.prototype.animate;
 Element.prototype.animate=function(...args){window.__motion.calls.push({target:this,time:performance.now()});return animate.apply(this,args);};
 const Observer=window.IntersectionObserver;
 window.IntersectionObserver=class extends Observer{
  observe(el){window.__motion.observers.add(this);return super.observe(el);}
  disconnect(){window.__motion.observers.delete(this);return super.disconnect();}
 };
 if(PerformanceObserver.supportedEntryTypes.includes('layout-shift')){
  window.__motion.layoutShiftSupported=true;
  new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__motion.shifts.push(entry.value);}).observe({type:'layout-shift',buffered:true});
 }
}
async function overflow(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');}
async function readable(p){
 assert(await p.locator('h1').evaluate(el=>getComputedStyle(el).opacity==='1'&&getComputedStyle(el).visibility==='visible'),'Headline remains readable');
 assert(await p.locator('.hero-highlight').evaluate(el=>getComputedStyle(el).opacity==='1'&&el.getClientRects().length===1),'One intact highlighted word');
}
async function arrow(p,selector){return p.locator(selector+' > .directional').first().evaluate(el=>{const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return{scale:m.a,x:m.e};});}
async function run(b,name,entry){
 const errors=[];
 const page=async options=>{const p=await b.newPage(options);p.on('pageerror',e=>errors.push(e.message));return p;};
 // Static and reduced presentation, logical origin, wrapping, routes, and zoom reflow.
 for(const lang of ['en','ar'])for(const width of widths){
  const p=await page({viewport:{width,height:900},reducedMotion:'reduce'});
  await p.goto(`${base}/${lang}/index.html`);await overflow(p);await readable(p);
  assert.equal(await p.locator('h1').innerText(),titles[lang]);
  assert.equal(await p.locator('.service-index-link').count(),8);
  assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
  const origin=await p.locator('.hero-highlight').evaluate(el=>{const css=getComputedStyle(el,'::before');return{origin:parseFloat(css.transformOrigin),width:el.getBoundingClientRect().width};});
  assert(lang==='ar'?Math.abs(origin.origin-origin.width)<1:origin.origin<1,'Highlight reveals from logical start');
  if([390,1440].includes(width))await p.screenshot({path:path.join(out,`${name}-${lang}-${width}.png`),fullPage:true});
  await p.close();entry.layouts++;
 }
 for(const lang of ['en','ar']){
  const p=await page({viewport:{width:320,height:900},reducedMotion:'reduce'});await p.goto(`${base}/${lang}/index.html`);
  await p.evaluate(()=>{const h=document.querySelector('h1');h.style.fontSize=parseFloat(getComputedStyle(h).fontSize)*2+'px';});await overflow(p);await readable(p);
  await p.screenshot({path:path.join(out,`${name}-${lang}-headline-200.png`)});await p.close();
  const zoom=await page({viewport:{width:720,height:500},deviceScaleFactor:2,reducedMotion:'reduce'});await zoom.goto(`${base}/${lang}/index.html`);await overflow(zoom);await readable(zoom);await zoom.close();
  const nojs=await page({javaScriptEnabled:false,viewport:{width:320,height:900}});await nojs.goto(`${base}/${lang}/index.html`);
  await overflow(nojs);await readable(nojs);assert.equal(await nojs.locator('.hero-content.is-entering').count(),0);
  const response=await nojs.locator('.service-index-link').first().getAttribute('href');assert(response.endsWith('service-custom.html'));
  await nojs.goto(`${base}/${lang}/contact.html`);assert(await nojs.locator('.direct-links .email-link').isVisible());assert(await nojs.locator('#send-inquiry').isDisabled());await nojs.close();
 }
 entry.checks.push('16 bilingual responsive layouts; doubled headline text and 200% equivalent reflow; complete no-JS/reduced-motion presentation');

 for(const lang of ['en','ar']){
  const p=await page({viewport:{width:1440,height:900},reducedMotion:'no-preference'});await p.addInitScript(instrument);
  await p.goto(`${base}/${lang}/index.html`);await readable(p);
  await p.waitForFunction(()=>document.getAnimations().some(a=>a.animationName==='highlight-in'));
  const highlight=await p.evaluate(()=>{const a=document.getAnimations().find(a=>a.animationName==='highlight-in');document.getAnimations().forEach(a=>a.pause());return{duration:a.effect.getTiming().duration,iterations:a.effect.getTiming().iterations};});assert.equal(highlight.iterations,1);
  const geometry=[];
  for(const fraction of [0,.3,.7,1]){
   geometry.push(await p.evaluate(f=>{const a=document.getAnimations().find(a=>a.animationName==='highlight-in');const timing=a.effect.getTiming();a.currentTime=timing.delay+timing.duration*f;const h=document.querySelector('.hero');return{height:h.offsetHeight,scroll:document.documentElement.scrollHeight};},fraction));
   await readable(p);if(name==='Chromium')await p.screenshot({path:path.join(out,`${name}-${lang}-reveal-${fraction}.png`)});
  }
  assert(geometry.every(g=>g.height===geometry[0].height&&g.scroll===geometry[0].scroll),'Reveal causes no layout movement');
  await p.evaluate(()=>document.getAnimations().forEach(a=>a.play()));
  await p.waitForFunction(()=>!document.querySelector('.hero-content').classList.contains('is-entering'));
  const link=p.locator('.service-index-link').first();await link.scrollIntoViewIfNeeded();await p.waitForTimeout(650);
  const normal=await link.evaluate(el=>({bg:getComputedStyle(el).backgroundColor,height:el.offsetHeight}));
  await link.hover();await p.waitForTimeout(250);const hover=await link.evaluate(el=>({bg:getComputedStyle(el).backgroundColor,height:el.offsetHeight}));
  assert.notEqual(hover.bg,normal.bg);assert.equal(hover.height,normal.height);
  const hovered=await arrow(p,'.service-index-link');assert(lang==='ar'?hovered.x<0&&hovered.scale<0:hovered.x>0&&hovered.scale>0,'Hover arrow follows locale');
  await p.mouse.move(0,0);await link.focus();await p.waitForTimeout(250);
  assert(await link.evaluate(el=>el.matches(':focus-visible')&&getComputedStyle(el).outlineStyle!=='none'));
  const focused=await arrow(p,'.service-index-link');assert(lang==='ar'?focused.x<0:focused.x>0,'Keyboard feedback matches hover');
  await p.keyboard.press('Enter');await p.waitForURL(`**/${lang}/service-custom.html`);
  await p.goto(`${base}/${lang}/index.html`);await p.waitForTimeout(650);
  await p.locator('#catalog').scrollIntoViewIfNeeded();await p.waitForTimeout(650);
  const firstCalls=await p.evaluate(()=>window.__motion.calls.filter(c=>c.target.closest('#catalog')).length);assert(firstCalls>0);
  await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(200);await p.locator('#catalog').scrollIntoViewIfNeeded();await p.waitForTimeout(650);
  assert.equal(await p.evaluate(()=>window.__motion.calls.filter(c=>c.target.closest('#catalog')).length),firstCalls,'Scrolling back does not replay reveals');
  await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);
  assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
  await link.focus();assert.equal((await arrow(p,'.service-index-link')).x,0,'Reduced motion retains orientation without displacement');
  await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(650);
  assert.equal(await p.evaluate(()=>window.__motion.calls.filter(c=>c.target.closest('#catalog')).length),firstCalls,'Preference changes do not replay visited sections');
  await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(150);
  assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.animationName==='highlight-in').length),0,'Hero highlight does not replay');
  const shifts=await p.evaluate(()=>window.__motion.layoutShiftSupported?window.__motion.shifts.reduce((a,b)=>a+b,0):null);entry.layoutShift[lang]=shifts;
  if(shifts!==null)assert(shifts<=.005,'Unexpected layout shift');
  await p.goto(`${base}/${lang}/services.html`);await p.locator('.summary-actions .service-link').first().focus();await p.waitForTimeout(250);
  assert(lang==='ar'?(await arrow(p,'.summary-actions .service-link')).x<0:(await arrow(p,'.summary-actions .service-link')).x>0,'Service detail links retain logical motion');
  for(const id of ['business','mobile','connected','operations',...serviceIds])assert.equal(await p.locator('#'+id).count(),1);
  await p.close();
 }
 entry.checks.push('Timed highlight samples and stable layout; mouse/keyboard direction; one-shot scrolling; live reduced-motion changes; legacy anchors');

 // Touch must not retain desktop hover feedback; all information remains visible.
 for(const lang of ['en','ar']){
  const p=await page({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'no-preference'});await p.goto(`${base}/${lang}/index.html`);
  const link=p.locator('.service-index-link').first();await link.scrollIntoViewIfNeeded();await p.waitForTimeout(650);
  const before=await link.evaluate(el=>getComputedStyle(el).backgroundColor);await link.hover();await p.waitForTimeout(250);
  assert.equal(await link.evaluate(el=>getComputedStyle(el).backgroundColor),before);assert.equal((await arrow(p,'.service-index-link')).x,0);
  await link.tap();await p.waitForURL('**/service-custom.html');await p.close();
 }
 // Unsupported APIs and per-animation exceptions must never hide content or break navigation.
 for(const failure of ['observer','animate','throw','getAnimations']){
  const p=await page({viewport:{width:390,height:844}});await p.addInitScript(f=>{
   if(f==='observer')window.IntersectionObserver=undefined;
   if(f==='animate')Element.prototype.animate=undefined;
   if(f==='throw')Element.prototype.animate=()=>{throw new Error('Simulated unsupported animation');};
   if(f==='getAnimations')document.getAnimations=undefined;
  },failure);
  await p.goto(base+'/ar/index.html');await p.waitForTimeout(650);await readable(p);await overflow(p);
  await p.locator('#catalog').scrollIntoViewIfNeeded();await p.waitForTimeout(650);
  assert(await p.locator('#catalog .section-heading').evaluate(el=>getComputedStyle(el).opacity==='1'));
  await p.emulateMedia({reducedMotion:'reduce'});await p.emulateMedia({reducedMotion:'no-preference'});await p.locator('.service-index-link').first().click();await p.waitForURL('**/service-custom.html');await p.close();
 }
 entry.checks.push('Touch links; absent/throwing animation APIs; absent getAnimations without page errors');

 // Locale updates replace DOM: drafts stay, old animations/observers are discarded.
 const contact=await page({viewport:{width:1440,height:900},reducedMotion:'no-preference'});await contact.addInitScript(instrument);
 await contact.route('**/api/contact/status',r=>r.fulfill({json:{configured:true}}));await contact.goto(base+'/en/contact.html?service=integration');
 await contact.waitForFunction(()=>!document.getElementById('send-inquiry').disabled);await contact.locator('#name').fill('Motion test draft');await contact.locator('#details').fill('Preserved Arabic / English draft');
 for(const lang of ['ar','en','ar','en']){
  await contact.locator(`[data-language=${lang}]`).click();await contact.waitForFunction(l=>document.documentElement.lang===l,lang);
  assert.equal(await contact.locator('#name').inputValue(),'Motion test draft');assert.equal(await contact.locator('#details').inputValue(),'Preserved Arabic / English draft');assert.equal(await contact.locator('#service').inputValue(),'integration');
  assert(await contact.evaluate(()=>window.__motion.observers.size<=1),'No duplicate active observers');
  assert(await contact.evaluate(()=>document.getAnimations().every(a=>a.effect.target.isConnected)),'No detached target animations');
 }
 await contact.emulateMedia({reducedMotion:'reduce'});await contact.waitForFunction(()=>window.__motion.observers.size===0);await contact.close();
 entry.checks.push('Repeated in-page locale switching preserves drafts/preselection and clears old observers/animations; no real submissions');
 assert.equal(errors.length,0,JSON.stringify(errors));
}
(async()=>{
 for(const [name,engine]of [['Chromium',chromium],['WebKit',webkit]]){
  const entry={name,status:'pending',layouts:0,checks:[],layoutShift:{}};let b;
  try{
   let executablePath;
   if(name==='Chromium')executablePath=process.env.CHROMIUM_PATH||(fs.existsSync(chromium.executablePath())?chromium.executablePath():require('/Users/mohamedtamer0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright').chromium.executablePath());
   b=await engine.launch({executablePath,timeout:20000});entry.version=b.version();
  }catch(e){entry.status='unavailable';entry.error=e.message;report.engines.push(entry);continue;}
  try{await run(b,name,entry);entry.status='passed';}catch(e){entry.status='failed';entry.error=e.stack;}finally{await b.close();report.engines.push(entry);}
 }
 fs.writeFileSync(path.join(out,'motion-report.json'),JSON.stringify(report,null,2));
 for(const e of report.engines)console.log(`${e.name}: ${e.status} (${e.layouts} layouts)${e.error?'\n'+e.error:''}`);
 if(report.engines.some(e=>e.status!=='passed'))process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
