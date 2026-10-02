process.env.PORT=8804;const {fs,out,server,launch,ev,start}=require('./ab-harness.cjs');const assert=require('assert');
(async()=>{const b=await launch();try{const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await start(p);await ev(p,'stopTutorial();cancelAnimationFrame(raf2);resetInput();');
 await p.evaluate(()=>{window.__fx=[];new MutationObserver(records=>{for(const r of records){for(const n of r.addedNodes)if(n.classList?.contains('reward-burst'))n.__born=performance.now();for(const n of r.removedNodes)if(n.classList?.contains('reward-burst'))window.__fx.push({kind:n.dataset.kind,ms:performance.now()-n.__born});}}).observe(document.getElementById('app'),{childList:true});});
 await ev(p,"window.__tones=[];var savedTone=tone;tone=function(f,t,d,v,dl){window.__tones.push((d||.15)+(dl||0));return savedTone(f,t,d,v,dl);};");
 for(const [kind,code]of [['level','doLvlUp()'],['gold','sGold()'],['achievement',"unlockAch(ACHS.find(a=>!pdata.ach[a.id]&&a.id!=='p2w'&&a.id!=='secret2').id)"],['relic',"pdata.relics=[];selectedRelicId='heart';toggleSelectedRelic(true)"]]){
  await ev(p,code);await p.waitForFunction(kind=>window.__fx.some(x=>x.kind===kind),kind);
 }
 const result=await p.evaluate(()=>({effects:window.__fx,soundMaxSeconds:Math.max(...window.__tones)}));assert(result.effects.every(x=>x.ms<=600));assert(result.soundMaxSeconds<=.6);assert.equal(errors.length,0);result.errors=errors;fs.writeFileSync(out+'/feedback.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
