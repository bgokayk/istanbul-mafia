/* Pixel category marks and brief, local feedback. No continuous screen effects. */
(function(){'use strict';
const paths={
hp:'M3 3h6v3h6V3h6v3h3v9h-3v3h-3v3h-3v3H9v-3H6v-3H3v-3H0V6h3z',
blade:'M18 1h5v5l-9 9 3 3-3 3-3-3-5 5-5-5 5-5-3-3 3-3 3 3z',
boot:'M3 2h8v10h4v3h6v7H3zM5 5v6h3V5z',
magnet:'M2 3h6v12h8V3h6v13h-3v4h-3v3H8v-3H5v-4H2z',
shield:'M2 2h20v13h-3v4h-4v3H9v-3H5v-4H2zM5 5v9h3v-9z',
coin:'M6 1h12v3h3v3h3v10h-3v4h-3v3H6v-3H3v-4H0V7h3V4h3zM8 5v14h3V5z',
bolt:'M12 1h9l-6 8h6L8 23l3-11H3z',
flame:'M12 1h3v6h3v3h3v9h-3v3H6v-3H3v-9h3V7h3v6h3z',
moon:'M10 1h6v3h-4v4H9v7h3v4h6v-3h4v6H6v-3H3v-4H0V8h3V4h7z',
 play:'M6 3h3v2h3v2h3v2h3v4h-3v2h-3v2H9v2H6z',
 shop:'M3 8h18v13H3zM7 8V3h10v5h-3V6h-4v2zM6 11v7h12v-7z',
 achievement:'M7 2h10v3h5v8h-5v3h-3v3h4v3H6v-3h4v-3H7v-3H2V5h5zM5 8v2h2V8zM17 8v2h2V8z',
 score:'M2 19h20v3H2zM4 12h4v5H4zM10 7h4v10h-4zM16 2h4v15h-4z',
 relic:'M7 2h10v3h3v3h3v4h-3v4h-3v3h-3v3h-4v-3H7v-3H4v-4H1V8h3V5h3zM8 6v8h3V6z',
 evo:'M9 1h6v3h-3v5h6v3h3v3h-3v3h-3v3H9v-3H6v-3H3v-3h3V9h3zM9 12v3h6v-3z',
 quest:'M4 2h16v20H4zM7 5v2h10V5zM7 10v2h10v-2zM7 15v2h7v-2z'
};
function icon(key){return '<svg class="category-icon" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges"><path fill="currentColor" fill-rule="evenodd" d="'+(paths[key]||paths.relic)+'"/></svg>';}
const entries=[['.mb-play','play','GECEYE KARIŞ','Karakterini seç · hayatta kal'],['.mb-shop','shop','DÜKKAN','Kalıcı güçlendirmeler'],['.mb-ach','achievement','BAŞARIM','İz bırak · ödül kazan'],['.mb-lb','score','SKOR','En iyi koşuların'],['[onclick*="relicScreen"].mbtn','relic','EKSTRA','Gücünü tamamla'],['[onclick*="evoGuideScreen"].mbtn','evo','EVRİM','Silah birleşimleri'],['[onclick*="questScreen"].mbtn','quest','GÖREVLER','Hedefini tamamla']];
for(const [selector,key,title,sub]of entries){const b=document.querySelector(selector);if(!b)continue;b.classList.add('mb-'+key);b.innerHTML=icon(key)+'<span class="button-copy"><strong>'+title+'</strong><small>'+sub+'</small></span>';}
const style=getComputedStyle(document.documentElement),colors={};for(const name of ['ink','gold','teal','ruby','violet'])colors[name]=style.getPropertyValue('--'+name).trim();
const last={};function reward(kind,label){const now=performance.now();if(last[kind]&&now-last[kind]<600)return;last[kind]=now;const previous=document.querySelector('.reward-burst[data-kind="'+kind+'"]');if(previous)previous.remove();const el=document.createElement('div');el.className='reward-burst';el.dataset.kind=kind;el.textContent=label;document.getElementById('app').appendChild(el);setTimeout(()=>el.remove(),540);}
function itemIcon(value){const pairs=[['❤💗💚💉💊🩹','hp'],['⚔🗡🔪🔫','blade'],['👟🚕','boot'],['🧲','magnet'],['🛡🔰🧿','shield'],['💰💱','coin'],['⚡📈','bolt'],['🔥🍾','flame'],['🌙🌕','moon']];const found=pairs.find(([symbols])=>value&&symbols.includes(value));return icon(found?found[1]:'relic');}
window.MafiaUI={icon,itemIcon,colors,reward};
})();
