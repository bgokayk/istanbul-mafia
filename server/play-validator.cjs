'use strict';
// Run behind HTTPS. Google credentials remain on this server, never in the APK.
const fs=require('fs'),http=require('http'),crypto=require('crypto'),path=require('path'),{parseEnv}=require('node:util');
const KEYS=['remove_ads','starter_pack','gold_small','gold_medium','gold_large'];
function settings(env){
  const products=Object.fromEntries(KEYS.map(k=>[k,env['IAP_PRODUCT_'+k.toUpperCase()]||'']));
  if(Object.values(products).some(v=>!v)||new Set(Object.values(products)).size!==5)throw Error('Five distinct Play product IDs required (values redacted).');
  const packageName=env.PLAY_PACKAGE_NAME||'com.lumenco.istanbulmafia';
  if(!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName))throw Error('Invalid package name.');
  return {products,packageName,testOnly:env.PLAY_TEST_PURCHASES_ONLY!=='false'};
}
function publisherQuery(env,config){
  const filename=env.GOOGLE_APPLICATION_CREDENTIALS;
  if(!filename)throw Error('GOOGLE_APPLICATION_CREDENTIALS required on validator server.');
  const account=JSON.parse(fs.readFileSync(filename,'utf8'));
  if(account.type!=='service_account'||!account.client_email||!account.private_key)throw Error('Invalid service account file.');
  let cachedToken=null,expires=0,loading=null;
  async function token(){
    if(cachedToken&&Date.now()<expires)return cachedToken;
    if(loading)return loading;
    loading=(async()=>{
      const seconds=Math.floor(Date.now()/1000),b64=s=>Buffer.from(JSON.stringify(s)).toString('base64url');
      const unsigned=b64({alg:'RS256',typ:'JWT'})+'.'+b64({iss:account.client_email,scope:'https://www.googleapis.com/auth/androidpublisher',aud:'https://oauth2.googleapis.com/token',iat:seconds,exp:seconds+3600});
      const signature=crypto.sign('RSA-SHA256',Buffer.from(unsigned),account.private_key).toString('base64url');
      const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:unsigned+'.'+signature}),signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw Error('GOOGLE_AUTH_FAILED');
      const data=await response.json();if(!data.access_token)throw Error('GOOGLE_AUTH_FAILED');
      cachedToken=data.access_token;expires=Date.now()+Math.min(Number(data.expires_in)||3600,3600)*1000-60000;return cachedToken;
    })();try{return await loading;}finally{loading=null;}
  }
  return async purchaseToken=>{
    const auth=await token();
    const url='https://androidpublisher.googleapis.com/androidpublisher/v3/applications/'+encodeURIComponent(config.packageName)+'/purchases/productsv2/tokens/'+encodeURIComponent(purchaseToken);
    const response=await fetch(url,{headers:{Authorization:'Bearer '+auth},signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('GOOGLE_QUERY_FAILED');
    return response.json();
  };
}
function createValidator(config,query){
  return async body=>{
    const failure=message=>({ok:false,message});
    const tx=body&&body.transaction,logical=body&&KEYS.find(k=>config.products[k]===body.id);
    if(!logical||!tx||tx.type!=='android-playstore'||typeof tx.purchaseToken!=='string'||tx.purchaseToken.length<8||tx.purchaseToken.length>4096)return failure('Geçersiz satın alma isteği.');
    try{
      const purchase=await query(tx.purchaseToken);
      const lines=purchase.productLineItem||[],item=lines.find(x=>x.productId===body.id),state=purchase.purchaseStateContext&&purchase.purchaseStateContext.purchaseState;
      // Package is fixed in the Google request; product, status, quantity and token are server checked.
      if(lines.length!==1||!item||!['PURCHASED','CANCELLED'].includes(state))return failure('Satın alma tamamlanmamış veya ürün eşleşmiyor.');
      if(config.testOnly&&!purchase.testPurchaseContext)return failure('Bu kurulum yalnız lisans test satın alımlarını kabul eder.');
      const offer=item.productOfferDetails||{},quantity=offer.quantity??1;
      if(!Number.isSafeInteger(quantity)||quantity<1||quantity>100||(!logical.startsWith('gold_')&&quantity!==1))return failure('Geçersiz ürün adedi.');
      const purchaseId=crypto.createHash('sha256').update(config.packageName+'\0'+tx.purchaseToken).digest('hex');
      // SDK transaction matching uses Google's order ID (or token when Google has no order).
      // The persistent delivery ledger uses only the one-way purchaseId, never the token.
      const entry={id:body.id,purchaseId,transactionId:purchase.orderId||tx.purchaseToken,quantity,purchaseDate:Date.parse(purchase.purchaseCompletionTime)||0,isExpired:state==='CANCELLED',isConsumed:offer.consumptionState==='CONSUMPTION_STATE_CONSUMED',isAcknowledged:purchase.acknowledgementState==='ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED'};
      return {ok:true,data:{id:purchaseId,latest_receipt:true,date:new Date().toISOString(),collection:[entry],transaction:{type:'android-playstore',kind:'androidpublisher#productPurchase',purchaseState:state==='PURCHASED'?0:1,consumptionState:entry.isConsumed?1:0,acknowledgementState:entry.isAcknowledged?1:0}}};
    }catch(e){return failure('Google Play doğrulaması şu an yapılamıyor. Daha sonra tekrar dene.');}
  };
}
function createServer(validate,origins){
  const limits=new Map();
  return http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');res.setHeader('X-Content-Type-Options','nosniff');
    const origin=req.headers.origin;
    if(origin&&!origins.includes(origin)){res.writeHead(403).end('{}');return;}
    if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
    if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','POST');res.writeHead(204).end();return;}
    if(req.url!=='/v1/verify'||req.method!=='POST'){res.writeHead(404).end('{}');return;}
    const key=req.socket.remoteAddress,time=Date.now();
    for(const [k,v]of limits)if(time-v.start>60000)limits.delete(k);
    const rate=limits.get(key)||{start:time,count:0};if(++rate.count>120||limits.size>5000){res.writeHead(429).end('{}');return;}limits.set(key,rate);
    let body='',size=0;
    try{
      for await(const chunk of req){size+=chunk.length;if(size>16384){res.writeHead(413).end('{}');return;}body+=chunk.toString('utf8');}
      const result=await validate(JSON.parse(body));res.end(JSON.stringify(result));
    }catch(e){res.writeHead(400).end(JSON.stringify({ok:false,message:'Geçersiz istek.'}));}
  });
}
if(require.main===module){
  try{
    const envPath=path.resolve(__dirname,'../.env'),env={...(fs.existsSync(envPath)?parseEnv(fs.readFileSync(envPath,'utf8')):{}),...process.env};
    const config=settings(env),query=publisherQuery(env,config),server=createServer(createValidator(config,query),(env.PLAY_VALIDATOR_ORIGINS||'https://localhost').split(',').map(v=>v.trim()));
    server.requestTimeout=25000;server.headersTimeout=10000;
    server.listen(Number(env.PLAY_VALIDATOR_PORT)||8850,'127.0.0.1',()=>console.log('Play validator listening on loopback; configure HTTPS reverse proxy. Receipt logging disabled.'));
  }catch(e){console.error('Validator not started: '+e.message);process.exitCode=1;}
}
module.exports={settings,createValidator,createServer};
