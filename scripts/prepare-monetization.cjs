'use strict';
const fs=require('fs'),path=require('path'),{parseEnv}=require('node:util');
const root=path.resolve(__dirname,'..');
function configuration(env){
  const test=env.MONETIZATION_MODE!=='production';
  const keys=['remove_ads','starter_pack','gold_small','gold_medium','gold_large'];
  const products=Object.fromEntries(keys.map(k=>[k,env['IAP_PRODUCT_'+k.toUpperCase()]||'']));
  if(Object.values(products).some(v=>v&&!/^[a-z0-9][a-z0-9_.]*$/.test(v)))throw Error('Invalid product ID format (values redacted).');
  const filled=Object.values(products).filter(Boolean);if(new Set(filled).size!==filled.length)throw Error('Product IDs must be unique.');
  const validatorUrl=env.IAP_VALIDATOR_URL||'';
  if(validatorUrl&&!/^https:\/\/[^\s]+$/.test(validatorUrl))throw Error('IAP_VALIDATOR_URL must use HTTPS.');
  const ids={app:env.ADMOB_APP_ID||'',interstitial:env.ADMOB_INTERSTITIAL_UNIT_ID||'',rewarded:env.ADMOB_REWARDED_UNIT_ID||''};
  if(ids.app&&!/^ca-app-pub-\d{16}~\d{10}$/.test(ids.app))throw Error('Invalid AdMob application ID (value redacted).');
  if(!test&&(filled.length!==5||!validatorUrl||!/^ca-app-pub-\d{16}~\d{10}$/.test(ids.app)||![ids.interstitial,ids.rewarded].every(x=>/^ca-app-pub-\d{16}\/\d{10}$/.test(x)&&!x.includes('3940256099942544'))))throw Error('Production configuration incomplete; no output written (values redacted).');
  // UMP messages belong to the configured app ID, even with demo ad UNITS.
  return {test,products,validatorUrl,interstitial:test?'':ids.interstitial,rewarded:test?'':ids.rewarded,testDevices:test?(env.ADMOB_TEST_DEVICE_IDS||'').split(',').map(s=>s.trim()).filter(Boolean):[],debugGeography:test&&env.UMP_TEST_EEA==='true'?1:0,appId:ids.app||'ca-app-pub-3940256099942544~3347511713'};
}
function prepare(){
  const envFile=path.join(root,'.env'),env={...(fs.existsSync(envFile)?parseEnv(fs.readFileSync(envFile,'utf8')):{}),...process.env};
  const cfg=configuration(env),{appId,...web}=cfg;
  fs.writeFileSync(path.join(root,'www/monetization-config.local.js'),'// GENERATED / IGNORED. Never commit.\nwindow.MAFIA_MONETIZATION_CONFIG='+JSON.stringify(web)+';\n');
  fs.writeFileSync(path.join(root,'monetization.local.properties'),'ADMOB_APP_ID='+appId+'\n');
  console.log(JSON.stringify({mode:cfg.test?'test':'production',productsConfigured:Object.values(cfg.products).filter(Boolean).length,validatorConfigured:!!cfg.validatorUrl,generated:2,androidSynced:false}));
}
if(require.main===module)try{prepare();}catch(e){console.error(e.message);process.exitCode=1;}
module.exports={configuration};
