'use strict';
process.env.PORT=process.env.PORT||'8846';process.env.QA_OUT=process.env.QA_OUT||'qa/ab/results/monetization/sdk';
const {fs,path,out,server,launch,ev,start}=require('./ab-harness.cjs'),assert=require('assert/strict');
const {createValidator}=require('../../server/play-validator.cjs');
const keys=['remove_ads','starter_pack','gold_small','gold_medium','gold_large'],products=Object.fromEntries(keys.map(k=>[k,'qa.'+k]));
const {bridge}=require('./monetization-native-fixture.cjs');
const source=fs.readFileSync(path.resolve(__dirname,'../../node_modules/cordova-plugin-purchase/www/store.js'),'utf8');
const results={kind:'Real cordova-plugin-purchase 13.18.0 JS + real game modules, mocked Android bridge/Google HTTP. Not a native Play purchase.',flows:[],errors:[]};
(async()=>{const browser=await launch();
  try{
    async function page(owned=[]){
      const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage();p.on('pageerror',e=>results.errors.push(e.stack));
      await p.addInitScript({content:'('+bridge.toString()+')('+JSON.stringify(owned)+');\n'+source});
      await p.route('https://validator.example/v1/verify',async route=>{
        const body=route.request().postDataJSON(),purchase=await p.evaluate(token=>sdkFixture.purchases.find(x=>x.purchaseToken===token),body.transaction.purchaseToken);
        const validate=createValidator({products,packageName:'com.lumenco.istanbulmafia',testOnly:true},async()=>{
          if(!purchase)throw Error('unknown');return {orderId:purchase.orderId,purchaseStateContext:{purchaseState:purchase.getPurchaseState===2?'PENDING':'PURCHASED'},testPurchaseContext:{fopType:'TEST'},purchaseCompletionTime:new Date(purchase.purchaseTime).toISOString(),acknowledgementState:purchase.acknowledged?'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED':'ACKNOWLEDGEMENT_STATE_PENDING',productLineItem:[{productId:purchase.productIds[0],productOfferDetails:{quantity:1,consumptionState:purchase.consumed?'CONSUMPTION_STATE_CONSUMED':'CONSUMPTION_STATE_YET_TO_BE_CONSUMED'}}]};
        });
        await route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(await validate(body))});
      });
      await p.goto('http://127.0.0.1:'+process.env.PORT);
      await p.evaluate(async products=>{
        window.sdkSave={gold:0};window.sdkMessages=[];
        window.sdkIap=MafiaIAP.create({finishTimeoutMs:1500,purchase:CdvPurchase,config:{products,validatorUrl:'https://validator.example/v1/verify'},read:()=>sdkSave,commit:fn=>{const d=structuredClone(sdkSave);fn(d);localStorage.setItem('qa-sdk-save',JSON.stringify(d));sdkSave=d;},notify:m=>sdkMessages.push(m)});
        await sdkIap.init();
      },products);
      return {p,context};
    }
    const {p,context}=await page();assert(await p.evaluate(()=>sdkIap.snapshot().ready));
    for(const key of keys){
      for(const mode of ['cancel','error']){const before=await p.evaluate(()=>sdkSave.gold);await p.evaluate(m=>sdkFixture.mode=m,mode);assert.equal(await p.evaluate(k=>sdkIap.buy(k),key),false);assert.equal(await p.evaluate(()=>sdkSave.gold),before);}
      await p.evaluate(()=>sdkFixture.mode='success');
      assert(await p.evaluate(k=>sdkIap.buy(k),key));
      await p.waitForFunction(k=>sdkFixture.purchases.some(p=>p.productIds[0]==='qa.'+k&&(p.acknowledged||p.consumed)),key,{timeout:15000});
      results.flows.push(await p.evaluate(k=>({key:k,gold:sdkSave.gold,owned:sdkIap.owned(k),state:sdkIap.snapshot(),finalized:sdkFixture.purchases.find(p=>p.productIds[0]==='qa.'+k).consumed?'consumed':'acknowledged'}),key));
    }
    assert.equal(await p.evaluate(()=>sdkSave.gold),48000);
    for(const mode of ['cancel','error']){await p.evaluate(m=>sdkFixture.mode=m,mode);assert.equal(await p.evaluate(()=>sdkIap.buy('gold_small')),false);assert.equal(await p.evaluate(()=>sdkSave.gold),48000);}
    await p.evaluate(()=>sdkFixture.mode='pending');assert(await p.evaluate(()=>sdkIap.buy('gold_small')));
    await p.waitForFunction(()=>sdkIap.snapshot().status.includes('bekliyor'),null,{timeout:5000}).catch(async e=>{results.debug=await p.evaluate(()=>({state:sdkIap.snapshot(),messages:sdkMessages,transactions:CdvPurchase.store.localTransactions.map(t=>({state:t.state,products:t.products})),events:sdkFixture.events}));throw e;});assert.equal(await p.evaluate(()=>sdkSave.gold),48000);
    await p.evaluate(async()=>{sdkFixture.purchases.at(-1).getPurchaseState=1;sdkFixture.mode='success';await CdvPurchase.store.restorePurchases();});
    await p.waitForFunction(()=>sdkSave.gold===52000&&sdkFixture.purchases.at(-1).consumed);results.pendingThenApproved=true;
    await p.evaluate(()=>sdkFixture.mode='finish-error');assert(await p.evaluate(()=>sdkIap.buy('gold_small')));
    await p.waitForFunction(()=>sdkIap.snapshot().status.includes('tamamlanamadı'));assert.equal(await p.evaluate(()=>sdkSave.gold),56000);
    assert.equal(await p.evaluate(()=>sdkFixture.purchases.at(-1).consumed),false);await p.evaluate(()=>sdkFixture.mode='success');assert(await p.evaluate(()=>sdkIap.restore()));assert.equal(await p.evaluate(()=>sdkSave.gold),56000);results.nativeFinishFailureRecovered=true;
    const owned=await p.evaluate(()=>sdkFixture.purchases.filter(p=>!p.consumed));await context.close();
    const restored=await page(owned);assert(await restored.p.evaluate(()=>sdkIap.owned('remove_ads')&&sdkIap.owned('starter_pack')));assert.equal(await restored.p.evaluate(()=>sdkSave.gold),2000);assert(await restored.p.evaluate(()=>sdkIap.restore()));assert.equal(await restored.p.evaluate(()=>sdkSave.gold),2000);results.cleanRestore=true;await restored.context.close();
    assert.equal(results.errors.length,0);results.pass=true;
  }finally{await browser.close();server.close();}
})().catch(e=>{results.pass=false;results.failure=e.stack;console.error(e);process.exitCode=1;server.close();}).finally(()=>{fs.writeFileSync(path.join(out,'sdk.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));});
