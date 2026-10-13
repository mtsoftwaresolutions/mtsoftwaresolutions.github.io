'use strict';
const fs=require('node:fs'),path=require('node:path');
const base=process.env.TEST_URL||'http://127.0.0.1:4318';
async function run(){
 const {default:lighthouse}=await import('lighthouse');const {launch}=await import('chrome-launcher');
 let chromePath=process.env.CHROMIUM_PATH;
 if(!chromePath){try{chromePath=require('/Users/mohamedtamer0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright').chromium.executablePath();}catch{chromePath=require('playwright').chromium.executablePath();}}
 const chrome=await launch({chromePath,chromeFlags:['--headless','--no-sandbox']});const scores=[];const dir=path.resolve(process.env.SCREENSHOT_DIR||path.join(__dirname,'../screenshots/corporate-only-2026-10-13/after'),'lighthouse');fs.mkdirSync(dir,{recursive:true});
 try{for(const lang of ['en','ar'])for(const page of ['index','contact','service-web']){
  const result=await lighthouse(`${base}/${lang}/${page}.html`,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  fs.writeFileSync(path.join(dir,`${lang}-${page}.json`),result.report);
  const lhr=result.lhr;const entry={page:`${lang}/${page}`,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].map(k=>[k,lhr.audits[k].displayValue])),issues:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<.9&&a.details).map(a=>({id:a.id,title:a.title,value:a.displayValue}))};scores.push(entry);console.log(JSON.stringify(entry));
 }}finally{await chrome.kill();fs.writeFileSync(path.join(dir,'scores.json'),JSON.stringify(scores,null,2));}
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
