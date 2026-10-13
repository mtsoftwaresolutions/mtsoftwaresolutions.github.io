'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../dist'),images=path.join(root,'assets/images');
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(images,file))).digest('hex').slice(0,12);
function png(buffer,size){assert.equal(buffer.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(buffer.readUInt32BE(16),size);assert.equal(buffer.readUInt32BE(20),size);}
test('favicon pack contains valid native-sized PNG and three indexed ICO images',()=>{
 for(const size of [16,32,48,180,192,512])png(fs.readFileSync(path.join(images,size===180?'apple-touch-icon.png':`favicon-${size}.png`)),size);
 const ico=fs.readFileSync(path.join(images,'favicon.ico'));assert.equal(ico.readUInt16LE(0),0);assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);let end=54;
 [16,32,48].forEach((size,i)=>{const entry=6+16*i;assert.equal(ico[entry],size);assert.equal(ico[entry+1],size);assert.equal(ico.readUInt16LE(entry+6),32);const length=ico.readUInt32LE(entry+8),offset=ico.readUInt32LE(entry+12);assert.equal(offset,end);png(ico.subarray(offset,offset+length),size);end=offset+length;});assert.equal(end,ico.length);
});
test('every public page uses a shared compact brand and content-versioned compatible icons',()=>{
 for(const lang of ['en','ar'])for(const page of ['index','services','process','about','contact','privacy','404']){
  const html=fs.readFileSync(path.join(root,lang,page+'.html'),'utf8');assert.equal((html.match(/logo-symbol\.svg\?v=/g)||[]).length,2);assert(html.includes(`logo-symbol.svg?v=${digest('logo-symbol.svg')}`));assert(html.includes('class="brand footer-brand"'));
  for(const file of ['favicon.svg','favicon.ico','favicon-16.png','favicon-32.png','apple-touch-icon.png'])assert(html.includes(`${file}?v=${digest(file)}`));
  assert(!html.includes('footer-logo-link'));assert(!html.includes('logo-web.svg'));
 }
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'site.webmanifest')));for(const size of [192,512])assert(manifest.icons.some(i=>i.sizes===`${size}x${size}`&&i.src.endsWith(`favicon-${size}.png?v=${digest(`favicon-${size}.png`)}`)));
});
test('cleaned compact symbol keeps the official source silhouette and proportion',()=>{
 const {Resvg}=require('@resvg/resvg-js');const source=fs.readFileSync(path.resolve(__dirname,'../assets/images/official-logo.jpg')).toString('base64');
 const original=`<svg xmlns="http://www.w3.org/2000/svg" width="574" height="402" viewBox="209 280 574 402"><image width="1000" height="1000" href="data:image/jpeg;base64,${source}"/></svg>`;
 const a=new Resvg(original,{background:'white'}).render().pixels,b=new Resvg(fs.readFileSync(path.join(images,'logo-symbol.svg')),{background:'white'}).render().pixels;assert.equal(a.length,b.length);
 let intersection=0,union=0;for(let i=0;i<a.length;i+=4){const x=a[i]<128,y=b[i]<128;intersection+=x&&y;union+=x||y;}assert(intersection/union>.96,'Compact mark diverged from the official silhouette');
});
