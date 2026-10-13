'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const {randomBytes}=require('node:crypto');
const {createContact,configured}=require('./contact.cjs');
require('../js/content.js');
const contactText=global.MTContent;
const {sqliteLimiter,redisLimiter}=require('./rate-limit.cjs');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json'};
const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
function securityHeaders(res,{production=false,hashes=[]}={}){res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');const policy=csp.replace("script-src 'self'","script-src 'self' "+hashes.join(' '));res.setHeader('Content-Security-Policy',production?policy:policy.replace('; upgrade-insecure-requests',''));if(production)res.setHeader('Strict-Transport-Security','max-age=31536000');}
function createServer({root=path.resolve(__dirname,'../dist'),production=false,siteUrl='',config={},limiter,fetchImpl,trustProxy=false,log=console.warn}={}){
 limiter ||= sqliteLimiter(path.resolve(__dirname,'../.runtime/rate.sqlite'));
 const contact=createContact({config,limiter,fetchImpl,log});
 if(production){const meta=path.join(root,'.build-meta.json');if(!fs.existsSync(meta)||JSON.parse(fs.readFileSync(meta,'utf8')).origin!==new URL(siteUrl).origin)throw Error('Rebuild with the same SITE_URL before production startup.');}
 const hashFile=path.join(root,'csp-hashes.json');const hashes=fs.existsSync(hashFile)?JSON.parse(fs.readFileSync(hashFile,'utf8')):[];
 const server=http.createServer(async(req,res)=>{
  securityHeaders(res,{production,hashes});
  let url;try{url=new URL(req.url,'http://localhost');}catch{res.writeHead(400);res.end();return;}
  function json(code,body,headers={}){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body));}
  if(url.pathname.startsWith('/api/')){
   if(url.pathname==='/api/contact/status'){if(!['GET','HEAD'].includes(req.method)){json(405,{code:'method'},{Allow:'GET, HEAD'});return;}json(200,{configured:configured(config)});return;}
   if(url.pathname!=='/api/contact'){json(404,{code:'not_found'});return;}
   if(req.method!=='POST'){json(405,{code:'method'},{Allow:'POST'});return;}
   const allowed=siteUrl?new URL(siteUrl).origin:`http://127.0.0.1:${server.address().port}`;
   if(req.headers.origin!==allowed){json(403,{code:'origin'});return;}
   const contentType=(req.headers['content-type']||'').split(';')[0];
   if(!['application/json','application/x-www-form-urlencoded'].includes(contentType)){json(415,{code:'content_type'});return;}
   if(req.headers['content-encoding']&&req.headers['content-encoding']!=='identity'){json(415,{code:'content_encoding'});return;}
   const length=Number(req.headers['content-length']);if(Number.isFinite(length)&&length>32768){req.resume();json(413,{code:'too_large'});return;}
   let chunks=[],size=0;
   try{for await(const chunk of req){size+=chunk.length;if(size>32768){json(413,{code:'too_large'});return;}chunks.push(chunk);}}catch{if(!res.headersSent)json(400,{code:'request'});return;}
   const body=Buffer.concat(chunks).toString('utf8');
   let input;try{input=contentType==='application/json'?JSON.parse(body):Object.fromEntries(new URLSearchParams(body));if(!input||typeof input!=='object'||Array.isArray(input))throw Error();}catch{json(400,{code:'json'});return;}
   const ip=trustProxy?(String(req.headers['x-forwarded-for']||'').split(',').at(-1).trim()||req.socket.remoteAddress):req.socket.remoteAddress;
   const result=await contact(input,{ip,idempotencyKey:req.headers['idempotency-key']});
   if(contentType==='application/json'){json(result.status,result.body,result.headers);return;}
   const ar=input.language==='ar';const success=result.body.accepted===true;const title=ar?(success?'تم قبول استفسارك':'تعذر إرسال الاستفسار'):(success?'Your inquiry was accepted':'Your inquiry could not be sent');const text=ar?(success?'شكرًا لمشاركتنا تفاصيل مشروعك.':'عد إلى النموذج للمحاولة مجددًا أو راسلنا مباشرة. لم يتم تأكيد قبول استفسارك.'):(success?'Thank you for sharing your project with us.':'Return to the form to try again, or email us directly. Acceptance has not been confirmed.');
   res.writeHead(result.status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store',...result.headers});res.end(`<!doctype html><html lang="${ar?'ar':'en'}" dir="${ar?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | MT Software Solutions</title><link rel="stylesheet" href="/assets/vendor/bootstrap${ar?'.rtl':''}.min.css"><link rel="stylesheet" href="/css/styles.css"></head><body><main class="server-result"><h1>${title}</h1><p>${text}</p><p><a href="/${ar?'ar':'en'}/contact.html">${ar?'العودة إلى التواصل':'Return to Contact'}</a></p><a href="mailto:mtsscorporate@gmail.com">mtsscorporate@gmail.com</a></main></body></html>`);return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
  const relative=decoded.replace(/^\/+/, '');
  const publicPath=!relative||/^(index\.html|404\.html|robots\.txt|sitemap\.xml|site\.webmanifest|(?:en|ar|css|js|assets)\/)/.test(relative);
  if(decoded.includes('\0')||decoded.includes('\\')||decoded.split('/').some(p=>p.startsWith('.')||p==='..')){res.writeHead(404);res.end();return;}
  let file=publicPath?path.resolve(root,relative||'index.html'):path.join(root,'404.html');if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(404);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){
   if(!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
   file=path.join(file,'index.html');
  }
  let code=publicPath?200:404;
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()||!types[path.extname(file)]){code=404;file=path.join(root,decoded.startsWith('/ar/')?'ar/404.html':'404.html');}
  if(!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
  const type=types[path.extname(file)]||'text/html; charset=utf-8';
  let payload=fs.readFileSync(file);
  // Contact's native fallback must reflect actual provider configuration even without JS.
  if(file.endsWith('/contact.html')){
   const ready=configured(config);let html=payload.toString('utf8');
   html=html.replace('<body ',`<body data-contact-configured="${ready}" `);
   if(ready){
    html=html.replace('<details id="inquiry-panel" class="inquiry-panel">','<details id="inquiry-panel" class="inquiry-panel" open>').replace('<fieldset id="inquiry-fields" disabled>','<fieldset id="inquiry-fields">').replace('class="contact-card"','class="contact-card" data-availability="ready"');
    const direct=html.match(/<div class="direct-actions" id="contact-direct-primary">[\s\S]*?<\/div><\/div>/)?.[0];
    if(direct)html=html.replace(direct,'').replace('<div class="after-inquiry">',direct+'<div class="after-inquiry">');
   }
   const locale=file.includes('/ar/')?'ar':'en';
   html=html.replace(/(<p id="contact-availability"[^>]*>)[^<]*(<\/p>)/,(_,start,end)=>start+contactText.pick(contactText.copy[ready?'contactReady':'contactOffline'],locale)+end);
   payload=Buffer.from(html);
  }const etag='"'+require('node:crypto').createHash('sha256').update(payload).digest('hex').slice(0,24)+'"';
  const cache=code===404?'no-store':file.endsWith('.html')?'no-cache':'public, max-age=3600, must-revalidate';
  res.setHeader('Content-Type',type);res.setHeader('Cache-Control',cache);res.setHeader('ETag',etag);
  if(code===200&&req.headers['if-none-match']===etag){res.writeHead(304);res.end();return;}
  if(/^(text\/|application\/(javascript|xml))/.test(type)){res.setHeader('Vary','Accept-Encoding');if(/\bgzip\b/.test(req.headers['accept-encoding']||'')){const compressed=zlib.gzipSync(payload);res.setHeader('Content-Encoding','gzip');res.setHeader('Content-Length',compressed.length);res.writeHead(code);res.end(req.method==='HEAD'?undefined:compressed);return;}}
  res.setHeader('Content-Length',payload.length);res.writeHead(code);res.end(req.method==='HEAD'?undefined:payload);
 });
 server.requestTimeout=20000;server.headersTimeout=10000;
 server.on('close',()=>limiter.close?.());return server;
}
if(require.main===module){
 const dev=process.argv.includes('--dev');const production=process.env.NODE_ENV==='production';
 const siteUrl=process.env.SITE_URL||'';const port=Number(process.env.PORT||4318);
 const salt=process.env.RATE_LIMIT_SALT||randomBytes(32).toString('hex');
 if(production&&(!siteUrl||new URL(siteUrl).protocol!=='https:'||salt.length<32||!process.env.RATE_LIMIT_SALT))throw Error('Production requires HTTPS SITE_URL and RATE_LIMIT_SALT (32+ characters).');
 if(process.env.UPSTASH_REDIS_REST_URL&&!process.env.UPSTASH_REDIS_REST_TOKEN)throw Error('Redis REST token is required.');
 if(production&&!process.env.UPSTASH_REDIS_REST_URL&&process.env.DEPLOYMENT_MODE!=='single-instance')throw Error('Set distributed Redis rate limiting, or explicitly choose single-instance deployment with persistent SQLite storage.');
 const limiter=process.env.UPSTASH_REDIS_REST_URL?redisLimiter({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN,salt}):sqliteLimiter(process.env.RATE_LIMIT_DB||path.resolve(__dirname,'../.runtime/rate.sqlite'),salt);
 const config={apiKey:process.env.RESEND_API_KEY,from:process.env.CONTACT_FROM};
 const server=createServer({root:path.resolve(__dirname,'../dist'),production,siteUrl,config,limiter,trustProxy:process.env.TRUST_PROXY==='1'});
 // In dev, serve only public directories, never the full checkout.
 if(dev){console.log('Development preview serves dist/. Run npm run build after source edits.');}
 server.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port} — contact ${configured(config)?'configured':'unavailable (email fallback active)'}`));
 for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>server.close(()=>process.exit(0)));
}
module.exports={createServer,securityHeaders};
