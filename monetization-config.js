// Safe source defaults. Native builds may override using the ignored .local.js
// generated from .env by scripts/prepare-monetization.cjs. Never put real IDs here.
window.MAFIA_MONETIZATION_CONFIG=window.MAFIA_MONETIZATION_CONFIG||{
  test:true,products:{remove_ads:'',starter_pack:'',gold_small:'',gold_medium:'',gold_large:''},
  validatorUrl:'',interstitial:'',rewarded:'',testDevices:[],debugGeography:0
};
