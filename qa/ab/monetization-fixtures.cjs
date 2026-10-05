'use strict';
const {CATALOG}=require('../../www/monetization-iap.js');
function config(){return {test:true,products:Object.fromEntries(CATALOG.map(p=>[p.key,'qa.'+p.key])),validatorUrl:'https://validator.example/v1/verify'};}
function game(initial={gold:0}){let data=structuredClone(initial);const writes=[];return {read:()=>data,commit:fn=>{const draft=structuredClone(data);fn(draft);writes.push(structuredClone(draft));data=draft;},writes,replace:d=>{data=structuredClone(d);}};}
function purchaseFixture(cfg,options={}){
  const hooks={},events=[],products=new Map();let errorHandler=()=>{},mode='success',counter=0;
  const cp={Platform:{GOOGLE_PLAY:'android-playstore'},ProductType:{CONSUMABLE:'consumable',NON_CONSUMABLE:'non-consumable'},TransactionState:{CANCELLED:'cancelled',APPROVED:'approved',FINISHED:'finished'},LogLevel:{ERROR:1},ErrorCode:{PAYMENT_CANCELLED:2,COMMUNICATION:3}};
  const when=new Proxy({},{get:(_,name)=>fn=>{(hooks[name]||(hooks[name]=[])).push(fn);return when;}});
  const emit=async(name,arg)=>{for(const fn of hooks[name]||[])await fn(arg);};
  const store=cp.store={localReceipts:[],verifiedReceipts:[],register(list){for(const p of list){products.set(p.id,{...p,getOffer:()=>({pricingPhases:[{price:options.price||'€2,49'}],canPurchase:true,order:async()=>{
    events.push('order:'+p.id);if(mode==='cancel')return {isError:true,code:2};if(mode==='error')return {isError:true,code:3};
    const receipt=makeReceipt(p.id);store.localReceipts.push(receipt);
    if(mode==='pending'){await emit('pending',receipt.transactions[0]);return;}
    await emit('approved',receipt.transactions[0]);
  }})});}},get:id=>products.get(id),error:fn=>{errorHandler=fn;},when:()=>when,
  initialize:async()=>{await emit('receiptsReady');return [];},
  restorePurchases:async()=>{if(mode==='restore-error')return {isError:true,code:3};return undefined;}};
  function makeReceipt(id,opts={}){
    const receipt={platform:cp.Platform.GOOGLE_PLAY,transactions:[],verify(){events.push('verify:'+id);setImmediate(async()=>{
      if(mode==='invalid'){await emit('unverified',{});return;}
      const item={id,transactionId:opts.transactionId||receipt.id,quantity:opts.quantity||1,isConsumed:!!opts.consumed,isExpired:!!opts.expired};
      const vr={sourceReceipt:receipt,collection:[item],validationDate:new Date(),finish:async()=>{events.push('finish:'+id);if(options.beforeFinish)options.beforeFinish(id);if(mode==='finish-error'){errorHandler({code:3});throw Error('finish failed');}events.push((products.get(id).type==='consumable'?'consume:':'ack:')+id);receipt.transactions[0].state='finished';await emit('finished',receipt.transactions[0]);}};
      store.verifiedReceipts=store.verifiedReceipts.filter(v=>v.sourceReceipt!==receipt).concat(vr);await emit('verified',vr);
    });},id:'transaction-'+(++counter)};
    receipt.transactions=[{products:[{id}],state:opts.finished?'finished':'approved',parentReceipt:receipt}];return receipt;
  }
  return {cp,events,emit,makeReceipt,setMode:v=>{mode=v;},error:e=>errorHandler(e)};
}
function adFixture({rejectConsent=false,consentError=false}={}){
  const handlers={},events=[];let pendingConsent,mode='reward';
  const info={status:'OBTAINED',isConsentFormAvailable:true,privacyOptionsRequirementStatus:'REQUIRED',canRequestAds:!rejectConsent};
  const emit=(name,data)=>{for(const fn of handlers[name]||[])fn(data);};
  const admob={addListener:async(name,fn)=>{(handlers[name]||(handlers[name]=[])).push(fn);return {remove:async()=>{handlers[name]=handlers[name].filter(x=>x!==fn);}};},
    requestConsentInfo:async()=>{events.push({type:'consentInfo'});if(consentError)throw Error('offline');return {...info,status:'REQUIRED'};},
    showConsentForm:async()=>{events.push({type:'consentForm'});if(mode==='hold-consent')await new Promise(r=>pendingConsent=r);return info;},
    showPrivacyOptionsForm:async()=>{events.push({type:'privacyForm'});},
    initialize:async()=>{events.push({type:'initialize'});},
    prepareInterstitial:async o=>{events.push({type:'loadInterstitial',o});if(mode==='load-error')throw Error('no fill');},
    showInterstitial:async()=>{events.push({type:'showInterstitial'});emit('interstitialAdShowed');emit('interstitialAdDismissed');},
    prepareRewardVideoAd:async o=>{events.push({type:'loadReward',o});if(mode==='load-error')throw Error('no fill');},
    showRewardVideoAd:async()=>{events.push({type:'showReward'});emit('onRewardedVideoAdShowed');if(mode==='reward'){emit('onRewardedVideoAdReward');emit('onRewardedVideoAdReward');}if(mode==='show-error')emit('onRewardedVideoAdFailedToShow');else emit('onRewardedVideoAdDismissed');return {amount:1,type:'odul'};}};
  return {admob,events,emit,info,setMode:v=>{mode=v;},releaseConsent:()=>pendingConsent&&pendingConsent(),handlers};
}
module.exports={config,game,purchaseFixture,adFixture};
