'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const IAP=require('../../www/monetization-iap.js'),Ads=require('../../www/monetization-ads.js');
const {createValidator}=require('../../server/play-validator.cjs'),{configuration}=require('../../scripts/prepare-monetization.cjs');
const {config,game,purchaseFixture,adFixture}=require('./monetization-fixtures.cjs');
const out=path.resolve(process.env.QA_OUT||path.join(__dirname,'results/monetization'));fs.mkdirSync(out,{recursive:true});
const result={kind:'controlled contract tests; native SDK/network mocked, no Play account or paid ad requests',tests:[],measurements:[]};
const tick=()=>new Promise(r=>setImmediate(r));
async function test(name,fn){await fn();result.tests.push({name,pass:true});console.log('PASS '+name);}
(async()=>{
  const cfg=config();
  await test('five products: verify -> atomic delivery -> finish/consume/ack; localized prices',async()=>{
    const g=game(),f=purchaseFixture(cfg,{beforeFinish:id=>assert(g.writes.length>0&&Object.keys(g.read().commerce.delivered).length>0)}),iap=IAP.create({purchase:f.cp,config:cfg,...g});await iap.init();
    assert.equal(iap.details().length,5);assert(iap.details().every(x=>x.price==='€2,49'));
    for(const p of IAP.CATALOG){assert.equal(await iap.buy(p.key),true);await tick();await tick();assert(f.events.includes((p.type==='consumable'?'consume:':'ack:')+cfg.products[p.key]));const v=f.events.indexOf('verify:'+cfg.products[p.key]),fin=f.events.indexOf('finish:'+cfg.products[p.key]);assert(v>=0&&fin>v);}
    assert.equal(g.read().gold,48000);assert(iap.owned('remove_ads')&&iap.owned('starter_pack'));
    assert.equal(await iap.buy('remove_ads'),false);
    const receipt=f.cp.store.verifiedReceipts.find(r=>r.collection[0].id===cfg.products.gold_small);await f.emit('verified',receipt);assert.equal(g.read().gold,48000);
  });
  await test('cancel, error, pending and invalid receipt give no goods',async()=>{
    for(const product of IAP.CATALOG)for(const mode of ['cancel','error','pending','invalid']){const g=game(),f=purchaseFixture(cfg),iap=IAP.create({purchase:f.cp,config:cfg,...g});await iap.init();f.setMode(mode);await iap.buy(product.key);await tick();await tick();assert.equal(g.read().gold,0);assert(!f.events.some(x=>x.startsWith('finish:')));assert(!iap.snapshot().busy);assert(iap.snapshot().status.length>10);}
  });
  await test('storage failure: no delivery and no consume; restore retries safely',async()=>{
    const g=game(),f=purchaseFixture(cfg);let broken=false;
    const iap=IAP.create({purchase:f.cp,config:cfg,...g,commit:fn=>{if(broken)throw Error('quota');g.commit(fn);}});await iap.init();broken=true;await iap.buy('gold_small');await tick();await tick();assert.equal(g.read().gold,0);assert(!f.events.some(x=>x.startsWith('finish:')));broken=false;assert(await iap.restore());assert.equal(g.read().gold,4000);assert(await iap.restore());assert.equal(g.read().gold,4000);
  });
  await test('finish failure: retry acknowledges without double gold',async()=>{
    const g=game(),f=purchaseFixture(cfg),iap=IAP.create({purchase:f.cp,config:cfg,...g});await iap.init();f.setMode('finish-error');await iap.buy('gold_small');await tick();await tick();assert.equal(g.read().gold,4000);f.setMode('success');assert(await iap.restore());assert.equal(g.read().gold,4000);
  });
  await test('clean save restore permanent products; consumed gold never restored; refund revokes',async()=>{
    const g=game(),f=purchaseFixture(cfg);f.cp.store.localReceipts=[f.makeReceipt(cfg.products.remove_ads,{finished:true}),f.makeReceipt(cfg.products.starter_pack,{finished:true}),f.makeReceipt(cfg.products.gold_small,{consumed:true})];
    const iap=IAP.create({purchase:f.cp,config:cfg,...g});await iap.init();assert(iap.owned('remove_ads')&&iap.owned('starter_pack'));assert.equal(g.read().gold,2000);assert(await iap.restore());assert.equal(g.read().gold,2000);
    f.cp.store.localReceipts=[];assert(await iap.restore());assert(!iap.owned('remove_ads')&&!iap.owned('starter_pack'));
  });
  await test('missing validator: order disabled; local ownership cannot authorize purchases',async()=>{
    const g=game(),f=purchaseFixture(cfg),iap=IAP.create({purchase:f.cp,config:{...cfg,validatorUrl:''},...g});await iap.init();assert(!iap.snapshot().ready);assert.equal(await iap.buy('gold_small'),false);assert.equal(f.events.length,0);
  });
  await test('UMP blocks all ad loads until form completed; NPA only; privacy entry',async()=>{
    const g=game(),f=adFixture();f.setMode('hold-consent');const ads=Ads.create({admob:f.admob,config:cfg,...g,context:()=>true});const ready=ads.init();await tick();assert(!ads.available());assert.equal(f.events.filter(e=>e.type.startsWith('load')).length,0);f.releaseConsent();await ready;assert.deepEqual(f.events.map(x=>x.type),['consentInfo','consentForm','initialize']);assert(ads.snapshot().privacyRequired);
    ads.beginRun('r');f.setMode('reward');assert(await ads.reward('revive','r'));assert(f.events.filter(e=>e.o).every(e=>e.o.npa===true));await ads.privacy();assert(f.events.some(e=>e.type==='privacyForm'));await ads.dispose();assert(Object.values(f.handlers).every(v=>v.length===0));
  });
  await test('denied/unavailable consent: no SDK init or load; denial with canRequestAds uses NPA',async()=>{
    for(const opts of [{rejectConsent:true},{consentError:true},{}]){const g=game(),f=adFixture(opts),ads=Ads.create({admob:f.admob,config:cfg,...g,context:()=>true});await ads.init();ads.beginRun('r');const granted=await ads.reward('revive','r');assert.equal(granted,!opts.rejectConsent&&!opts.consentError);if(!granted)assert(!f.events.some(e=>e.type==='initialize'||e.type.startsWith('load')));else assert(f.events.find(e=>e.o).o.npa);await ads.dispose();}
  });
  await test('first 3 completed runs: 0 interstitial; boundary 179999/180000ms; clock rollback; remove_ads',async()=>{
    const g=game(),f=adFixture();let wall=1000000,mono=0,phase='ended';const ads=Ads.create({admob:f.admob,config:cfg,...g,context:()=>phase==='ended',now:()=>wall,monotonic:()=>mono});await ads.init();const rows=[];
    for(let i=1;i<=4;i++){ads.beginRun('r'+i);ads.endRun('r'+i,50);const shown=await ads.interstitial('r'+i);rows.push({run:i,wall,shown});assert.equal(shown,i===4);}
    wall+=179999;mono+=179999;ads.beginRun('r5');ads.endRun('r5',50);assert.equal(await ads.interstitial('r5'),false);rows.push({run:5,sinceLastMs:179999,shown:false});
    wall++;mono++;assert.equal(await ads.interstitial('r5'),true);rows.push({run:5,sinceLastMs:180000,shown:true});
    wall-=1000;mono+=180000;ads.beginRun('r6');ads.endRun('r6',50);assert.equal(await ads.interstitial('r6'),false);
    wall+=400000;g.commit(d=>{d.commerce.entitlements={remove_ads:true};});ads.beginRun('r7');ads.endRun('r7',50);assert.equal(await ads.interstitial('r7'),false);
    assert.equal(f.events.filter(e=>e.type==='showInterstitial').length,2);result.measurements.push(...rows);await ads.dispose();
  });
  await test('reward granted once only on Rewarded event; dismissal alone gives zero; optional after remove_ads',async()=>{
    const g=game({gold:100,commerce:{entitlements:{remove_ads:true}}}),f=adFixture();let phase='dead';const ads=Ads.create({admob:f.admob,config:cfg,...g,context:(_,p)=>p===phase});await ads.init();ads.beginRun('r');f.setMode('skip');assert.equal(await ads.reward('revive','r'),false);assert(!ads.snapshot().run.revived);f.setMode('reward');assert(await ads.reward('revive','r'));assert.equal(await ads.reward('revive','r'),false);
    phase='ended';ads.endRun('r',100);assert(await ads.reward('double','r'));assert.equal(g.read().gold,200);assert.equal(await ads.reward('double','r'),false);assert.equal(g.read().gold,200);await ads.dispose();
  });
  await test('active play / menu / stale run: never display; concurrent reward serialized',async()=>{
    const g=game({commerce:{ads:{completedRuns:8}}}),f=adFixture();let visible=false;const ads=Ads.create({admob:f.admob,config:cfg,...g,context:()=>visible});await ads.init();ads.beginRun('r');ads.endRun('r',100);assert.equal(await ads.interstitial('r'),false);assert.equal(await ads.reward('double','r'),false);visible=true;
    const values=await Promise.all([ads.reward('double','r'),ads.reward('double','r')]);assert.equal(values.filter(Boolean).length,1);assert.equal(g.read().gold,100);await ads.dispose();
  });
  await test('server verifies Play state/product/test flag and strips token; pending/refund/mismatch/network',async()=>{
    const raw={orderId:'qa-order',purchaseStateContext:{purchaseState:'PURCHASED'},testPurchaseContext:{fopType:'TEST'},productLineItem:[{productId:cfg.products.gold_small,productOfferDetails:{quantity:1,consumptionState:'CONSUMPTION_STATE_YET_TO_BE_CONSUMED'}}],purchaseCompletionTime:new Date().toISOString()};
    const body={id:cfg.products.gold_small,transaction:{type:'android-playstore',purchaseToken:'test-token-never-log'}};
    const valid=createValidator({products:cfg.products,packageName:'com.lumenco.istanbulmafia',testOnly:true},async()=>raw);const ok=await valid(body);assert(ok.ok);assert.equal(ok.data.collection[0].quantity,1);assert(!JSON.stringify(ok).includes(body.transaction.purchaseToken));
    raw.purchaseStateContext.purchaseState='PENDING';assert.equal((await valid(body)).ok,false);raw.purchaseStateContext.purchaseState='CANCELLED';assert((await valid(body)).data.collection[0].isExpired);raw.purchaseStateContext.purchaseState='PURCHASED';delete raw.testPurchaseContext;assert.equal((await valid(body)).ok,false);assert.equal((await valid({...body,id:'wrong'})).ok,false);assert.equal((await createValidator({products:cfg.products},async()=>{throw Error('offline');})(body)).ok,false);
  });
  await test('test defaults ignore real IDs; production rejects missing config; secrets never exported',async()=>{
    const c=configuration({ADMOB_INTERSTITIAL_UNIT_ID:'private',GOOGLE_APPLICATION_CREDENTIALS:'SECRET'});assert(c.test);assert.equal(c.interstitial,'');assert(!JSON.stringify(c).includes('SECRET'));assert.throws(()=>configuration({MONETIZATION_MODE:'production'}));
  });
  result.pass=true;
})().catch(e=>{result.pass=false;result.failure=e.stack;console.error(e);process.exitCode=1;}).finally(()=>{fs.writeFileSync(path.join(out,'controlled.json'),JSON.stringify(result,null,2));});
