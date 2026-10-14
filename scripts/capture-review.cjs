'use strict';
const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.env.SCREENSHOT_DIR||path.join(root,'screenshots/corporate-only-2026-10-14/after')),base=process.env.TEST_URL||'http://127.0.0.1:4318';
let executable=process.env.CHROMIUM_PATH||chromium.executablePath();if(!fs.existsSync(executable))executable=require('/Users/mohamedtamer0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright').chromium.executablePath();
(async()=>{
 const b=await chromium.launch({executablePath:executable});fs.mkdirSync(out,{recursive:true});const report={browser:b.version(),base,capturedUTC:new Date().toISOString(),liveMessages:false,simulatedConfiguredContact:true,screenshots:[],longTasks:[]};
 try{
  for(const lang of ['ar','en'])for(const route of ['index','services','about','process','contact','service-web'])for(const width of [390,1440]){
   const p=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await p.goto(`${base}/${lang}/${route}.html`);await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));const file=`${lang}-${route}-${width}-viewport.png`;await p.screenshot({path:path.join(out,file)});report.screenshots.push(file);await p.close();
  }
  for(const lang of ['ar','en'])for(const width of [390,1440]){
   const p=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await p.route('**/api/contact/status',r=>r.fulfill({json:{configured:true}}));await p.route('**/api/contact',r=>r.abort());await p.goto(`${base}/${lang}/contact.html?service=web`);await p.waitForFunction(()=>!document.getElementById('send-inquiry').disabled);const file=`${lang}-contact-configured-${width}.png`;await p.screenshot({path:path.join(out,file),fullPage:true});report.screenshots.push(file);await p.close();
  }
  // A normal local observation complements Lighthouse's English Contact scripting warning.
  const p=await b.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});await p.addInitScript(()=>{window.__tasks=[];try{new PerformanceObserver(list=>{for(const e of list.getEntries())window.__tasks.push({duration:e.duration,startTime:e.startTime});}).observe({type:'longtask',buffered:true});}catch{window.__taskUnavailable=true;}});await p.goto(base+'/en/contact.html');await p.waitForTimeout(5500);report.longTaskObservation=await p.evaluate(()=>({available:!window.__taskUnavailable,observationMs:5500,entries:window.__tasks}));await p.close();
 }finally{await b.close();fs.writeFileSync(path.join(out,'visual-review-report.json'),JSON.stringify(report,null,2));}
 console.log('Captured private viewports/configured Contact; browser '+report.browser+'. No messages sent.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
