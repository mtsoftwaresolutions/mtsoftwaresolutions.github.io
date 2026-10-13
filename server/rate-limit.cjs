'use strict';
const { createHmac, randomBytes } = require('node:crypto');
const { mkdirSync } = require('node:fs');
const { dirname } = require('node:path');
const WINDOW=15*60*1000;
function keyFor(ip,salt){return 'mtss:contact:'+createHmac('sha256',salt).update(ip).digest('hex');}
function sqliteLimiter(file,salt=randomBytes(32).toString('hex')){
 const {DatabaseSync}=require('node:sqlite');
 if(file!==':memory:')mkdirSync(dirname(file),{recursive:true});
 const db=new DatabaseSync(file);db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)');
 const read=db.prepare('SELECT count,expires FROM limits WHERE key=?');
 const write=db.prepare('INSERT INTO limits(key,count,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,expires=excluded.expires');
 const prune=db.prepare('DELETE FROM limits WHERE expires < ?');
 return {async consume(ip,now=Date.now()){
  const key=keyFor(ip,salt);db.exec('BEGIN IMMEDIATE');
  try{prune.run(now);const prev=read.get(key);const count=prev&&prev.expires>now?prev.count+1:1;const expires=prev&&prev.expires>now?prev.expires:now+WINDOW;write.run(key,count,expires);db.exec('COMMIT');return {allowed:count<=5,retryAfter:Math.ceil((expires-now)/1000)};}catch(error){db.exec('ROLLBACK');throw error;}
 },close(){db.close();}};
}
const LUA="local c=redis.call('INCR',KEYS[1]); if c==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return {c,redis.call('PTTL',KEYS[1])}";
function redisLimiter({url,token,salt,fetchImpl=fetch}){
 if(new URL(url).protocol!=='https:')throw Error('Redis REST URL must use HTTPS');
 return {async consume(ip){const response=await fetchImpl(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',LUA,'1',keyFor(ip,salt),String(WINDOW)]),signal:AbortSignal.timeout(4000)});if(!response.ok)throw Error('Rate store unavailable');const data=await response.json();if(data.error||!Array.isArray(data.result)||data.result.length!==2)throw Error('Invalid rate response');const [count,ttl]=data.result;if(!Number.isFinite(count)||!Number.isFinite(ttl)||ttl<=0)throw Error('Invalid rate state');return{allowed:count<=5,retryAfter:Math.ceil(ttl/1000)};},close(){}};
}
module.exports={sqliteLimiter,redisLimiter,keyFor};
