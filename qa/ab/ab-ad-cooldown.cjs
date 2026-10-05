'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const Ads=require('../../www/monetization-ads.js'),{game,adFixture,config}=require('./monetization-fixtures.cjs');
const out=path.resolve(process.env.QA_OUT||'qa/ab/results/monetization');fs.mkdirSync(out,{recursive:true});
const r={kind:'real elapsed wall clock; AdMob bridge simulated, no clock substitution',samples:[]};
(async()=>{
  const g=game(),f=adFixture(),ads=Ads.create({admob:f.admob,config:config(),...g,context:()=>true});await ads.init();
  for(let i=1;i<=4;i++){ads.beginRun('r'+i);ads.endRun('r'+i,0);const shown=await ads.interstitial('r'+i);assert.equal(shown,i===4);r.samples.push({run:i,at:new Date().toISOString(),shown});}
  const first=g.read().commerce.ads.lastFullscreenAt;
  ads.beginRun('r5');ads.endRun('r5',0);
  const check=async label=>{const elapsed=Date.now()-first,shown=await ads.interstitial('r5');r.samples.push({label,elapsedMs:elapsed,shown});fs.writeFileSync(path.join(out,'cooldown-realtime.json'),JSON.stringify(r,null,2));return shown;};
  assert.equal(await check('immediate'),false);
  await new Promise(resolve=>setTimeout(resolve,Math.max(1,179000-(Date.now()-first))));assert.equal(await check('179 seconds'),false);
  await new Promise(resolve=>setTimeout(resolve,Math.max(1,180050-(Date.now()-first))));assert.equal(await check('180 seconds'),true);
  r.intervalMs=g.read().commerce.ads.lastFullscreenAt-first;assert(r.intervalMs>=180000);r.pass=true;await ads.dispose();
})().catch(e=>{r.pass=false;r.failure=e.stack;process.exitCode=1;console.error(e);}).finally(()=>{fs.writeFileSync(path.join(out,'cooldown-realtime.json'),JSON.stringify(r,null,2));console.log(JSON.stringify(r));});
