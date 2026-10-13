'use strict';
// The full lockup embeds the unchanged official JPEG: it is not a vector conversion.
// Compact symbol geometry is reconstructed from the supplied mark's measured contours.
const fs=require('node:fs'),path=require('node:path');
const {Resvg}=require('@resvg/resvg-js');
const dir=path.resolve(__dirname,'../assets/images');
const original=fs.readFileSync(path.join(dir,'official-logo.jpg')).toString('base64');
fs.writeFileSync(path.join(dir,'logo-full.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="744" height="500" viewBox="128 280 744 500" role="img" aria-label="MT Software Solutions"><title>MT Software Solutions</title><rect width="1200" height="1200" fill="white"/><image width="1000" height="1000" href="data:image/jpeg;base64,${original}"/></svg>`);
// Original symbol bounds: x225–766, y296–663. Preserve the distinctive MT outline,
// separate T bar/stem, brace silhouette, orientation and proportions; never use a font.
const brace='M645 296H671C710 296 734 322 734 358V431C734 447 748 455 766 455V504C748 504 734 512 734 528V594C734 637 709 663 672 663H645V615H665C676 615 683 606 683 594V522C683 500 698 487 712 480C698 475 683 458 683 438V365C683 352 675 344 665 344H645Z';
const mark=`<g fill="#000"><path d="${brace}"/><path d="${brace}" transform="translate(991 0) scale(-1 1)"/><path d="M364 420H393L452 537L507 420H537V541H507V491L465 573H439L394 490V579H364Z"/><path d="M548 420H640Q642 420 642 422V445Q642 447 640 447H548Q546 447 546 445V422Q546 420 548 420Z"/><path d="M579 478H609V579H579Z"/></g>`;
fs.writeFileSync(path.join(dir,'logo-symbol.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="574" height="402" viewBox="209 280 574 402"><title>MT symbol</title>${mark}</svg>`);
const favicon=`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="179 163 634 634"><title>MT Software Solutions</title><rect x="179" y="163" width="634" height="634" rx="108" fill="white"/>${mark}</svg>`;
fs.writeFileSync(path.join(dir,'favicon.svg'),favicon);
const png=size=>new Resvg(favicon,{fitTo:{mode:'width',value:size},font:{loadSystemFonts:false}}).render().asPng();
for(const size of [16,32,48,180,192,512])fs.writeFileSync(path.join(dir,size===180?'apple-touch-icon.png':`favicon-${size}.png`),png(size));
// PNG-compressed ICO entries supported by modern desktop browsers and Windows.
const sizes=[16,32,48],payloads=sizes.map(png),header=Buffer.alloc(6+16*sizes.length);
header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const entry=6+i*16;header[entry]=size;header[entry+1]=size;header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(payloads[i].length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=payloads[i].length;});
fs.writeFileSync(path.join(dir,'favicon.ico'),Buffer.concat([header,...payloads]));

if(require.main===module)console.log('Official full raster lockup, reconstructed compact symbol and favicon pack generated.');
