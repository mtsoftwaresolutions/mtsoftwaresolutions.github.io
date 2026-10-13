'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
async function verify(directory){
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,'manifest.json')));const temp=fs.mkdtempSync(path.join(os.tmpdir(),'mtss-release-check-'));
 try{
  for(const [archive,hash]of Object.entries(manifest.archives))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(directory,archive))).digest('hex'),hash,'Archive mismatch');
  const archive=path.join(directory,'runtime.tar.gz'),list=spawnSync('tar',['-tzf',archive],{encoding:'utf8'});assert.equal(list.status,0,list.stderr);
  const entries=list.stdout.trim().split('\n');for(const item of entries){assert(!item.startsWith('/')&&!item.split('/').includes('..'));assert(!/(^|\/)(\.env(?:\.|$)|\.runtime|business-operations|screenshots|docs|\.private|node_modules)(\/|$)/.test(item),item);assert(manifest.runtimeEntries.some(e=>item===e||item===e+'/'||item.startsWith(e+'/')),item);}
  assert.equal(spawnSync('tar',['-xzf',archive,'-C',temp]).status,0);
  for(const [file,hash]of Object.entries(manifest.publicFiles))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(temp,'dist',file))).digest('hex'),hash,file);
  // No network provider exists in this extraction smoke test.
  const extractedServer=require(path.join(temp,'server/index.cjs')).createServer;const server=extractedServer({root:path.join(temp,'dist'),config:{},limiter:{consume:async()=>({allowed:true}),close(){}}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  try{const base='http://127.0.0.1:'+server.address().port;for(const file of ['ar/index.html','en/service-web.html','ar/about.html'])assert.equal((await fetch(base+'/'+file)).status,200);for(const file of ['business-operations/operations.xlsx','.env','.runtime/rate.sqlite','docs/README.md','ar/request-demo.html','en/work.html','ar/case-request-workflow.html'])assert.equal((await fetch(base+'/'+file)).status,404);assert.equal((await (await fetch(base+'/api/contact/status')).json()).configured,false);}finally{await new Promise(r=>server.close(r));}
  const result={release:manifest.id,verifiedUTC:new Date().toISOString(),archiveHashes:true,publicHashes:true,extraction:true,bilingualSmoke:true,privateBoundaries:true,liveDelivery:false};fs.writeFileSync(path.join(directory,'verification.json'),JSON.stringify(result,null,2));console.log('PASS: release hashes, safe extraction, routes, private boundaries and unavailable contact.');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
}
if(require.main===module){if(!process.argv[2]){console.error('Usage: node scripts/verify-release.cjs <private-release-directory>');process.exitCode=1;}else verify(path.resolve(process.argv[2])).catch(e=>{console.error(e.message);process.exitCode=1;});}
module.exports={verify};
