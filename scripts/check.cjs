'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../dist');
const routes=require('./routes.cjs').routes.map(r=>r.file);
const ids=new Map(routes.map(file=>[path.join(root,file),new Set([...fs.readFileSync(path.join(root,file),'utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));let links=0,assets=0;
for(const route of routes){
 const file=path.join(root,route),html=fs.readFileSync(file,'utf8');const lang=route.startsWith('ar/')?'ar':'en';
 assert(html.includes(`lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"`));assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
 const allIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(allIds).size,allIds.length,route+' duplicate IDs');
 assert.equal((html.match(/src="[^"]*bootstrap.bundle.min.js"/g)||[]).length,1);
 assert.equal((html.match(/rel="stylesheet" href="[^"]*bootstrap[^\"]*"/g)||[]).length,1);
 assert(html.includes(`bootstrap${lang==='ar'?'.rtl':''}.min.css`));assert.equal((html.match(/logo-symbol\.svg\?v=/g)||[]).length,2);assert(html.replace(/<[^>]*>/g,'').length>500);
 for(const m of html.matchAll(/\b(href|src)="([^"]+)"/g)){
  const ref=m[2].replace(/&amp;/g,'&');if(/^mailto:/.test(ref)){assert.equal(ref,'mailto:mtsscorporate@gmail.com');continue;}if(/^tel:/.test(ref)){assert.equal(ref,'tel:+201032105166');continue;}if(/^https:/.test(ref))continue;
  const url=new URL(ref,'https://local.example/'+route);if(url.pathname==='/api/contact')continue;
  const target=path.join(root,decodeURIComponent(url.pathname));assert(fs.existsSync(target),route+': '+ref);
  if(url.hash)assert(ids.get(target)?.has(decodeURIComponent(url.hash.slice(1))),route+': '+ref);
  m[1]==='href'?links++:assets++;
 }
 if(route.includes('contact')){assert(html.includes('<form id="inquiry-form"'));assert(html.includes('method="post"'));assert(!html.includes('Prepare Email'));}
}
const original=fs.readFileSync(path.resolve(__dirname,'../assets/images/official-logo.jpg'));assert.equal(crypto.createHash('sha256').update(original).digest('hex'),'edf0b4361fd6438ebef5f977442f63640f44353db6bfbd94609c94edbf560921');
for(const name of ['logo-full.svg']){const svg=fs.readFileSync(path.join(root,'assets/images',name),'utf8');const encoded=svg.match(/data:image\/jpeg;base64,([^"\s]+)/)[1];assert.equal(crypto.createHash('sha256').update(Buffer.from(encoded,'base64')).digest('hex'),'edf0b4361fd6438ebef5f977442f63640f44353db6bfbd94609c94edbf560921');assert(svg.includes('<image'));assert(svg.includes('viewBox='));}
const symbol=fs.readFileSync(path.join(root,'assets/images/logo-symbol.svg'),'utf8');assert(!symbol.includes('<image'));assert(symbol.includes('C710 296'));assert(!fs.existsSync(path.join(root,'assets/images/logo-web.svg')));assert(fs.readFileSync(path.join(root,'assets/images/favicon.svg'),'utf8').includes('d="M')); 
for(const forbidden of ['.env','node_modules','docs','server','scripts','screenshots','package.json','.private','business-operations','.runtime'])assert(!fs.existsSync(path.join(root,forbidden)),'Public build contains '+forbidden);
const css=fs.readFileSync(path.join(root,'css/styles.css'),'utf8');assert(css.includes('prefers-reduced-motion'));assert(!css.includes('logo-frame'));assert(!css.includes('top:-43px'));
console.log(`PASS: ${routes.length} generated pages, ${links} links/anchors, ${assets} asset references, local Bootstrap/RTL, semantic forms, original full-artwork hash, clean compact symbol/lockup and versioned favicon assets, and deployment allowlist.`);
