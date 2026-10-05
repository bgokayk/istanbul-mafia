'use strict';
process.env.PORT=process.env.PORT||'8846';process.env.QA_OUT=process.env.QA_OUT||'qa/ab/results/monetization/ui';
const {fs,path,out,server,launch,ev}=require('./ab-harness.cjs'),assert=require('assert/strict');
const {bridge}=require('./monetization-native-fixture.cjs'),{adFixture,config}=require('./monetization-fixtures.cjs');
const sdk=fs.readFileSync(path.resolve(__dirname,'../../node_modules/cordova-plugin-purchase/www/store.js'),'utf8'),cfg=config();
const result={kind:'real game UI; native AdMob/Billing bridge responses controlled',errors:[],screens:[],checks:[]};
(async()=>{const b=await launch();try{
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});p.on('pageerror',e=>result.errors.push(e.stack));
  await p.addInitScript({content:'('+bridge.toString()+')([]);window.nativeAdFixture=('+adFixture.toString()+')();window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>"android",registerPlugin:()=>nativeAdFixture.admob,Plugins:{App:{addListener:async()=>({remove:async()=>{}}),exitApp:async()=>{}}}};\n'+sdk});
  await p.route('**/monetization-config.local.js',r=>r.fulfill({contentType:'text/javascript',body:'window.MAFIA_MONETIZATION_CONFIG='+JSON.stringify(cfg)+';'}));
  await p.goto('http://127.0.0.1:'+process.env.PORT);await ev(p,'commerce.ready');
  assert.deepEqual(await p.evaluate(()=>nativeAdFixture.events.map(e=>e.type)),['consentInfo','consentForm','initialize']);
  result.checks.push('Native startup consent precedes SDK init; no ad load or show on opening.');
  for(const [width,height]of [[390,844],[540,1310],[844,390],[932,430]]){
    await p.setViewportSize({width,height});await ev(p,"goTo('storeScreen')");await p.locator('.store-card').last().scrollIntoViewIfNeeded();
    assert.equal(await p.locator('.store-card').count(),5);
    assert.equal(await p.locator('.store-card button').filter({hasText:'€2,49'}).count(),5);
    await p.locator('#storeRestore').scrollIntoViewIfNeeded();assert(await p.locator('#storeRestore').isVisible());
    await p.screenshot({path:path.join(out,'store-bottom-'+width+'x'+height+'.png')});
    await p.locator('.store-card').first().scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'store-'+width+'x'+height+'.png')});
    const geometry=await p.evaluate(()=>{const a=document.getElementById('app').getBoundingClientRect();return [...document.querySelectorAll('.store-card')].map(e=>{const r=e.getBoundingClientRect();return {width:r.width,insideX:r.left>=a.left&&r.right<=a.right};});});assert(geometry.every(g=>g.width>0&&g.insideX));result.screens.push({width,height,geometry});
  }
  await p.setViewportSize({width:390,height:844});await ev(p,"goTo('charScreen')");await p.locator('.ccard').filter({hasText:'USTURA'}).click();await p.locator('#charScreen .bok').click();await p.locator('.mcard').filter({hasText:'ÜSKÜDAR'}).click();await p.locator('#mapScreen .bok').click();if(await p.locator('#storyBtn').isVisible())await p.locator('#storyBtn').click();await p.locator('[data-mi="-1"]').click();
  await ev(p,"stopTutorial();runGold=100;pdata.gold=100;P.hp=0;handlePlayerDeath();");await p.locator('#adRevive').waitFor({state:'visible'});
  const deathBefore=await ev(p,'({elapsed,paused,ended:_runEnded,hp:P.hp})');assert(deathBefore.paused&&!deathBefore.ended&&deathBefore.hp===0);await p.screenshot({path:path.join(out,'revive-390x844.png')});
  await p.evaluate(()=>nativeAdFixture.setMode('skip'));await p.locator('#adReviveWatch').click();assert(await p.locator('#adRevive').isVisible());assert.equal(await ev(p,'P.hp'),0);
  await p.evaluate(()=>nativeAdFixture.setMode('reward'));await p.locator('#adReviveWatch').click();await p.locator('#adRevive').waitFor({state:'hidden'});
  const revived=await ev(p,'({hp:P.hp,max:P.mhp,invuln:P._dashInvuln,ended:_runEnded,paused})');assert(revived.hp>0&&revived.invuln>0&&!revived.ended&&!revived.paused);
  result.checks.push({revived,skippedAdDidNotRevive:true});
  await ev(p,'P.hp=0;handlePlayerDeath();');await p.locator('#runSummary').waitFor({state:'visible'});assert(!(await p.locator('#adRevive').isVisible()));
  const goldBefore=await ev(p,'pdata.gold');await p.locator('#doubleGoldBtn').click();await p.waitForFunction(()=>document.getElementById('doubleGoldBtn').disabled);assert.equal(await ev(p,'pdata.gold'),goldBefore+100);
  await p.screenshot({path:path.join(out,'double-gold-390x844.png')});
  await p.locator('#rsContinueBtn').click();assert.equal(await p.evaluate(()=>nativeAdFixture.events.filter(e=>e.type==='showInterstitial').length),0);
  result.checks.push('Only one revive per run; summary reward adds exact runGold once; run 1 has no interstitial.');
  assert.equal(result.errors.length,0);result.pass=true;
}finally{await b.close();server.close();}})().catch(e=>{result.pass=false;result.failure=e.stack;console.error(e);process.exitCode=1;server.close();}).finally(()=>{fs.writeFileSync(path.join(out,'ui.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));});
