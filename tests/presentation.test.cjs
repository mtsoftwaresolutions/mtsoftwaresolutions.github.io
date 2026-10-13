'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,'dist',file),'utf8');
const ids=['custom','web','mobile-app','backend-api','integration','consulting','support','cloud'];
test('company discovery has eight canonical service destinations and no concealed process or promotion',()=>{
 for(const lang of ['en','ar']){
  const home=read(lang+'/index.html');assert.equal((home.match(/class="service-index-link"/g)||[]).length,8);
  for(const id of ids)assert(home.includes(`service-${id}.html`));
  const workflow=home.match(/<ol class="process-grid">([\s\S]*?)<\/ol>/)[1];assert.equal((workflow.match(/<li>/g)||[]).length,4);assert(!/<li\b[^>]*\shidden(?:[ >]|=)/.test(workflow));
  assert(home.includes(`service-mobile-app.html`));assert(!/(feature-|service-card|catalog-controls|project-float|project-dialog|topics-toggle|process-carousel)/.test(home));
  const services=read(lang+'/services.html');assert.equal((services.match(/class="service-detail(?: [^"]*)?"/g)||[]).length,8);assert(!services.includes('data-filter'));
  for(const id of ids){assert.equal((services.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);assert(services.includes(`contact.html?service=${id}`));}
  for(const group of ['business','mobile','connected','operations'])assert(services.includes(`id="${group}"`));
  const about=read(lang+'/about.html');assert.equal((about.match(/class="principle-list"/g)||[]).length,1);assert(about.includes('class="industry-list"'));
  const contact=read(lang+'/contact.html');assert(contact.indexOf('id="contact-availability"')<contact.indexOf('id="name"'));assert(contact.includes('aria-describedby="contact-availability"'));
 }
});
test('a fresh build cannot regenerate or deploy retired package and repetitive illustration assets',()=>{
 assert(!fs.readdirSync(path.join(root,'dist/assets/images')).some(n=>/^(feature-|solution-)/.test(n)));
 const generator=fs.readFileSync(path.join(root,'scripts/brand-assets.cjs'),'utf8');assert(!generator.includes('box-shadow'));assert(!generator.includes('function scene('));assert(!generator.includes('feature-'));
});
