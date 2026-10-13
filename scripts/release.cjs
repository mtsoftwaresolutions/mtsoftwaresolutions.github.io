'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
function run(command,args,options={}){const r=spawnSync(command,args,{cwd:root,stdio:'inherit',...options});if(r.status!==0)throw Error(command+' failed; no release marked verified.');}
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function files(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name),prefix+e.name+'/'):[prefix+e.name]);}
function release(){
 // Regenerate and validate this exact source before assembling a private release.
 for(const command of ['build','check','test'])run('npm',['run',command]);
 const id='release-'+new Date().toISOString().replace(/[:.]/g,'-');const output=path.join(root,'.private/releases',id);fs.mkdirSync(output,{recursive:true,mode:0o700});
 const runtime=['dist','server','js/contact-rules.js','js/content.js','package.json','package-lock.json'];
 const source=['js','css','scripts','server','tests','templates','assets','docs','README.md','package.json','package-lock.json','.gitignore','.env.example'];
 for(const [name,entries]of [['runtime',runtime],['source',source]])run('tar',['-czf',path.join(output,name+'.tar.gz'),...entries]);
 const manifest={id,createdUTC:new Date().toISOString(),origin:JSON.parse(fs.readFileSync(path.join(root,'dist/.build-meta.json'))).origin,readiness:'Local release; external HTTPS/provider/storage configuration and controlled acceptance/receipt still required',archives:Object.fromEntries(['runtime','source'].map(name=>[name+'.tar.gz',digest(path.join(output,name+'.tar.gz'))])),publicFiles:Object.fromEntries(files(path.join(root,'dist')).map(file=>[file,digest(path.join(root,'dist',file))])),excluded:['.env','.runtime','business-operations','screenshots','.private','node_modules'],runtimeEntries:runtime};
 fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
 fs.writeFileSync(path.join(output,'RESTORE.md'),'# Restore in a new private directory\n\nVerify SHA-256 against manifest.json. Extract runtime.tar.gz into an empty private release directory, install runtime dependencies with npm ci --omit=dev, and configure the real runtime secrets/origin separately. Point the host release switch to that directory only after authorization and checks. Do not extract over the working tree or overwrite rate storage. Source recovery is source.tar.gz plus npm ci and npm run build; preserve newer unrelated changes. See docs/RELEASE-ROLLBACK.md in the source archive.\n');
 console.log('Private release created: '+output);return output;
}
if(require.main===module)try{release();}catch(e){console.error(e.message);process.exitCode=1;}
module.exports={release};
