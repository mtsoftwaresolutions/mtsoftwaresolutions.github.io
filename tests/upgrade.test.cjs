'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const rules=require('../js/contact-rules.js'),{createContact}=require('../server/contact.cjs'),{createServer}=require('../server/index.cjs');
require('../js/content.js');const {services,engagements,audiences,timelines}=global.MTContent;
test('all services have complete bilingual destinations, preserved overview IDs and inquiry preselection',()=>{
 const read=p=>fs.readFileSync(path.resolve(__dirname,'../dist',p),'utf8');
 assert.equal(engagements.length,3);assert.equal(audiences.length,7);
 assert.deepEqual([...new Set(engagements.flatMap(e=>e.services))].sort(),services.map(s=>s.id).sort());
 for(const lang of ['ar','en']){const overview=read(lang+'/services.html');for(const s of services){
  const html=read(`${lang}/service-${s.id}.html`);assert(overview.includes(`id="${s.id}"`));assert(overview.includes(`service-${s.id}.html`));
  assert(html.includes(global.MTContent.pick(s.inputs,lang)));assert(html.includes(`contact.html?service=${s.id}`));assert(html.includes(`services.html#${s.id}`));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert(html.includes('bootstrap'+(lang==='ar'?'.rtl':'')+'.min.css'));
 }
 assert(read(lang+'/contact.html').includes('id="inquiry-fields" disabled'));
 }
});
test('timeline contract validates types/limits, email composition and retry identity end to end',async()=>{
 assert.deepEqual(timelines.map(t=>t.id),rules.timelineIds);
 const base={name:'محمد',email:'visitor@example.com',details:'تفاصيل تجريبية',language:'ar'};
 assert.equal(rules.validate(base).values.timeline,'unsure');
 for(const timeline of ['fake','x'.repeat(17),42])assert.equal(rules.validate({...base,timeline}).valid,false);
 for(const timeline of rules.timelineIds)assert(rules.validate({...base,timeline}).valid);
 const calls=[];const send=createContact({config:{apiKey:'simulated',from:'sender@example.invalid'},limiter:{consume:async()=>({allowed:true})},fetchImpl:async(url,request)=>{calls.push(request);return{ok:true,json:async()=>({id:'test-only'})};}});
 const context={ip:'test',idempotencyKey:'valid_simulated_key_123'};
 await send({...base,timeline:'planned'},context);await send({...base,timeline:'planned'},context);await send({...base,timeline:'soon'},context);
 assert(JSON.parse(calls[0].body).text.includes('timeline: planned'));assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);assert.notEqual(calls[0].headers['Idempotency-Key'],calls[2].headers['Idempotency-Key']);
 assert.deepEqual(JSON.parse(calls[0].body).to,['mtsscorporate@gmail.com']);
});
test('native contact reflects configuration without JavaScript and private business artifacts are never served',async()=>{
 for(const ready of [false,true]){
  const server=createServer({config:ready?{apiKey:'simulated',from:'sender@example.invalid'}:{},limiter:{consume:async()=>({allowed:true}),close(){}}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  try{const origin='http://127.0.0.1:'+server.address().port;const response=await fetch(origin+'/ar/contact.html');const html=await response.text();
   assert(html.includes(`data-contact-configured="${ready}"`));assert.equal(html.includes('<fieldset id="inquiry-fields" disabled>'),!ready);assert.equal(html.includes('class="inquiry-panel" open>'),ready);
   assert.equal(html.indexOf('id="inquiry-form"')<html.indexOf('id="contact-direct-primary"'),ready,'Native reading/keyboard order matches contact availability');
   for(const file of ['/business-operations/README.md','/.private/baselines/baseline-2026-10-13.tar.gz','/docs/EXECUTION-PLAN-2026-10-13.md','/ar/work.html','/en/case-request-workflow.html','/ar/request-demo.html','/js/demo.js','/assets/images/request-demo-en.png'])assert.equal((await fetch(origin+file)).status,404);
  }finally{await new Promise(r=>server.close(r));}
 }
});
