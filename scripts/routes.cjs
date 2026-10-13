'use strict';
// One route inventory shared by build/static/browser/release verification.
require('../js/content.js');
const pages=['home','services','process','about','contact','privacy','404',...global.MTContent.services.map(s=>'service-'+s.id)];
const fileName=page=>page==='home'?'index':page;
const routes=pages.flatMap(page=>['en','ar'].map(lang=>({lang,page,file:`${lang}/${fileName(page)}.html`,prefix:'../'}))).concat([{lang:'en',page:'home',file:'index.html',prefix:'./'},{lang:'en',page:'404',file:'404.html',prefix:'./'}]);
module.exports={pages,routes,fileName};
