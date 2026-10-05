'use strict';
function bridge(owned){
  const state=window.sdkFixture={purchases:owned||[],events:[],mode:'success',serial:10};let listener;
  const post=(type,data)=>listener({type,data});
  window.cordova={platformId:'android',exec(success,fail,service,action,args){
    state.events.push(action);
    switch(action){
      case 'setListener':listener=success;return;
      case 'init':success();return;
      case 'getStorefront':success('DE');return;
      case 'getAvailableProducts':success(args[0].map(productId=>({productId,title:productId,description:'QA catalogue',product_format:'v12.0',product_type:'inapp',offers:[{offer_id:'',offer_token:'qa-offer',formatted_price:'€2,49',price_amount_micros:2490000,price_currency_code:'EUR'}]})));return;
      case 'getPurchases':post('setPurchases',{purchases:structuredClone(state.purchases.filter(p=>!p.consumed))});success();return;
      case 'buy':{
        if(state.mode==='cancel'){fail(window.CdvPurchase.ErrorCode.PAYMENT_CANCELLED+'|cancel');return;}
        if(state.mode==='error'){fail(window.CdvPurchase.ErrorCode.PAYMENT_NOT_ALLOWED+'|denied');return;}
        const id=args[0].split('@')[0],serial=++state.serial;
        const p={productIds:[id],orderId:'qa-order-'+serial,purchaseToken:'qa-token-'+serial,purchaseTime:Date.now(),getPurchaseState:state.mode==='pending'?2:1,purchaseState:0,acknowledged:false,consumed:false,quantity:1,signature:'qa-signature'};
        p.receipt=JSON.stringify(p);state.purchases.push(p);success();post('purchasesUpdated',{purchases:structuredClone(state.purchases.filter(p=>!p.consumed))});return;
      }
      case 'acknowledgePurchase':{const p=state.purchases.find(p=>p.purchaseToken===args[0]);p.acknowledged=true;success();return;}
      case 'consumePurchase':{if(state.mode==='finish-error'){fail('6777000|finish error');return;}const p=state.purchases.find(p=>p.purchaseToken===args[0]);p.consumed=true;post('purchaseConsumed',{purchase:structuredClone(p)});success();return;}
      default:fail('Unsupported QA action '+action);
    }
  }};
}
module.exports={bridge};
