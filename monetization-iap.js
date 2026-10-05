(function(root,factory){'use strict';if(typeof module==='object'&&module.exports)module.exports=factory();else root.MafiaIAP=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const CATALOG=Object.freeze([
    {key:'remove_ads',type:'non-consumable',title:'GEÇİŞ REKLAMLARINI KALDIR',description:'Tek seferlik. Tur sonu geçiş reklamları kapanır. Ödüllü reklamlar isteğe bağlı kalır.',gold:0,icon:'shield'},
    {key:'starter_pack',type:'non-consumable',title:'BAŞLANGIÇ PAKETİ',description:'Tek seferlik 2.000 altın ve kalıcı altın karakter çerçevesi.',gold:2000,icon:'gift'},
    {key:'gold_small',type:'consumable',title:'KÜÇÜK ALTIN PAKETİ',description:'4.000 altın. Dükkânda kalıcı güçlendirmeler için.',gold:4000,icon:'gold'},
    {key:'gold_medium',type:'consumable',title:'ORTA ALTIN PAKETİ',description:'12.000 altın. Her satın alımda bir kez teslim edilir.',gold:12000,icon:'gold'},
    {key:'gold_large',type:'consumable',title:'BÜYÜK ALTIN PAKETİ',description:'30.000 altın. Her satın alımda bir kez teslim edilir.',gold:30000,icon:'gold'}
  ]);
  function create(options){
    const {purchase:cp,config,read,commit}=options;
    const changed=options.changed||function(){},notify=options.notify||function(){};
    const store=cp&&cp.store,platform=cp&&cp.Platform.GOOGLE_PLAY;
    let ready=false,busy=false,started=false,status='Mağaza Google Play uygulamasında kullanılabilir.',pending=null;
    let verifying=new WeakSet(),restoreFailed=false,queryReady=false,errorGeneration=0;
    const processing=new WeakSet(),validationWaiters=new Set(),finishWaiters=new Set();
    function say(message){status=message;changed();notify(message);}
    function state(){return read().commerce||{};}
    function owned(key){return !!(state().entitlements||{})[key];}
    function details(){return CATALOG.map(p=>{
      const product=store&&config.products[p.key]&&store.get(config.products[p.key],platform),offer=product&&product.getOffer();
      const price=offer&&offer.pricingPhases&&offer.pricingPhases[0]&&offer.pricingPhases[0].price;
      return {...p,price:price||null,owned:owned(p.key),canPurchase:!!(ready&&!busy&&offer&&offer.canPurchase&&price&&!(p.type==='non-consumable'&&owned(p.key)))};
    });}
    function fail(message){errorGeneration++;restoreFailed=true;busy=false;pending=null;say(message);}
    function onError(error){
      if(error&&error.code===cp.ErrorCode.PAYMENT_CANCELLED){busy=false;pending=null;say('Satın alma iptal edildi. Herhangi bir ürün verilmedi.');return;}
      fail('Satın alma tamamlanamadı. Bağlantını kontrol edip geri yüklemeyi dene; onaylı ödeme tekrar ücretlendirilmez.');
    }
    function eligible(receipt){return receipt&&(receipt.transactions||[]).some(t=>t.state===cp.TransactionState.APPROVED||t.state===cp.TransactionState.FINISHED);}
    function verify(receipt){
      if(!eligible(receipt)||verifying.has(receipt))return;
      verifying.add(receipt);
      try{receipt.verify();}catch(e){fail('Satın alma doğrulanamadı. Bağlantını kontrol edip geri yüklemeyi dene.');}
    }
    function paymentPending(){busy=false;pending=null;say('Ödeme Google Play onayını bekliyor. Onaylanmadan ürün verilmez.');}
    function hasFinished(receipt){return receipt.sourceReceipt.transactions.every(t=>{
      if(t.state===cp.TransactionState.FINISHED)return true;
      return (t.products||[]).every(x=>{const p=CATALOG.find(p=>config.products[p.key]===x.id);return p&&(p.type==='consumable'?t.isConsumed:t.isAcknowledged);});
    });}
    async function finishReceipt(receipt){
      // In 13.18 store.finish() dispatches native calls without awaiting their result.
      // Wait for actual receipt state / finished event before reporting success.
      let timer,check,resolveWait,rejectWait;
      const wait=new Promise((resolve,reject)=>{resolveWait=resolve;rejectWait=reject;});
      check=()=>{if(hasFinished(receipt))resolveWait();};finishWaiters.add(check);
      timer=setTimeout(()=>rejectWait(Error('FINISH_TIMEOUT')),options.finishTimeoutMs||15000);
      try{await receipt.finish();check();await wait;}finally{clearTimeout(timer);finishWaiters.delete(check);}
    }
    async function verified(receipt){
      if(processing.has(receipt))return;
      processing.add(receipt);
      try{
        const grants=(receipt.collection||[]).map(item=>({item,product:CATALOG.find(p=>config.products[p.key]===item.id)}));
        if(!grants.length||grants.some(g=>!g.product||!g.item.transactionId||!Number.isSafeInteger(g.item.quantity??1)||(g.item.quantity??1)<1))throw Error('INVALID_RECEIPT');
        commit(draft=>{
          const c=draft.commerce||(draft.commerce={});c.entitlements=c.entitlements||{};c.delivered=c.delivered||{};
          for(const {item,product:p} of grants){
            if(item.isExpired){delete c.entitlements[p.key];continue;}
            const q=item.quantity??1;
            if(p.type==='non-consumable')c.entitlements[p.key]=true;
            const id=p.type==='non-consumable'?p.key:(item.purchaseId||item.transactionId);
            if(!c.delivered[id]&&!item.isConsumed){
              draft.gold=(draft.gold||0)+p.gold*q;
              // Receipt and balance are written in ONE localStorage write. No finish on storage failure.
              c.delivered[id]={key:p.key,at:Date.now()};
            }
          }
          c.lastVerifiedAt=Date.now();
        });
        changed();
        // Google Play adapter consumes consumables / acknowledges non-consumables here.
        const beforeFinish=errorGeneration;
        await finishReceipt(receipt);
        if(beforeFinish!==errorGeneration)throw Error('FINISH_FAILED');
        busy=false;pending=null;
        say('Satın alma doğrulandı ve teslim edildi.');
      }catch(e){verifying.delete(receipt.sourceReceipt);fail('Teslim kaydedilemedi veya ödeme tamamlanamadı. Geri yüklemeyi dene; aynı ödeme iki kez teslim edilmez.');}
      finally{processing.delete(receipt);for(const done of validationWaiters)done();}
    }
    async function init(){
      if(started)return;started=true;
      if(!store){changed();return;}
      if(!config.validatorUrl||!/^https:\/\//.test(config.validatorUrl)||CATALOG.some(p=>!config.products[p.key])){
        say('Mağaza henüz yapılandırılmadı. Google Play ürünleri ve güvenli doğrulama servisi gerekli.');return;
      }
      status='Google Play ürünleri yükleniyor…';changed();
      store.verbosity=cp.LogLevel.ERROR;
      // Send only the receipt needed for validation, no product catalogue or device fingerprint.
      store.validator=function(body,callback){
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
        (options.fetch||fetch)(config.validatorUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:body.id,transaction:{type:body.transaction.type,purchaseToken:body.transaction.purchaseToken}}),signal:controller.signal,credentials:'omit'})
          .then(async response=>{if(!response.ok)throw Error('VALIDATOR_UNAVAILABLE');const result=await response.json();if(typeof result.ok!=='boolean')throw Error('INVALID_VALIDATOR');callback(result);})
          .catch(()=>callback({ok:false,code:cp.ErrorCode.COMMUNICATION,message:'Doğrulama servisine ulaşılamadı.'}))
          .finally(()=>clearTimeout(timer));
      };
      store.register(CATALOG.map(p=>({id:config.products[p.key],type:p.type==='consumable'?cp.ProductType.CONSUMABLE:cp.ProductType.NON_CONSUMABLE,platform})));
      store.error(onError);
      store.when().productUpdated(changed)
        .approved(transaction=>{status='Ödeme onaylandı; doğrulanıyor…';changed();verify(transaction.parentReceipt);})
        .receiptUpdated(receipt=>{for(const check of finishWaiters)check();if((receipt.transactions||[]).some(t=>t.isPending))paymentPending();else verify(receipt);})
        .initiated(transaction=>{if(transaction.isPending)paymentPending();})
        .pending(paymentPending)
        .verified(verified)
        .unverified(result=>{if(result&&result.receipt)verifying.delete(result.receipt);fail('Ödeme doğrulanamadı. Ürün verilmedi; geri yükleyerek tekrar deneyebilirsin.');for(const done of validationWaiters)done();})
        .finished(()=>{for(const check of finishWaiters)check();changed();})
        .receiptsReady(()=>{queryReady=true;changed();});
      try{
        const errors=await store.initialize([platform]);
        if(errors&&errors.length){onError(errors[0]);return;}
        ready=true;
        await restore(false);
      }catch(e){fail('Google Play mağazasına bağlanılamadı. Daha sonra geri yüklemeyi dene.');}
    }
    async function buy(key){
      const item=details().find(p=>p.key===key);
      if(!item||!item.canPurchase){say('Ürün veya yerel fiyat henüz hazır değil. Google Play bağlantısını yenile.');return false;}
      busy=true;pending=key;say('Google Play satın alma ekranı açılıyor…');
      try{
        const result=await store.get(config.products[key],platform).getOffer().order();
        if(result&&result.isError){onError(result);return false;}
        return true;
      }catch(e){onError(e);return false;}
    }
    async function restore(announce=true){
      if(!ready||busy){if(announce)say('Mağaza henüz hazır değil. Bağlantını kontrol et.');return false;}
      busy=true;restoreFailed=false;verifying=new WeakSet();say('Google Play satın alımları sorgulanıyor…');
      try{
        const error=await store.restorePurchases();if(error&&error.isError)throw error;
        const receipts=store.localReceipts.filter(r=>r.platform===platform&&eligible(r));
        // A successful Play query is authoritative for absent permanent purchases.
        if(queryReady){
          const present=new Set(receipts.flatMap(r=>r.transactions||[]).filter(t=>t.state!==cp.TransactionState.CANCELLED).flatMap(t=>(t.products||[]).map(p=>p.id)));
          commit(d=>{const c=d.commerce||(d.commerce={});c.entitlements=c.entitlements||{};for(const p of CATALOG.filter(p=>p.type==='non-consumable'))if(!present.has(config.products[p.key]))delete c.entitlements[p.key];});
        }
        if(receipts.length){
          // Resolve on validation events, never label the native query alone as completed restore.
          const completed=new Set();let timer,finishWait;
          const wait=new Promise((resolve,reject)=>{finishWait=()=>{
            for(const r of receipts)if(store.verifiedReceipts.some(v=>v.sourceReceipt===r&&v.validationDate&&Date.now()-v.validationDate.getTime()<20000))completed.add(r);
            if(restoreFailed){clearTimeout(timer);reject(Error('UNVERIFIED'));}
            else if(completed.size===receipts.length){clearTimeout(timer);resolve();}
          };validationWaiters.add(finishWait);timer=setTimeout(()=>reject(Error('VERIFY_TIMEOUT')),20000);});
          receipts.forEach(verify);
          try{await wait;}finally{clearTimeout(timer);validationWaiters.delete(finishWait);}
        }
        if(restoreFailed)throw Error('RESTORE_FAILED');
        say(announce?'Satın alımlar geri yüklendi. Tüketilen altın paketleri tekrar verilmez.':'Google Play mağazası hazır.');
        return true;
      }catch(e){fail('Geri yükleme tamamlanamadı. İnternetini ve satın aldığın Google Play hesabını kontrol et.');return false;}
      finally{busy=false;changed();}
    }
    return {init,buy,restore,details,owned,snapshot:()=>({ready,busy,status,pending})};
  }
  return {CATALOG,create};
});
