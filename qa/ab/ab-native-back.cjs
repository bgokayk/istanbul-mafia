process.env.PORT=8804;
const {fs,out,server,launch,ev,start}=require('./ab-harness.cjs');
const assert=require('assert');
(async()=>{const b=await launch(),errors=[];try{
 const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__nativeEvents={};window.__exits=0;window.Capacitor={isNativePlatform:()=>true,Plugins:{App:{addListener:async(name,fn)=>{window.__nativeEvents[name]=fn;return{remove:async()=>{}};},exitApp:async()=>{window.__exits++;}}}};});
 await p.goto('http://127.0.0.1:8804');await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:out+'/before-menu.png'});
 await p.evaluate(()=>window.__nativeEvents.backButton());assert(await p.locator('#im-modal.on').isVisible());
 await p.locator('#im-no').click();assert.equal(await p.evaluate(()=>window.__exits),0);
 await p.evaluate(()=>window.__nativeEvents.backButton());await p.locator('#im-yes').click();assert.equal(await p.evaluate(()=>window.__exits),1);
 await start(p,'besiktas');await ev(p,'stopTutorial()');await p.locator('#ultHud').waitFor({state:'visible'});
 await ev(p,"for(let i=0;i<12;i++)spawnEnemy();");await p.screenshot({path:out+'/before-combat.png'});
 await p.keyboard.down('w');await p.evaluate(()=>window.__nativeEvents.backButton());
 const state=await ev(p,'({paused,keys:{...keys}})');assert(state.paused);assert(Object.values(state.keys).every(x=>!x));
 await p.evaluate(()=>window.__nativeEvents.backButton());assert(await ev(p,'paused'));
 assert.equal(errors.length,0);fs.writeFileSync(out+'/native-back.json',JSON.stringify({method:'Capacitor bridge mock; real registered callbacks and game UI',menuConfirm:true,cancelDoesNotExit:true,confirmedExit:true,gamePauses:true,repeatBackStaysPaused:true,inputReset:true,errors},null,2));
 }finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
