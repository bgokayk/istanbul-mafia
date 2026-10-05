(function(){'use strict';
  const icons={shield:'M3 2h10v8l-5 5-5-5z M6 5v4l2 2 2-2V5',gift:'M2 6h12v8H2z M1 3h14v3H1z M8 3v11 M8 3H4V1h3z M8 3h4V1H9z',gold:'M4 2h8v2h2v8h-2v2H4v-2H2V4h2z M6 5h4v6H6z'};
  function icon(name){return '<svg class="store-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="'+icons[name]+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="miter"/></svg>';}
  window.MafiaCommerceUI={mount:function(game){
    const cap=window.Capacitor,native=!!(cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.getPlatform()==='android');
    let iap,ads,booting=native,reviveId=null,endingId=null;
    function notice(text){const status=document.getElementById('storeStatus');if(status)status.textContent=text;const msg=document.getElementById('adMessage');if(msg)msg.textContent=text;game.toast(text);}
    function render(){
      if(!iap)return;
      const list=document.getElementById('storeList');list.replaceChildren();
      for(const p of iap.details()){
        const card=document.createElement('article');card.className='store-card';card.dataset.product=p.key;card.innerHTML=icon(p.icon)+'<div><h2></h2><p></p><button type="button"></button></div>';
        card.querySelector('h2').textContent=p.title;card.querySelector('p').textContent=p.description;
        const btn=card.querySelector('button');btn.disabled=!p.canPurchase||!!(ads&&ads.snapshot().busy);
        btn.textContent=p.owned&&p.type==='non-consumable'?'SAHİPSİN':p.price?p.price+' · SATIN AL':'FİYAT BEKLENİYOR';
        btn.onclick=()=>{game.reset();iap.buy(p.key);};list.appendChild(card);
      }
      document.getElementById('storeStatus').textContent=iap.snapshot().status;
      document.getElementById('storeRestore').disabled=!iap.snapshot().ready||iap.snapshot().busy;
      document.documentElement.classList.toggle('starter-owned',iap.owned('starter_pack'));
      if(ads){
        const s=ads.snapshot();document.getElementById('storePrivacy').hidden=!s.privacyRequired;
        document.getElementById('storeConsentRetry').hidden=s.canRequestAds||!native;
        document.getElementById('storePrivacy').disabled=s.busy||s.consentBusy;
        document.getElementById('storeConsentRetry').disabled=s.busy||s.consentBusy;
        for(const id of ['adReviveWatch','adReviveSkip','rsContinueBtn','rsShareBtn','doubleGoldBtn'])document.getElementById(id).disabled=s.busy;
        if(s.run&&s.run.doubled){document.getElementById('doubleGoldBtn').disabled=true;document.getElementById('doubleGoldNote').textContent='+'+s.run.gold+' altın teslim edildi. Bu turun altını ikiye katlandı.';}
      }
      game.refresh();
    }
    function bind(config,purchase,admob){
      iap=MafiaIAP.create({purchase,config,read:game.read,commit:game.commit,changed:render,notify:notice});
      ads=MafiaAds.create({admob,config,read:game.read,commit:game.commit,changed:render,notify:notice,context:game.context});
      render();
    }
    bind(window.MAFIA_MONETIZATION_CONFIG,null,null);
    document.getElementById('storeRestore').onclick=()=>iap.restore();
    document.getElementById('storePrivacy').onclick=()=>ads.privacy();
    document.getElementById('storeConsentRetry').onclick=()=>ads.retryConsent();
    document.getElementById('adReviveSkip').onclick=()=>{if(ads.snapshot().busy)return;document.getElementById('adRevive').style.display='none';game.finishDeath();};
    document.getElementById('adReviveWatch').onclick=async()=>{
      game.reset();const id=reviveId,ok=await ads.reward('revive',id);
      if(ok){document.getElementById('adRevive').style.display='none';game.revive(id);}
    };
    document.getElementById('doubleGoldBtn').onclick=async()=>{game.reset();if(await ads.reward('double',endingId))notice('Tur altını ikiye katlandı.');};
    const ready=(async()=>{
      if(!native)return;
      await new Promise(resolve=>{const s=document.createElement('script');s.src='monetization-config.local.js';s.onload=resolve;s.onerror=resolve;document.head.appendChild(s);});
      if(!window.CdvPurchase)await new Promise(resolve=>{
        const done=()=>{clearTimeout(timer);document.removeEventListener('deviceready',done);resolve();};
        const timer=setTimeout(done,10000);document.addEventListener('deviceready',done,{once:true});
      });
      const admob=cap.registerPlugin?cap.registerPlugin('AdMob'):cap.Plugins&&cap.Plugins.AdMob;
      bind(window.MAFIA_MONETIZATION_CONFIG,window.CdvPurchase,admob);
      // Consent has priority over all advertising. Product lookup doesn't load ads.
      const iapReady=iap.init();await ads.init();booting=false;await iapReady;
    })().catch(()=>notice('Mağaza bağlantısı kurulamadı. Oyun oynamaya devam edebilirsin.')).finally(()=>{booting=false;render();});
    return {ready,render,isBusy:()=>booting||ads.snapshot().busy,
      beginRun:id=>{reviveId=null;endingId=null;document.getElementById('adRevive').style.display='none';return ads.beginRun(id);},
      canRevive:()=>ads.available()&&ads.snapshot().run&&!ads.snapshot().run.revived,
      offerRevive:id=>{reviveId=id;document.getElementById('adMessage').textContent='İsteğe bağlı: Reklamı tamamla, %50 can ve 3 saniye korumayla bir kez geri dön.';document.getElementById('adRevive').style.display='flex';render();},
      endRun:(id,gold)=>{endingId=id;ads.endRun(id,gold);const wrap=document.getElementById('doubleGoldWrap');wrap.hidden=gold<=0||!native;document.getElementById('doubleGoldNote').textContent='İsteğe bağlı: Reklamı tamamla, bu tur kazandığın '+gold+' altına '+gold+' altın daha ekle.';document.getElementById('doubleGoldBtn').disabled=false;},
      continueAfterRun:async next=>{if(ads.snapshot().busy)return;await ads.interstitial(endingId);next();},
      cancelRevive:()=>{if(reviveId&&!ads.snapshot().busy){document.getElementById('adReviveSkip').click();return true;}return false;}
    };
  }};
})();
