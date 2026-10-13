'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),{routes}=require('../scripts/routes.cjs');
test('corporate output excludes all work samples, showcase data, assets and routes',()=>{
 const data=global.MTContent;
 assert(!data.projects&&!data.demo);assert.equal(data.copy.nav.length,5);
 for(const service of data.services)assert(!('evidence' in service));
 const forbidden=/request-demo|case-request-workflow|demo-shot|evidence-summary|Internal demonstration|نموذج داخلي|Implementation examples|أمثلة التنفيذ/;
 for(const {file} of routes){const html=fs.readFileSync(path.join(root,'dist',file),'utf8');assert(!forbidden.test(html),file);}
 for(const file of ['js/content.js','js/views.js','js/app.js','css/styles.css'])assert(!forbidden.test(fs.readFileSync(path.join(root,'dist',file),'utf8')),file);
 for(const lang of ['en','ar'])for(const page of ['work','case-request-workflow','request-demo'])for(const directory of ['dist',''])assert(!fs.existsSync(path.join(root,directory,lang,page+'.html')));
 for(const file of ['js/demo.js','js/demo-rules.js','assets/images/request-demo-en.png','assets/images/request-demo-ar.png'])for(const directory of ['dist',''])assert(!fs.existsSync(path.join(root,directory,file)));
});
test('homepage preserves company facts, all services, audiences and a concise visible process',()=>{
 for(const lang of ['ar','en']){
  const html=fs.readFileSync(path.join(root,'dist',lang,'index.html'),'utf8');
  for(const service of global.MTContent.services)assert(html.includes(`service-${service.id}.html`));
  for(const audience of global.MTContent.audiences)assert(html.includes(global.MTContent.pick(audience.title,lang).replaceAll('&','&amp;')));
  assert(html.includes('datetime="2024-12"'));assert(html.includes('about.html#audiences'));
  assert(html.includes('class="hero corporate-hero"'));assert(!html.includes('class="starting-paths"'),'Starting paths belong on Services instead of repeated Home content');
 }
});
