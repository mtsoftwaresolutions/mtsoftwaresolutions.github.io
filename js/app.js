/* Progressive enhancement; generated HTML remains useful without JavaScript. */
(function () {
'use strict';
document.documentElement.classList.add('js');
const app=document.querySelector('#app');
if(!app||!window.MTContent||!window.MTContactRules||!window.MTViews) return;
const {copy,pick,company,services}=window.MTContent;
const rules=window.MTContactRules;
const page=document.body.dataset.page,root=document.body.dataset.root+'/';
let locale=document.documentElement.lang==='ar'?'ar':'en';
let sending=false,available=document.body.dataset.contactConfigured==='true',formState='idle',motionObserver=null,activeController=null;
let requestKey='',requestFingerprint='';
const t=key=>pick(copy[key],locale);
const media=window.matchMedia('(prefers-reduced-motion: reduce)');
const ajaxSupported=typeof window.fetch==='function'&&typeof window.AbortController==='function'&&typeof window.crypto?.getRandomValues==='function';
const statusText={timeout:'timeoutError',success:'success',network:'networkError',provider:'providerError',unavailable:'unavailable',rate:'rateLimited',reset:'resetStatus'};
function status(state){formState=state;const el=document.querySelector('#form-status');if(!el)return;el.textContent=statusText[state]?t(statusText[state]):'';el.dataset.state=state==='success'?'success':(['network','provider','unavailable','rate','timeout'].includes(state)?'error':'idle');}
function formValues(){const f=document.querySelector('#inquiry-form');return f?Object.fromEntries([...f.elements].filter(el=>el.name&&['INPUT','SELECT','TEXTAREA'].includes(el.tagName)).map(el=>[el.name,el.value])):{};}
function feedback(field,code){return code==='long'?t('fieldLong'):t(copy[field+'Error']?field+'Error':'providerError');}
function showErrors(errors){
 const f=document.querySelector('#inquiry-form');
 f.querySelectorAll('.is-invalid').forEach(el=>{el.classList.remove('is-invalid');el.removeAttribute('aria-invalid');});
 f.querySelectorAll('.invalid-feedback').forEach(el=>el.textContent='');
 const summary=document.querySelector('#error-summary');summary.replaceChildren();summary.hidden=!Object.keys(errors).length;
 if(summary.hidden)return;
 const heading=document.createElement('p');heading.textContent=t('errorSummary');summary.append(heading);
 const list=document.createElement('ul');
 for(const [key,code] of Object.entries(errors)){
  const input=f.elements[key];const err=document.getElementById(key+'-error');if(!input||!err)continue;
  const message=feedback(key,code);input.classList.add('is-invalid');input.setAttribute('aria-invalid','true');err.textContent=message;
  const li=document.createElement('li'),a=document.createElement('a');a.href='#'+key;a.textContent=message;a.addEventListener('click',ev=>{ev.preventDefault();input.focus();});li.append(a);list.append(li);
 }summary.append(list);summary.focus();
}
function busy(on){sending=on;const f=document.querySelector('#inquiry-form');if(!f)return;f.setAttribute('aria-busy',String(on));for(const el of f.elements)el.disabled=on||!available;const button=f.querySelector('#send-inquiry');button.disabled=on||!available;button.replaceChildren();if(on){const s=document.createElement('span');s.className='spinner';s.setAttribute('aria-hidden','true');button.append(s);}button.append(document.createTextNode(t(on?'sending':'send')));document.querySelectorAll('.language-switch').forEach(el=>el.setAttribute('aria-disabled',String(on))); }
async function submit(ev){
 ev.preventDefault();if(sending)return;
 const f=ev.currentTarget;
 const input={...formValues(),language:locale};const result=rules.validate(input);
 showErrors(result.errors);if(!result.valid){status('idle');return;}if(!available){status('unavailable');return;}
 const fingerprint=JSON.stringify(result.values);if(requestFingerprint!==fingerprint||!requestKey){requestFingerprint=fingerprint;requestKey=(window.crypto?.randomUUID?.()||Array.from(window.crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''));}
 busy(true);status('idle');const controller=new AbortController();activeController=controller;const timer=setTimeout(()=>controller.abort(),16000);
 try{
  const response=await fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','Idempotency-Key':requestKey},body:JSON.stringify(result.values),signal:controller.signal,credentials:'same-origin'});
  const data=await response.json().catch(()=>({}));
  if(response.ok&&data.accepted===true){clearForm(f);requestKey='';requestFingerprint='';showErrors({});status('success');}
  else if(response.status===422&&data.errors){showErrors(data.errors);status('idle');}
  else status(response.status===429?'rate':response.status===503?'unavailable':'provider');
 }catch(error){status(error.name==='AbortError'?'timeout':'network');}finally{clearTimeout(timer);activeController=null;busy(false);if(formState!=='idle')document.querySelector('#form-status').focus();}
}
function clearForm(f){for(const key of ['name','email','organization','phone','details','website'])f.elements[key].value='';f.elements.service.value='choose';f.elements.timeline.value='unsure';f.elements.language.value=locale;syncLanguageLink();}
function bindForm(){const f=document.querySelector('#inquiry-form');if(!f||!ajaxSupported)return;f.noValidate=true;f.addEventListener('submit',submit);f.addEventListener('reset',ev=>{ev.preventDefault();if(sending)return;clearForm(f);showErrors({});requestKey='';requestFingerprint='';status('reset');});f.addEventListener('input',ev=>{const el=ev.target;if(el.name==='service')syncLanguageLink();if(el.classList.contains('is-invalid')){el.classList.remove('is-invalid');el.removeAttribute('aria-invalid');const err=document.getElementById(el.name+'-error');if(err)err.textContent='';}if(formState==='success')status('idle');});busy(false);}
function renderAvailability(checking=false){
 const el=document.getElementById('contact-availability');if(!el)return;
 el.textContent=t(checking?'contactChecking':available?'contactReady':'contactOffline');el.dataset.availability=checking?'checking':available?'ready':'unavailable';
 if(!checking){
  const panel=document.getElementById('inquiry-panel'),direct=document.getElementById('contact-direct-primary'),card=document.querySelector('.contact-card');
  panel.open=available;document.getElementById('inquiry-fields').disabled=sending||!available;card.dataset.availability=available?'ready':'unavailable';
  // DOM order follows the displayed priority, including keyboard and no-AJAX locale changes.
  if(available)document.getElementById('form-status').after(direct);else card.prepend(direct);
 }
}
async function checkContact(){
 const f=document.querySelector('#inquiry-form');if(!f)return;if(!ajaxSupported){renderAvailability();return;}
 available=document.body.dataset.contactConfigured==='true';renderAvailability(true);busy(false);
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
 try{const response=await fetch(root+'api/contact/status',{headers:{Accept:'application/json'},credentials:'same-origin',signal:controller.signal});const data=await response.json();available=response.ok&&data.configured===true;}catch{available=false;}finally{clearTimeout(timer);renderAvailability();busy(false);}
}

let languageRequest=0,pendingStyle=null,navFocusElement=null;
const desktop=window.matchMedia('(min-width: 70rem)');
function syncLanguageLink(){
 const selected=document.querySelector('#service')?.value;
 const search=page==='contact'&&services.some(s=>s.id===selected)?'?service='+encodeURIComponent(selected):'';
 document.querySelectorAll('[data-language]').forEach(link=>{link.href=root+link.dataset.language+'/'+(page==='home'?'index':page)+'.html'+search+location.hash;});
}
function updateMetadata(){
 document.title=pick(copy.nav[4],locale)+' | '+company.name;
 for(const [selector,value]of [['meta[name="description"]',t('contactDescription')],['meta[property="og:title"]',document.title],['meta[property="og:description"]',t('contactDescription')],['meta[property="og:locale"]',locale==='ar'?'ar_EG':'en_US']]){const el=document.querySelector(selector);if(el)el.content=value;}
 const canonical=document.querySelector('link[rel=canonical]');if(canonical){const origin=new URL(canonical.href).origin;canonical.href=origin+'/'+locale+'/contact.html';const og=document.querySelector('meta[property="og:url"]');if(og)og.content=canonical.href;}
}
async function changeLanguage(next,{history=true}={}){
 if(sending)return;if(next===locale){if(pendingStyle){languageRequest++;pendingStyle.remove();pendingStyle=null;}return;}
 const id=++languageRequest;pendingStyle?.remove();
 const candidate=document.createElement('link');candidate.rel='stylesheet';candidate.media='not all';candidate.href=root+'assets/vendor/bootstrap'+(next==='ar'?'.rtl':'')+'.min.css';pendingStyle=candidate;
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('stylesheet timeout')),5000);candidate.onload=()=>{clearTimeout(timer);resolve();};candidate.onerror=()=>{clearTimeout(timer);reject(new Error('stylesheet unavailable'));};document.head.append(candidate);});
  if(id!==languageRequest||sending){candidate.remove();if(id===languageRequest)pendingStyle=null;return;}
  const values=formValues(),previousState=formState;
  closeMenu();motionObserver?.disconnect();document.getElementById('bootstrap-css').remove();candidate.id='bootstrap-css';candidate.media='all';pendingStyle=null;
  locale=next;document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  app.innerHTML=window.MTViews.pageHTML({lang:locale,page,root,hash:location.hash,service:values.service});
  const f=document.querySelector('#inquiry-form');for(const [key,value]of Object.entries(values))if(f.elements[key])f.elements[key].value=value;f.elements.language.value=locale;
  if(history){const search=services.some(s=>s.id===values.service)?'?service='+encodeURIComponent(values.service):'';window.history.pushState({language:locale},'',root+locale+'/contact.html'+search+location.hash);}
  bindForm();renderAvailability();syncLanguageLink();status(previousState);updateMetadata();initializeControls();document.querySelector(`[data-language="${locale}"]`)?.focus({preventScroll:true});
 }catch{candidate.remove();if(id!==languageRequest)return;pendingStyle=null;const el=document.querySelector('#form-status');el.textContent=t('languageFailed');el.dataset.state='error';el.focus();}
}
function setMenuState(){
 const nav=document.getElementById('site-nav'),toggle=nav?.querySelector('.navbar-toggler');if(!nav||!toggle)return;
 const open=nav.open&&!desktop.matches;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',t(open?'close':'menu'));
 document.body.classList.toggle('menu-open',open);
 document.querySelector('#main').inert=open;document.querySelector('.site-footer').inert=open;
}
function closeMenu(focus=false){const nav=document.getElementById('site-nav');if(!nav||desktop.matches)return;nav.open=false;setMenuState();if(focus)nav.querySelector('.navbar-toggler').focus();}
function bindNavigation(){
 navFocusElement=null;const nav=document.getElementById('site-nav');nav.open=desktop.matches;
 nav.querySelector('.nav-paths').open=!desktop.matches;nav.addEventListener('toggle',setMenuState);document.documentElement.classList.add('nav-ready');setMenuState();
}
function restoreAnchor(){if(page!=='services'||!location.hash)return;let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});}
function enhanceMotion(){
 motionObserver?.disconnect();if(media.matches||!('IntersectionObserver'in window))return;
 try{motionObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const el=entry.target;el.animate?.([{opacity:.65,transform:'translateY(.65rem)'},{opacity:1,transform:'none'}],{duration:420,delay:Math.min(Number(el.dataset.stagger||0)*35,105),easing:'cubic-bezier(.22,1,.36,1)'});motionObserver.unobserve(el);}},{threshold:.08});document.querySelectorAll('.section-heading,.service-detail,.expanded-step,.contact-card,.process-grid li').forEach((el,i)=>{el.dataset.stagger=i%3;motionObserver.observe(el);});}catch{}
}
function initializeControls(){
 bindNavigation();document.querySelectorAll('.copy-email').forEach(el=>el.hidden=false);restoreAnchor();
 enhanceMotion();
}
app.addEventListener('click',async ev=>{
 const language=ev.target.closest('[data-language]');if(language&&!ev.ctrlKey&&!ev.metaKey&&!ev.shiftKey&&!ev.altKey&&ev.button===0){if(page==='contact'){ev.preventDefault();await changeLanguage(language.dataset.language);}else syncLanguageLink();return;}
 const copyButton=ev.target.closest('.copy-email');if(copyButton){const el=document.querySelector('.copy-status');try{await navigator.clipboard.writeText(company.email);el.textContent=t('copied');}catch{el.textContent=t('copyFailed');}}
 const link=ev.target.closest('a');if(link){
  const target=new URL(link.href,location.href);
  if(page==='contact'&&target.origin===location.origin&&target.pathname===location.pathname&&link.dataset.language===undefined){ev.preventDefault();closeMenu();const service=target.searchParams.get('service');if(services.some(s=>s.id===service)&&!sending)document.getElementById('service').value=service;if(available){document.getElementById('name').focus();document.getElementById('inquiry-form').scrollIntoView();}else{document.querySelector('#contact-direct-primary a').focus();document.getElementById('contact-direct-primary').scrollIntoView();}syncLanguageLink();return;}
  if(link.closest('#site-nav'))closeMenu();
  if(link.classList.contains('skip-link')){ev.preventDefault();document.getElementById('main').focus();document.getElementById('main').scrollIntoView();}
 }
});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'&&!desktop.matches&&document.getElementById('site-nav').open){closeMenu(true);return;}if(ev.key==='Escape'){const path=document.querySelector('.nav-paths[open]');if(path){path.open=false;path.querySelector('summary').focus();}else closeMenu(true);}
 const nav=document.getElementById('site-nav');if(ev.key==='Tab'&&!desktop.matches&&nav.open){const items=[nav.querySelector('.navbar-toggler'),...[...nav.querySelectorAll('a,summary')].filter(el=>el!==nav.querySelector('.navbar-toggler')&&el.getClientRects().length)];const first=items[0],last=items.at(-1);if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus();}}

});
document.addEventListener('click',ev=>{if(!ev.target.closest('.nav-paths'))document.querySelectorAll('.nav-paths').forEach(el=>el.open=false);});
document.addEventListener('focusin',ev=>{navFocusElement=ev.target.closest('.site-header')?ev.target:null;});
desktop.addEventListener('change',()=>{const focus=navFocusElement;document.getElementById('site-nav').open=desktop.matches;document.querySelector('.nav-paths').open=!desktop.matches;setMenuState();if(!desktop.matches&&focus?.closest('.nav-panel'))document.querySelector('.navbar-toggler').focus();else if(desktop.matches&&focus?.matches('.navbar-toggler'))document.querySelector('.navbar-brand').focus();else if(desktop.matches&&focus?.closest('.nav-paths-menu'))document.querySelector('.nav-paths>summary').focus();});
window.addEventListener('scroll',()=>document.querySelector('.site-header')?.classList.toggle('is-scrolled',scrollY>12),{passive:true});
media.addEventListener('change',()=>{if(media.matches){motionObserver?.disconnect();document.getAnimations().forEach(a=>a.cancel());}else enhanceMotion();});
window.addEventListener('hashchange',()=>{syncLanguageLink();restoreAnchor();});
window.addEventListener('popstate',()=>{if(page==='contact'){const next=location.pathname.includes('/ar/')?'ar':'en';changeLanguage(next,{history:false});}});
window.addEventListener('pagehide',()=>{activeController?.abort();const f=document.getElementById('inquiry-form');if(f){sending=false;clearForm(f);status('idle');}});
if(page==='contact'){const selected=new URLSearchParams(location.search).get('service');if(services.some(s=>s.id===selected))document.getElementById('service').value=selected;bindForm();checkContact();}
syncLanguageLink();initializeControls();
})();
