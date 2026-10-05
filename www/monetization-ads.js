(function(root,factory){'use strict';if(typeof module==='object'&&module.exports)module.exports=factory();else root.MafiaAds=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TEST_IDS=Object.freeze({app:'ca-app-pub-3940256099942544~3347511713',interstitial:'ca-app-pub-3940256099942544/1033173712',rewarded:'ca-app-pub-3940256099942544/5224354917'});
  function create(options){
    const {admob,config,read,commit,context}=options;
    const now=options.now||Date.now,changed=options.changed||function(){},notify=options.notify||function(){};
    const monotonic=options.monotonic||(()=>performance.now());
    let consent=null,initialized=false,busy=false,consentBusy=false,run=null,current=null,startPromise=null;
    let lastMonotonic=-Infinity,privacyRequired=false;
    const listeners=[];
    function persist(fn){commit(d=>{const c=d.commerce||(d.commerce={});c.ads=c.ads||{completedRuns:0,lastFullscreenAt:0};fn(c.ads);});}
    function state(){return (read().commerce||{}).ads||{completedRuns:0,lastFullscreenAt:0};}
    function noAds(){return !!((read().commerce||{}).entitlements||{}).remove_ads;}
    function report(message){notify(message);changed();}
    async function consentFlow(privacy){
      if(!admob||busy||consentBusy)return false;
      consentBusy=true;consent=null;changed();
      try{
        if(privacy)await admob.showPrivacyOptionsForm();
        let info=await bounded(admob.requestConsentInfo(config.test?{debugGeography:config.debugGeography||0,testDeviceIdentifiers:config.testDevices||[]}:{}),20000);
        privacyRequired=info.privacyOptionsRequirementStatus==='REQUIRED';
        if(info.status==='REQUIRED'){
          if(!info.isConsentFormAvailable){report('Gizlilik tercihi henüz yüklenemedi. Reklamlar kapalı.');return false;}
          info=await admob.showConsentForm();
        }
        consent=info;privacyRequired=info.privacyOptionsRequirementStatus==='REQUIRED';
        if(!info.canRequestAds){report('Gizlilik tercihlerine göre reklamlar kapalı.');return false;}
        if(!initialized){await bounded(admob.initialize({initializeForTesting:!!config.test,testingDevices:config.test?config.testDevices||[]:[]}),20000);initialized=true;}
        return true;
      }catch(e){consent=null;report('Reklam hizmeti şu an kullanılamıyor. Oyuna reklamsız devam edebilirsin.');return false;}
      finally{consentBusy=false;changed();}
    }
    function stamp(){
      lastMonotonic=monotonic();
      persist(a=>{a.lastFullscreenAt=Math.max(a.lastFullscreenAt||0,now());});
    }
    function settle(result){if(current){const c=current;current=null;clearTimeout(c.timer);c.resolve({...result,earned:c.earned===true});}}
    async function init(){
      if(startPromise)return startPromise;
      startPromise=(async()=>{
        if(!admob)return false;
        for(const [name,fn] of [
          ['interstitialAdShowed',()=>{if(current&&current.kind==='interstitial'){current.shown=true;stamp();}}],
          ['interstitialAdDismissed',()=>{if(current&&current.kind==='interstitial')settle({shown:true});}],
          ['interstitialAdFailedToShow',()=>{if(current&&current.kind==='interstitial')settle({error:true});}],
          ['onRewardedVideoAdShowed',()=>{if(current&&current.kind==='rewarded'){current.shown=true;stamp();}}],
          ['onRewardedVideoAdReward',()=>{if(current&&current.kind==='rewarded')current.earned=true;}],
          ['onRewardedVideoAdDismissed',()=>{if(current&&current.kind==='rewarded')settle({shown:true});}],
          ['onRewardedVideoAdFailedToShow',()=>{if(current&&current.kind==='rewarded')settle({error:true});}]
        ])listeners.push(await admob.addListener(name,fn));
        return consentFlow(false);
      })().catch(()=>{report('Reklam eklentisi başlatılamadı. Oyuna devam edebilirsin.');return false;});
      return startPromise;
    }
    function beginRun(id){if(busy)return false;run={id,ended:false,revived:false,doubled:false,gold:0,interstitialAttempted:false};return true;}
    function endRun(id,gold){
      if(!run||run.id!==id||run.ended)return false;
      persist(a=>{a.completedRuns=Math.min(Number.MAX_SAFE_INTEGER,(a.completedRuns||0)+1);});
      run.ended=true;run.gold=Math.max(0,Math.floor(gold)||0);changed();return true;
    }
    function available(){return !!(admob&&initialized&&consent&&consent.canRequestAds&&!consentBusy&&!busy);}
    function cooldown(){const last=state().lastFullscreenAt||0;return (!last||now()-last>=180000)&&monotonic()-lastMonotonic>=180000;}
    function valid(id,phase){return !!(run&&run.id===id&&context(id,phase));}
    function adOptions(kind){
      const id=config.test?TEST_IDS[kind]:config[kind];
      if(!id)throw Error('MISSING_AD_ID');
      // v1.0 uses NPA for ALL users. UMP canRequestAds still gates every request.
      return {adId:id,isTesting:!!config.test,npa:true,immersiveMode:true};
    }
    async function bounded(promise,ms){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('AD_TIMEOUT')),ms);})]);}finally{clearTimeout(timer);}}
    async function show(kind,id,phase){
      busy=true;changed();
      try{
        const opts=adOptions(kind);
        await bounded(kind==='interstitial'?admob.prepareInterstitial(opts):admob.prepareRewardVideoAd(opts),20000);
        if(!valid(id,phase)||!consent||!consent.canRequestAds||(kind==='interstitial'&&(noAds()||!cooldown())))return {skipped:true};
        // Reserve the interval before entering the native UI; process restarts cannot bypass it.
        stamp();
        return await new Promise(resolve=>{
          current={kind,resolve,earned:false,shown:false,timer:setTimeout(()=>settle({error:true,timeout:true}),180000)};
          const showing=kind==='interstitial'?admob.showInterstitial({adId:opts.adId}):admob.showRewardVideoAd({adId:opts.adId});
          // Reward promise resolves before dismissal. Only the native Rewarded event grants.
          Promise.resolve(showing).catch(()=>settle({error:true}));
        });
      }catch(e){return {error:true};}
      finally{busy=false;changed();}
    }
    async function interstitial(id){
      if(!available()||!run||!run.ended||run.id!==id||run.interstitialAttempted||noAds()||state().completedRuns<=3||!cooldown()||!valid(id,'ended'))return false;
      run.interstitialAttempted=true;
      const result=await show('interstitial',id,'ended');
      if(result.error)report('Reklam yüklenemedi. Beklemeden devam edebilirsin.');
      return result.shown===true;
    }
    async function reward(kind,id){
      if(!run||run.id!==id||!['revive','double'].includes(kind))return false;
      const phase=kind==='revive'?'dead':'ended';
      if(!available()||!valid(id,phase)){report('Ödüllü reklam şu an hazır değil. İnternetini ve gizlilik tercihini kontrol et.');return false;}
      if(kind==='revive'&&(run.revived||run.ended)||kind==='double'&&(!run.ended||run.doubled||!run.gold))return false;
      const result=await show('rewarded',id,phase);
      if(!valid(id,phase))return false;
      if(result.error||!result.earned){report(result.error?'Reklam açılamadı. Ödül hakkın korunuyor.':'Reklam tamamlanmadığı için ödül verilmedi.');return false;}
      if(kind==='revive')run.revived=true;
      else{
        try{commit(d=>{const c=d.commerce||(d.commerce={});if(c.lastDoubledRun!==id){d.gold=(d.gold||0)+run.gold;c.lastDoubledRun=id;}});run.doubled=true;}
        catch(e){report('Ödül kaydedilemedi. Depolama alanını kontrol et.');return false;}
      }
      changed();return true;
    }
    async function dispose(){settle({error:true});await Promise.all(listeners.splice(0).map(l=>l.remove()));}
    return {init,beginRun,endRun,interstitial,reward,privacy:()=>consentFlow(true),retryConsent:()=>consentFlow(false),available,dispose,
      snapshot:()=>({busy,consentBusy,privacyRequired,canRequestAds:!!(consent&&consent.canRequestAds),run:run&&{...run},completedRuns:state().completedRuns||0})};
  }
  return {TEST_IDS,create};
});
