'use strict';
const {createHash}=require('node:crypto');
const {validate}=require('../js/contact-rules.js');
const EMAIL='mtsscorporate@gmail.com';
function configured(config){return Boolean(config.apiKey&&config.from&&/^[^\r\n<>]+@[^\r\n<>]+\.[^\r\n<>]+$/.test(config.from));}
function createContact({config,limiter,fetchImpl=fetch,log=console.warn}){
 return async function contact(input,{ip,idempotencyKey}={}){
  let limit;
  try{limit=await limiter.consume(ip||'unknown');}catch{log('contact.rate_store_unavailable');return{status:503,body:{code:'unavailable'}};}
  if(!limit.allowed)return{status:429,headers:{'Retry-After':String(limit.retryAfter)},body:{code:'rate_limited'}};
  const result=validate(input||{});
  if(!result.valid){if(result.errors.website)return{status:422,body:{code:'invalid',errors:{details:'invalid'}}};return{status:422,body:{code:'invalid',errors:result.errors}};}
  if(!configured(config))return{status:503,body:{code:'unavailable'}};
  const v=result.values;
  const digest=createHash('sha256').update(JSON.stringify(v)).digest('hex');
  const safeKey=/^[a-zA-Z0-9_-]{16,100}$/.test(idempotencyKey||'')?idempotencyKey:require('node:crypto').randomUUID();
  const providerKey='mtss-'+safeKey+'-'+digest.slice(0,24);
  const text=['MT Software Solutions — Project inquiry','',...['name','email','organization','phone','service','timeline','language','details'].map(k=>`${k}: ${v[k]||'Not provided'}`)].join('\n');
  try{
   const response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json','Idempotency-Key':providerKey},body:JSON.stringify({from:config.from,to:[EMAIL],reply_to:v.email,subject:'Project inquiry | MT Software Solutions',text}),signal:AbortSignal.timeout(config.timeout||10000)});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||typeof data.id!=='string'||!data.id){log('contact.provider_rejected');return{status:502,body:{code:'provider_failure'}};}
   return{status:200,body:{accepted:true}};
  }catch{log('contact.provider_unreachable');return{status:502,body:{code:'provider_failure'}};}
 };
}
module.exports={createContact,configured};
