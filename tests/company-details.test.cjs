'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('../js/content.js');require('../js/contact-rules.js');global.MTContactRules=require('../js/contact-rules.js');require('../js/views.js');
const company=global.MTContent.company;
test('confirmed company details appear on all locale pages without replacing the visitor phone field',()=>{
 for(const lang of ['en','ar'])for(const route of ['index','services','process','about','contact','privacy','404']){
  const html=fs.readFileSync(path.resolve(__dirname,`../dist/${lang}/${route}.html`),'utf8');
  assert(html.includes(`href="tel:${company.phone}"`));assert(html.includes(`<span dir="ltr">${company.phone}</span>`));
  for(const network of ['facebook','linkedin'])assert(html.includes(`href="${company.social[network]}" aria-label=`));
  assert(html.includes(company.location.display[lang==='ar'?1:0]));assert(html.includes(`<time datetime="2024-12">${company.founding.display[lang==='ar'?1:0]}</time>`));
  assert(!html.includes('2024-12-01'));assert(!/wa\.me|maps\.google|openingHours/.test(html));
  if(route==='contact'){assert.equal((html.match(/id="phone"/g)||[]).length,1);assert(html.indexOf('id="inquiry-form"')<html.indexOf('class="company-contact-details"'));}
 }
});
test('shared templates use company data, including Contact language rerenders, rather than copied literals',()=>{
 const before={...company,location:company.location,social:company.social,founding:company.founding};
 try{
  Object.assign(company,{phone:'+12345678900',location:{country:'EG',city:'Test',display:['Test locality','موقع اختباري']},social:{facebook:'https://facebook.example.invalid/company',linkedin:'https://linkedin.example.invalid/company'},founding:{period:'2030-05',precision:'month',display:['May 2030','مايو 2030']}});
  const html=global.MTViews.pageHTML({lang:'ar',page:'contact'});assert(html.includes('tel:+12345678900'));assert(html.includes('موقع اختباري'));assert(html.includes(company.social.facebook));assert(html.includes('datetime="2030-05"'));assert(!html.includes('+201032105166'));
 }finally{Object.assign(company,before);}
});
