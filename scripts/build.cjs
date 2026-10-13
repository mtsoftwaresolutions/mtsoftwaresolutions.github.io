'use strict';
const fs=require('node:fs'),path=require('node:path');
const esbuild=require('esbuild');
const root=path.resolve(__dirname,'..');
require('./brand-assets.cjs');
const assetHash=file=>require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
const brandVersion=assetHash('assets/images/logo-symbol.svg');
const imageVersions=Object.fromEntries(fs.readdirSync(path.join(root,'assets/images')).filter(name=>/^(logo-(symbol|full))/.test(name)).map(name=>[name,assetHash('assets/images/'+name)]));
require('../js/content.js');require('../js/contact-rules.js');global.MTContactRules=require('../js/contact-rules.js');require('../js/views.js');
const {company,copy,pick}=global.MTContent,{e}=global.MTViews;
const {pages,routes,fileName}=require('./routes.cjs');
const site=process.env.SITE_URL||'';
if(site&&(new URL(site).protocol!=='https:'||new URL(site).pathname!=='/'))throw Error('SITE_URL must be an HTTPS origin without a path.');
const origin=site?new URL(site).origin:'';
const title=(lang,page)=>{
 const p=pair=>pick(pair,lang);
 const service=global.MTContent.services.find(s=>'service-'+s.id===page);
 const name=service?p(service.title):page==='home'?p(copy.heroTitle):page==='privacy'?p(copy.privacy):page==='404'?'404':p(copy.nav[{services:1,process:2,about:3,contact:4}[page]]);
 return name+' | '+company.name;
};
const descriptions={home:'heroDescription',services:'servicePageDescription',process:'processDescription',about:'aboutDescription',contact:'contactDescription',privacy:'privacyIntro','404':'notFoundDescription'};
const description=(lang,page)=>{const service=global.MTContent.services.find(s=>'service-'+s.id===page);return pick(service?service.what:copy[descriptions[page]],lang);};
const customOutput=process.env.BUILD_OUTPUT||'';
function documentHTML(r){
 const p=r.page==='404'?'/':r.prefix,asset=name=>`${p}assets/images/${name}?v=${assetHash('assets/images/'+name)}`,resource=file=>`${p}${file}?v=${assetHash(file)}`,desc=description(r.lang,r.page),docTitle=title(r.lang,r.page),url=origin+'/'+(r.file==='index.html'?'en/index.html':r.file);
 const canonical=origin?`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"><link rel="alternate" hreflang="en" href="${origin}/en/${fileName(r.page)}.html"><link rel="alternate" hreflang="ar" href="${origin}/ar/${fileName(r.page)}.html"><link rel="alternate" hreflang="x-default" href="${origin}/en/${fileName(r.page)}.html">`:'';
 // JSON-LD is embedded with a CSP hash calculated by the server/header generator below.
 const structured=origin&&r.page==='home'?`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:company.name,url:origin,email:company.email,telephone:company.phone,sameAs:Object.values(company.social),address:{'@type':'PostalAddress',addressLocality:company.location.city,addressCountry:company.location.country},logo:origin+'/assets/images/logo-full.svg'})}</script>`:'';
 return `<!doctype html>\n<html lang="${r.lang}" dir="${r.lang==='ar'?'rtl':'ltr'}"><head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#1a3a2e"><meta name="description" content="${e(desc)}"><title>${e(docTitle)}</title>\n${r.page==='404'?'<meta name="robots" content="noindex">':''}${canonical}\n<meta property="og:type" content="website"><meta property="og:site_name" content="${company.name}"><meta property="og:title" content="${e(docTitle)}"><meta property="og:description" content="${e(desc)}"><meta property="og:locale" content="${r.lang==='ar'?'ar_EG':'en_US'}"><meta name="twitter:card" content="summary">${origin?`<meta property="og:image" content="${origin}/assets/images/official-logo.jpg">`:''}\n<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="${asset('favicon.ico')}"><link rel="icon" type="image/png" sizes="32x32" href="${asset('favicon-32.png')}"><link rel="icon" type="image/png" sizes="16x16" href="${asset('favicon-16.png')}"><link rel="icon" type="image/svg+xml" sizes="any" href="${asset('favicon.svg')}"><link rel="apple-touch-icon" sizes="180x180" href="${asset('apple-touch-icon.png')}"><link rel="manifest" href="${p}site.webmanifest">\n<link id="bootstrap-css" rel="stylesheet" href="${p}assets/vendor/bootstrap${r.lang==='ar'?'.rtl':''}.min.css"><link rel="stylesheet" href="${resource('css/styles.css')}">\n${structured}\n<script src="${p}assets/vendor/bootstrap.bundle.min.js" defer></script><script src="${resource('js/content.js')}" defer></script><script src="${resource('js/contact-rules.js')}" defer></script><script src="${resource('js/views.js')}" defer></script><script src="${resource('js/app.js')}" defer></script>\n</head><body data-brand-version="${brandVersion}" data-page="${r.page}" data-root="${p.slice(0,-1)}"><div id="app">${global.MTViews.pageHTML({lang:r.lang,page:r.page,root:p,brandVersion,assetVersions:imageVersions})}</div></body></html>\n`;
}
async function build(){
 fs.mkdirSync(path.join(root,'assets/vendor'),{recursive:true});
 for(const [source,target]of [['dist/css/bootstrap.min.css','bootstrap.min.css'],['dist/css/bootstrap.rtl.min.css','bootstrap.rtl.min.css'],['dist/js/bootstrap.bundle.min.js','bootstrap.bundle.min.js'],['LICENSE','BOOTSTRAP-LICENSE']])fs.copyFileSync(path.join(root,'node_modules/bootstrap',source),path.join(root,'assets/vendor',target));
 if(!customOutput)for(const lang of ['en','ar'])for(const name of ['work','case-request-workflow','request-demo'])fs.rmSync(path.join(root,lang,name+'.html'),{force:true});
 if(!customOutput)for(const r of routes){fs.mkdirSync(path.dirname(path.join(root,r.file)),{recursive:true});fs.writeFileSync(path.join(root,r.file),documentHTML(r));}
 const dist=customOutput?path.resolve(customOutput):path.join(root,'dist');
 if(dist===root||root.startsWith(dist+path.sep))throw Error('Build output cannot replace the source directory or its ancestors.');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist);
 for(const dir of ['css','js','assets/images','assets/vendor'])fs.mkdirSync(path.join(dist,dir),{recursive:true});
 for(const file of ['styles.css'])fs.copyFileSync(path.join(root,'css',file),path.join(dist,'css',file));
 for(const file of ['app.js','views.js','content.js','contact-rules.js'])fs.copyFileSync(path.join(root,'js',file),path.join(dist,'js',file));
 for(const file of ['bootstrap.min.css','bootstrap.rtl.min.css','bootstrap.bundle.min.js','BOOTSTRAP-LICENSE','BOOTSTRAP-ICONS-LICENSE'])fs.copyFileSync(path.join(root,'assets/vendor',file),path.join(dist,'assets/vendor',file));
 for(const file of fs.readdirSync(path.join(root,'assets/images')).filter(n=>/^(?:logo-(?:full|symbol)\.svg|official-logo\.jpg|favicon(?:-\d+)?\.(?:png|svg|ico)|apple-touch-icon\.png)$/.test(n)))fs.copyFileSync(path.join(root,'assets/images',file),path.join(dist,'assets/images',file));
 for(const r of routes){fs.mkdirSync(path.dirname(path.join(dist,r.file)),{recursive:true});fs.writeFileSync(path.join(dist,r.file),documentHTML(r));}
 // Exclude superseded logo attempts and fonts from the deployment.
 for(const file of fs.readdirSync(path.join(dist,'assets/images')).filter(name=>/^(?:feature-|solution-|logo-web)/.test(name)))fs.rmSync(path.join(dist,'assets/images',file),{force:true});fs.rmSync(path.join(dist,'assets/fonts'),{recursive:true,force:true});
 for(const file of ['app.js','views.js','content.js','contact-rules.js']){const src=path.join(root,'js',file);const out=path.join(dist,'js',file);const result=await esbuild.transform(fs.readFileSync(src,'utf8'),{minify:true,target:'es2020',legalComments:'none'});fs.writeFileSync(out,result.code);}
 const css=await esbuild.transform(fs.readFileSync(path.join(root,'css/styles.css'),'utf8'),{loader:'css',minify:true});fs.writeFileSync(path.join(dist,'css/styles.css'),css.code);
 const robots=origin?`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n# Configure SITE_URL and rebuild before production indexing.\n';
 if(!customOutput)fs.writeFileSync(path.join(root,'robots.txt'),robots);fs.writeFileSync(path.join(dist,'robots.txt'),robots);
 const sitemap=origin?`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>r.page!=='404'&&r.file.includes('/')).map(r=>`<url><loc>${origin}/${r.file}</loc></url>`).join('')}</urlset>`:'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
 if(!customOutput)fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);fs.writeFileSync(path.join(dist,'sitemap.xml'),sitemap);
 const manifest=JSON.stringify({name:company.name,short_name:'MT Solutions',start_url:'./',display:'browser',theme_color:'#1a3a2e',background_color:'#ffffff',icons:[{src:`assets/images/favicon.svg?v=${assetHash('assets/images/favicon.svg')}`,sizes:'any',type:'image/svg+xml',purpose:'any'},...[192,512].map(size=>({src:`assets/images/favicon-${size}.png?v=${assetHash('assets/images/favicon-'+size+'.png')}`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))]});if(!customOutput)fs.writeFileSync(path.join(root,'site.webmanifest'),manifest);fs.writeFileSync(path.join(dist,'site.webmanifest'),manifest);
 const hashes=routes.filter(r=>r.page==='home'&&origin).map(r=>{const code=documentHTML(r).match(/<script type="application\/ld\+json">([^<]*)<\/script>/)?.[1];return code?"'sha256-"+require('node:crypto').createHash('sha256').update(code).digest('base64')+"'":'';});
 fs.writeFileSync(path.join(dist,'.build-meta.json'),JSON.stringify({origin}));
 fs.writeFileSync(path.join(dist,'csp-hashes.json'),JSON.stringify([...new Set(hashes)]));
 const headers=`/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' ${[...new Set(hashes)].join(' ')}; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests\n`;
 fs.writeFileSync(path.join(dist,'_headers'),headers);
 console.log(`Built ${routes.length} bilingual pages into ${customOutput?'the isolated output':'dist/'}. Bootstrap 5.3.8; system typography; minified assets. ${origin?'Production domain metadata included.':'SITE_URL absent: production indexing disabled.'}`);
}
build().catch(e=>{console.error(e.message);process.exitCode=1;});
