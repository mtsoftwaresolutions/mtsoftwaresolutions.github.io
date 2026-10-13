'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const {mkdtempSync,rmSync}=require('node:fs');const os=require('node:os');const path=require('node:path');
const {validate}=require('../js/contact-rules.js');const {createContact}=require('../server/contact.cjs');const {sqliteLimiter,redisLimiter,keyFor}=require('../server/rate-limit.cjs');const {createServer}=require('../server/index.cjs');
const valid={name:'محمد & فريق MT',email:'visitor@example.com',organization:'شركة',phone:'+20 (100) 123-4567',service:'integration',details:'ربط الأنظمة ومراجعة <البيانات> — café & C++',language:'ar',website:''};
const allow={consume:async()=>({allowed:true}),close(){}};
const config={apiKey:'test-only-placeholder',from:'contact@example.com'};
const good=async()=>new Response(JSON.stringify({id:'simulated-provider-id'}),{status:200});
test('shared validation: Arabic, optional international number, and legitimate punctuation',()=>{assert.equal(validate(valid).valid,true);assert.equal(validate({...valid,phone:''}).valid,true);});
test('server contract rejects required, type, length, service, header injection, language and honeypot abuse',()=>{
 for(const patch of [{name:''},{email:'bad'},{details:''},{name:7},{details:'x'.repeat(5001)},{service:'invented'},{email:'victim@example.com\r\nBcc:x@example.com'},{language:'fr'},{website:'bot'},{phone:'abc'}])assert.equal(validate({...valid,...patch}).valid,false,JSON.stringify(patch).slice(0,50));
});
test('provider acceptance is required; recipient fixed; verified From and visitor Reply-To; Arabic intact; deterministic retry key',async()=>{
 const calls=[];const fetchImpl=async(url,options)=>{calls.push({url,options});return good();};
 const contact=createContact({config,limiter:allow,fetchImpl});
 const context={ip:'127.0.0.1',idempotencyKey:'abcdefghijklmnop1234'};
 assert.equal((await contact(valid,context)).body.accepted,true);await contact(valid,context);
 const sent=JSON.parse(calls[0].options.body);assert.equal(sent.from,config.from);assert.deepEqual(sent.to,['mtsscorporate@gmail.com']);assert.equal(sent.reply_to,valid.email);assert(sent.text.includes(valid.details));assert.equal(calls[0].options.headers['Idempotency-Key'],calls[1].options.headers['Idempotency-Key']);
 await contact({...valid,details:'Different'},context);assert.notEqual(calls[2].options.headers['Idempotency-Key'],calls[0].options.headers['Idempotency-Key']);
});
test('no configuration, provider error, invalid provider response, timeout and rate-store failure never return acceptance',async()=>{
 for(const fetchImpl of [async()=>new Response('{}',{status:500}),async()=>new Response('{}',{status:200}),async()=>{throw new Error('timeout secret user data');}]){const logs=[];const contact=createContact({config,limiter:allow,fetchImpl,log:x=>logs.push(x)});const r=await contact(valid);assert.equal(r.status,502);assert(!r.body.accepted);assert(logs.every(x=>!x.includes('secret')));}
 const missing=createContact({config:{},limiter:allow,fetchImpl:()=>{throw Error('must not send')}});assert.equal((await missing(valid)).status,503);
 const failure=createContact({config,limiter:{consume:async()=>{throw Error('unavailable')}},log:()=>{}});assert.equal((await failure(valid)).status,503);
});
test('SQLite rate counter persists across instances and expires; only hashed connection identifiers stored',async()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'mtss-rate-')),file=path.join(dir,'limits.sqlite'),salt='test-salt';const first=sqliteLimiter(file,salt),second=sqliteLimiter(file,salt);
 try{for(let i=0;i<5;i++)assert.equal((await(i%2?first:second).consume('client-ip',1000)).allowed,true);assert.equal((await first.consume('client-ip',1001)).allowed,false);assert.equal((await second.consume('client-ip',1000+900001)).allowed,true);assert(!keyFor('client-ip',salt).includes('client-ip'));}finally{first.close();second.close();rmSync(dir,{recursive:true,force:true});}
});
test('distributed Redis rate counter uses atomic EVAL and fails closed on invalid responses',async()=>{
 let request;const limiter=redisLimiter({url:'https://rate.example.com',token:'test',salt:'test',fetchImpl:async(url,o)=>{request=JSON.parse(o.body);return new Response(JSON.stringify({result:[6,120000]}));}});const r=await limiter.consume('client');assert.equal(r.allowed,false);assert.equal(r.retryAfter,120);assert.equal(request[0],'EVAL');assert(!request.join('').includes('client'));
 const bad=redisLimiter({url:'https://rate.example.com',token:'test',salt:'test',fetchImpl:async()=>new Response('{}')});await assert.rejects(()=>bad.consume('client'));
});
test('HTTP endpoint validates origin, content type, body size and native form; static boundary hides secrets and archives',async()=>{
 const server=createServer({root:path.resolve(__dirname,'../dist'),config,limiter:allow,fetchImpl:good,log:()=>{}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const send=(body,headers={})=>fetch(base+'/api/contact',{method:'POST',headers:{Origin:base,'Content-Type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
 try{
  assert.equal((await send(valid)).status,200);assert.equal((await send({...valid,email:'bad'})).status,422);
  assert.equal((await send(valid,{Origin:'https://attacker.example.com'})).status,403);
  assert.equal((await send(valid,{'Content-Type':'text/plain'})).status,415);
  assert.equal((await send('not json')).status,400);assert.equal((await send('a'.repeat(33000))).status,413);
  const form=await send(new URLSearchParams(valid).toString(),{'Content-Type':'application/x-www-form-urlencoded'});assert.equal(form.status,200);assert((await form.text()).includes('تم قبول'));
  for(const file of ['/.env','/docs/archive/before-direct-file.zip','/package.json','/server/contact.cjs','/node_modules/bootstrap/package.json','/csp-hashes.json'])assert.equal((await fetch(base+file)).status,404,file);
  const missing=await fetch(base+'/ar/unknown/nested');assert.equal(missing.status,404);assert((await missing.text()).includes('dir="rtl"'));assert(missing.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
  assert.equal((await fetch(base+'/api/contact')).status,405);
 }finally{await new Promise(r=>server.close(r));}
});
