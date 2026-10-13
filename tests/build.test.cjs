'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');const {spawnSync}=require('node:child_process');const {createServer}=require('../server/index.cjs');
test('isolated production build: canonical/hreflang, sitemap, Organization JSON-LD and matching CSP; domain mismatch fails',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mtss-build-')),output=path.join(dir,'public');const site='https://mtss.example.invalid';
 try{
  const result=spawnSync(process.execPath,['scripts/build.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,SITE_URL:site,BUILD_OUTPUT:output},encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const home=fs.readFileSync(path.join(output,'en/index.html'),'utf8');const contact=fs.readFileSync(path.join(output,'ar/contact.html'),'utf8');assert(home.includes(`rel="canonical" href="${site}/en/index.html"`));assert(contact.includes(`hreflang="en" href="${site}/en/contact.html"`));assert(contact.includes(`hreflang="ar" href="${site}/ar/contact.html"`));
  assert(fs.readFileSync(path.join(output,'robots.txt'),'utf8').includes('Allow: /'));const sitemap=fs.readFileSync(path.join(output,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,28);assert(!sitemap.includes('404'));
  for(const lang of ['ar','en'])for(const service of ['custom','web','mobile-app','backend-api','integration','consulting','support','cloud']){
   const file=`${lang}/service-${service}.html`,html=fs.readFileSync(path.join(output,file),'utf8');assert(html.includes(`rel="canonical" href="${site}/${file}"`));assert(html.includes(`hreflang="${lang==='ar'?'en':'ar'}" href="${site}/${lang==='ar'?'en':'ar'}/service-${service}.html"`));assert(html.includes(`property="og:url" content="${site}/${file}"`));assert(sitemap.includes(`${site}/${file}`));assert(!html.includes('<title>undefined'));
  }
  assert(!/work\.html|case-request-workflow|request-demo/.test(sitemap));

  const structured=home.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)[1];const data=JSON.parse(structured);assert.equal(data.email,'mtsscorporate@gmail.com');assert.equal(data.url,site);assert.equal(data.telephone,'+201032105166');assert.deepEqual(data.sameAs,['https://www.facebook.com/mtss0/','https://www.linkedin.com/company/mtss0']);assert.deepEqual(data.address,{'@type':'PostalAddress',addressLocality:'Giza',addressCountry:'EG'});assert(!data.foundingDate,'Do not invent a day for the owner-confirmed founding month');assert(!data.openingHours&&!data.geo);
  const hash="'sha256-"+crypto.createHash('sha256').update(structured).digest('base64')+"'";assert(JSON.parse(fs.readFileSync(path.join(output,'csp-hashes.json'),'utf8')).includes(hash));
  const limiter={consume:async()=>({allowed:true}),close(){}};const server=createServer({root:output,production:true,siteUrl:site,limiter,config:{}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  try{const response=await fetch('http://127.0.0.1:'+server.address().port+'/en/index.html');assert(response.headers.get('content-security-policy').includes(hash));assert(response.headers.get('strict-transport-security').includes('31536000'));assert.equal(response.headers.get('x-content-type-options'),'nosniff');
   for(const route of ['/missing/nested/page.html','/ar/missing/nested/page.html']){const missing=await fetch('http://127.0.0.1:'+server.address().port+route);assert.equal(missing.status,404);const html=await missing.text();assert(html.includes(route.startsWith('/ar/')?'lang="ar"':'lang="en"'));for(const match of html.matchAll(/src="([^"]+)"/g)){const asset=await fetch(new URL(match[1],missing.url));assert.equal(asset.status,200,'Deep 404 asset: '+match[1]);assert(!asset.headers.get('content-type').includes('text/html'));}}
}finally{await new Promise(r=>server.close(r));}
  assert.throws(()=>createServer({root:output,production:true,siteUrl:'https://different.example.invalid',limiter,config:{}}),/Rebuild/);
  assert(!fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8').includes('mtss.example.invalid'),'Fixture domain leaked into source');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
