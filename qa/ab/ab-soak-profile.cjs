// Controlled hotspot probe, separate from real-time endurance acceptance.
const {fs,out,server,launch,ev,start}=require('./ab-harness.cjs');
(async()=>{const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),cdp=await page.context().newCDPSession(page);
  await start(page,'kapalicarsi');
  await ev(page,`cancelAnimationFrame(raf2);stopTutorial();resetInput();P._godMode=true;elapsed=540000;wave=31;enemies=[];orbs=[];goldOrbs=[];particles=[];for(var j=0;j<180;j++)spawnEnemy(ET[j%16]);P.weaps=[];P.dmg=0;lastT=performance.now();raf2=requestAnimationFrame(gloop);`);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await ev(page,`window.__profileFrames=[];window.__profileLast=0;var previousLoop=gloop;gloop=function(ts){if(__profileLast)__profileFrames.push(ts-__profileLast);__profileLast=ts;previousLoop(ts);};`);
  await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:1000});await cdp.send('Profiler.start');
  await page.waitForTimeout(20000);
  const {profile}=await cdp.send('Profiler.stop');
  fs.writeFileSync(out+'/late-game.cpuprofile',JSON.stringify(profile));
  const totals=new Map();for(const n of profile.nodes){const name=n.callFrame.functionName+' '+n.callFrame.url.split('/').at(-1)+':'+(n.callFrame.lineNumber+1);totals.set(name,(totals.get(name)||0)+(n.hitCount||0));}
  const frames=await page.evaluate(()=>__profileFrames.sort((a,b)=>a-b));
  const result={controlled:true,setup:'180 enemies, wave 31, weapons disabled, stationary invulnerable player; hotspot probe with profiler overhead, not endurance acceptance',fullFrame:{n:frames.length,p50:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)]},top:[...totals].sort((a,b)=>b[1]-a[1]).slice(0,35)};
  fs.writeFileSync(out+'/profile-summary.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
