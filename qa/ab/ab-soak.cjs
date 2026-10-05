// Controlled endurance benchmark; never present these runs as natural survival.
const { fs, path, root, out, server, launch, ev, start } = require('./ab-harness.cjs');
const { chooseUpgrade } = require('./ab-ui.cjs');
const crypto = require('crypto'), os = require('os');
const seconds = Number(process.env.QA_SECONDS || 900);
const rate = Number(process.env.QA_CPU_RATE || 1);
const maps = (process.env.QA_MAPS || 'kapalicarsi,uskudar,besiktas,eminonu').split(',');
const runCount = Number(process.env.QA_SOAK_RUNS || 2);
const warmup = Number(process.env.QA_WARMUP_SECONDS || 30);
const stat = values => { const a=values.slice().sort((x,y)=>x-y); return {n:a.length,p50:a[Math.floor(a.length*.5)]||0,p95:a[Math.max(0,Math.ceil(a.length*.95)-1)]||0,max:a.at(-1)||0}; };
function histStat(hist) { const n=hist.reduce((s,v)=>s+v,0); const percentile=q=>{let s=0;for(let i=0;i<hist.length;i++){s+=hist[i];if(s>=Math.ceil(n*q))return i/10;}return 0;}; return {n,p50:percentile(.5),p95:percentile(.95)}; }
const sourceHashes = Object.fromEntries(['index.html','world-ab.js','art-v2.js','release-ui.js','v2.css'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]));

async function run(browser,map,run) {
  const name=`${map}-${rate}x-${run}`;
  const result={map,run,cpuRate:rate,targetSeconds:seconds,warmupSeconds:warmup,sourceHashes,controlled:true,measurementVersion:3,
    diagnosticLayerIsolation:process.env.QA_DIAG==='1'||process.env.QA_DIAG_RESET==='1',
    qaHashes:Object.fromEntries(['ab-soak.cjs','ab-harness.cjs','ab-ui.cjs'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,f))).digest('hex')])),
    method:'Real wall time and requestAnimationFrame. QA-only god mode; Eminonu deadline extended in memory only. Keyboard movement and UI upgrades. Full-frame = rAF timestamp interval between actual gdraw calls (includes render pacing, not verified GPU presentation); skipped render callbacks cannot improve this metric. All gloop callback CPU durations also recorded. Fixed-size histograms. Game rAF briefly stopped across forced GC and retained heap read; checkpointPauseMs recorded. Next 3 drawn frame samples excluded and counted. No accelerated clock.',
    host:{cpu:os.cpus()[0].model,cores:os.cpus().length},browser:await browser.version(),concurrentMaps:maps.length,
    errors:[],failures:[],minutes:[],heap:[],peaks:{},clockStalls:[],maxClockStallSeconds:0};
  const ctx=await browser.newContext({viewport:{width:390,height:844}}),p=await ctx.newPage();
  p.setDefaultTimeout(12000);
  p.on('pageerror',e=>result.errors.push(e.stack));
  p.on('crash',()=>result.failures.push('renderer crash'));
  const cdp=await ctx.newCDPSession(p);
  let profiling=false;
  const watchdog=setTimeout(()=>{result.failures.push('wall watchdog');ctx.close().catch(()=>{});},(seconds*3+warmup+90)*1000);watchdog.unref();
  const save=()=>fs.writeFileSync(out+'/'+name+'.json',JSON.stringify(result,(key,value)=>key==='_hist'?undefined:value,2));
  try {
    await cdp.send('Emulation.setCPUThrottlingRate',{rate});
    await start(p,map);
    if(process.env.QA_PROMOTE_CANVAS==='1'){await p.addStyleTag({content:'#gc{transform:translateZ(0);}'});result.diagnosticCanvasLayer=true;}
    await ev(p,`cancelAnimationFrame(raf2);stopTutorial();resetInput();P._godMode=true;if(selMap.speedrun)selMap=Object.assign({},selMap,{speedrunTime:${seconds*3+warmup+120}});
      window.__soak={frames:new Uint32Array(20001),cpu:new Uint32Array(20001),peaks:{},maxFrame:0,maxCpu:0,skip:0,excludedFrames:0,previous:0,clockStalls:[],lastGame:elapsed,lastProgress:performance.now(),maxClockStall:0};
      window.__soakAnchor={x:P.x,y:P.y};
      var _soakDraw=gdraw;gdraw=function(){window.__soak.drew=true;return _soakDraw();};
      var _soakLoop=gloop;gloop=function(ts){const q=window.__soak,a=performance.now();q.drew=false;_soakLoop(ts);const cpu=performance.now()-a,frame=q.drew&&q.previous?ts-q.previous:0;if(q.drew)q.previous=ts;
        if(q.skip>0){if(q.drew){q.skip--;q.excludedFrames++;}}else{if(frame>0){q.frames[Math.min(20000,Math.round(frame*10))]++;q.maxFrame=Math.max(q.maxFrame,frame);}q.cpu[Math.min(20000,Math.round(cpu*10))]++;q.maxCpu=Math.max(q.maxCpu,cpu);}
        const counts={enemies:enemies.length,bullets:bullets.length,particles:particles.length,xpOrbs:orbs.length,goldOrbs:goldOrbs.length,healthOrbs:healthOrbs.length,chests:chests.length,floorItems:floorItems.length,floorIconCache:typeof floorIconCache==='undefined'?0:floorIconCache.size,projectileArtCache:typeof projectileArtCache==='undefined'?0:projectileArtCache.size,damageNumbers:dmgNums.length,rescueNpcs:rescueNpcs.length,artCache:MafiaArt.cache.size,floorTiles:MafiaArt.tiles.size};
        for(const k in counts)q.peaks[k]=Math.max(q.peaks[k]||0,counts[k]);
        if(elapsed!==q.lastGame){q.maxClockStall=Math.max(q.maxClockStall,a-q.lastProgress);q.lastProgress=a;q.lastGame=elapsed;}
      };lastT=performance.now();raf2=requestAnimationFrame(gloop);`);
    async function checkpoint(label,wallSeconds){
      const raw=await cdp.send('Runtime.getHeapUsage');
      // Stop game allocation between GC and the CDP read. Otherwise live frames
      // inflate the value labelled "retained", especially with parallel renderers.
      const stoppedAt=Date.now();await ev(p,'cancelAnimationFrame(raf2);__soak.skip=3');
      try{
        await cdp.send('HeapProfiler.collectGarbage');
        const retained=await cdp.send('Runtime.getHeapUsage'),dom=await cdp.send('Memory.getDOMCounters');
        const s=await ev(p,'({elapsed,wave,kills,level:P.lvl,orbs:orbs.length,enemies:enemies.length,artCache:MafiaArt.cache.size})');
        result.heap.push({label,wallSeconds,rawBytes:raw.usedSize,retainedBytes:retained.usedSize,backingStorageBytes:retained.backingStorageSize||null,dom,...s,checkpointPauseMs:Date.now()-stoppedAt});save();
        if(process.env.QA_HEAP_SNAPSHOTS==='1'&&['start','end'].includes(label)){
          const chunks=[],onChunk=event=>chunks.push(event.chunk);cdp.on('HeapProfiler.addHeapSnapshotChunk',onChunk);
          try{await cdp.send('HeapProfiler.takeHeapSnapshot',{reportProgress:false});fs.writeFileSync(out+'/'+name+'-'+label+'.heapsnapshot',chunks.join(''));}
          finally{cdp.off('HeapProfiler.addHeapSnapshotChunk',onChunk);}
        }
      }finally{await ev(p,'if(!paused&&!_runEnded){lastT=performance.now();raf2=requestAnimationFrame(gloop);}');}
    }
    await checkpoint('cold',0);
    let began=Date.now(),measuredStart=null,gameStart=0,lastDrain=0,nextHeap=300,held=[],lastElapsed=-1,lastProgress=Date.now(),diagPhase='full';
    while(true){
      let handledModal=false;
      if(await p.locator('#tutBtn').isVisible()){await p.locator('#tutBtn').click();handledModal=true;}
      if(await p.locator('#lvlup.on .luc').count())handledModal=(await chooseUpgrade(p))||handledModal;
      if(await p.locator('#bossChestOverlay').isVisible()){await p.locator('#bossChestOverlay button').first().click();handledModal=true;}
      if(handledModal){for(const k of held)await p.keyboard.up(k);held=[];}
      const s=await ev(p,`(()=>{const anchor=__soakAnchor,phase=elapsed/18000,tx=anchor.x+Math.cos(phase)*520,ty=anchor.y+Math.sin(phase)*520;
        let target={x:tx,y:ty},near=orbs.reduce((b,o)=>!b||d2(P,o)<d2(P,b)?o:b,null);if(near&&d2(P,near)<300*300)target=near;
        const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.707,.707],[.707,-.707],[-.707,.707],[-.707,-.707]];
        let choices=dirs.map(([x,y])=>({x,y,score:Math.hypot(target.x-P.x-x*70,target.y-P.y-y*70)+(WorldRules.free(worldObj,P.x+x*28,P.y+y*28,P.r+2)?0:10000)}));choices.sort((a,b)=>a.score-b.score);
        return {elapsed,wave,kills,hp:P.hp,level:P.lvl,end:_runEnded,paused,modal:modalOpen(),free:WorldRules.free(worldObj,P.x,P.y,P.r),direction:choices[0],peaks:__soak.peaks,clockStall:performance.now()-__soak.lastProgress,maxClockStall:__soak.maxClockStall};})()`);
      if(s.elapsed!==lastElapsed){lastElapsed=s.elapsed;lastProgress=Date.now();}
      const wall=(Date.now()-began)/1000;
      if(!measuredStart&&wall>=warmup){
        await checkpoint('start',0);measuredStart=Date.now();gameStart=result.heap.at(-1).elapsed;
        await ev(p,'__soak.frames.fill(0);__soak.cpu.fill(0);__soak.maxFrame=0;__soak.maxCpu=0;');
      }
      const measured=measuredStart?(Date.now()-measuredStart)/1000:0;
      if(process.env.QA_DIAG_RESET==='1'&&measured>=90&&!result.diagnosticCanvasReset){await ev(p,'gc.width=gc.width');result.diagnosticCanvasReset=measured;console.log(JSON.stringify({resetCanvasAt:measured}));}
      if(process.env.QA_DIAG==='1'){
        const layers=['floorItems','goldOrbs','orbs','particles','enemies','bullets','dmgNums','pickups','world'];
        const phase=process.env.QA_DIAG_LAYERS==='1'?(measured<90?'full':layers[Math.floor((measured-90)/15)]||'restored'):(measured<90?'full':measured<120?'no-canvas':measured<150?'no-hud':'restored');
        if(phase!==diagPhase){
          const raw=await ev(p,'(()=>{let q=__soak,r={frames:Array.from(q.frames),cpu:Array.from(q.cpu)};q.frames.fill(0);q.cpu.fill(0);return r;})()');
          (result.diagnosticPhases||=[]).push({phase:diagPhase,atSeconds:measured,frames:histStat(raw.frames),cpu:histStat(raw.cpu)});console.log(JSON.stringify({diagnostic:result.diagnosticPhases.at(-1)}));
          await ev(p,`window.__diagDraw=window.__diagDraw||gdraw;gdraw=${phase==='no-canvas'?'function(){__soak.drew=true;}':'__diagDraw'};document.getElementById('__qaHideHud')?.remove();${phase==='no-hud'?`var style=document.createElement('style');style.id='__qaHideHud';style.textContent='#infoBar,#xpBar,#hpWrap,#bossProgBar,#evoHint,#wepRow,#buffRow,#comboHud,#questTracker,#dailyTracker,#aaHud,#ultHud,#missionHud,#dmgFlash,#healFlash,#im-toast,#v2Dash{visibility:hidden!important}';document.head.appendChild(style);`:''}`);
          if(layers.includes(phase)){
            if(phase==='world')await ev(p,'gdraw=function(){const world=MafiaArt.world;MafiaArt.world=()=>{};try{__diagDraw();}finally{MafiaArt.world=world;}};');
            else{const names=phase==='pickups'?['healthOrbs','chests','rescueNpcs']:[phase];await ev(p,`gdraw=function(){const refs=[${names.join(',')}];${names.map(n=>n+'=[];').join('')}try{__diagDraw();}finally{${names.map((n,i)=>n+'=refs['+i+'];').join('')}}};`);}
          }
          diagPhase=phase;
        }
      }
      if(process.env.QA_PROFILE_FROM&&!profiling&&measured>=Number(process.env.QA_PROFILE_FROM)){
        await cdp.send('Profiler.enable');await cdp.send('Profiler.start');await cdp.send('Performance.enable');profiling=true;
        if(process.env.QA_TRACE==='1')await cdp.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});
      }
      result.progress={wallSeconds:wall,measuredSeconds:measured,gameSeconds:(s.elapsed-gameStart)/1000,wave:s.wave,kills:s.kills,level:s.level};
      result.peaks=s.peaks;result.maxClockStallSeconds=Math.max(result.maxClockStallSeconds,s.maxClockStall/1000);
      if(!s.free)result.failures.push('collision violation');
      if(s.end)result.failures.push('unexpected run end');
      if(Date.now()-lastProgress>15000){result.clockStalls.push({wallSeconds:wall,gameSeconds:s.elapsed/1000,modal:s.modal,paused:s.paused});result.failures.push('clock stalled for 15 seconds');}
      if(result.errors.length||result.failures.length)break;
      if(measuredStart&&measured>=nextHeap){await checkpoint(`${nextHeap/60}m`,measured);nextHeap+=300;}
      if(measuredStart&&(measured-lastDrain>=60||(measured>=seconds&&(s.elapsed-gameStart)>=seconds*1000))){
        const raw=await ev(p,'(()=>{const q=__soak,r={frames:Array.from(q.frames),cpu:Array.from(q.cpu),maxFrame:q.maxFrame,maxCpu:q.maxCpu,excludedFrames:q.excludedFrames};q.frames.fill(0);q.cpu.fill(0);q.maxFrame=0;q.maxCpu=0;return r;})()');
        result.minutes.push({fromSeconds:lastDrain,toSeconds:measured,fullFrameMs:{...histStat(raw.frames),max:raw.maxFrame},callbackMs:{...histStat(raw.cpu),max:raw.maxCpu},excludedFrames:raw.excludedFrames});
        if(process.env.QA_SNAPSHOT_SLOW==='1'&&measured>90&&result.minutes.at(-1).fullFrameMs.p95>33&&!result.slowScene){result.slowScene=name+'-slow-scene.json';fs.writeFileSync(out+'/'+result.slowScene,await ev(p,'JSON.stringify({P,selMap,enemies,bullets,particles,orbs,goldOrbs,healthOrbs,chests,floorItems,dmgNums,rescueNpcs,worldObj,elapsed,wave,screenShake,GW,GH,savedAt:Date.now(),canvasState:{transform:gctx.getTransform().toString(),alpha:gctx.globalAlpha,shadow:gctx.shadowBlur,composite:gctx.globalCompositeOperation}})'));}
        const hp=result._hist||(result._hist={frames:Array(20001).fill(0),cpu:Array(20001).fill(0)});raw.frames.forEach((v,i)=>hp.frames[i]+=v);raw.cpu.forEach((v,i)=>hp.cpu[i]+=v);
        lastDrain=measured;save();console.log(JSON.stringify({name,seconds:Math.round(measured),gameSeconds:Math.round((s.elapsed-gameStart)/1000),p95:result.minutes.at(-1).fullFrameMs.p95,peaks:s.peaks}));
      }
      if(measuredStart&&measured>=seconds&&(s.elapsed-gameStart)>=seconds*1000)break;
      const d=s.direction,desired=s.modal||s.paused?[]:[...(d.x>.1?['d']:d.x<-.1?['a']:[]),...(d.y>.1?['s']:d.y<-.1?['w']:[])];
      for(const k of held)if(!desired.includes(k))await p.keyboard.up(k);
      for(const k of desired)if(!held.includes(k))await p.keyboard.down(k);
      held=desired;
      await p.waitForTimeout(300);
    }
    for(const k of held)await p.keyboard.up(k);
    if(process.env.QA_DIAG==='1')fs.writeFileSync(out+'/'+name+'-scene.json',await ev(p,'JSON.stringify({P,selMap,enemies,bullets,particles,orbs,goldOrbs,healthOrbs,chests,floorItems,dmgNums,rescueNpcs,worldObj,elapsed,wave,screenShake,GW,GH,savedAt:Date.now(),canvasState:{transform:gctx.getTransform().toString(),alpha:gctx.globalAlpha,shadow:gctx.shadowBlur,composite:gctx.globalCompositeOperation}})'));
    if(profiling){const {profile}=await cdp.send('Profiler.stop');fs.writeFileSync(out+'/'+name+'.cpuprofile',JSON.stringify(profile));const totals=new Map();for(const n of profile.nodes){const key=n.callFrame.functionName+' '+n.callFrame.url.split('/').at(-1)+':'+(n.callFrame.lineNumber+1);totals.set(key,(totals.get(key)||0)+(n.hitCount||0));}fs.writeFileSync(out+'/'+name+'-profile.json',JSON.stringify({top:[...totals].sort((a,b)=>b[1]-a[1]).slice(0,45),metrics:(await cdp.send('Performance.getMetrics')).metrics},null,2));}
    if(profiling&&process.env.QA_TRACE==='1'){const end=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const {stream}=await end;let data='';for(;;){const part=await cdp.send('IO.read',{handle:stream});data+=part.data;if(part.eof)break;}await cdp.send('IO.close',{handle:stream});fs.writeFileSync(out+'/'+name+'-trace.json',data);}
    await checkpoint('end',result.progress.measuredSeconds);
    result.fullFrameMs=histStat(result._hist?.frames||[]);result.callbackMs=histStat(result._hist?.cpu||[]);delete result._hist;
    const base=result.heap.find(x=>x.label==='start'),end=result.heap.at(-1),ten=result.heap.find(x=>x.label==='10m');
    result.heapGrowth=base?(end.retainedBytes/base.retainedBytes-1):null;
    result.plateauLastFiveMinutes=ten?(end.retainedBytes/ten.retainedBytes-1):null;
    result.heapPass=result.heapGrowth!==null&&result.heapGrowth<.5&&(seconds<900||result.plateauLastFiveMinutes!==null&&result.plateauLastFiveMinutes<=.1);
    result.over33msWindows=result.minutes.filter(x=>x.fullFrameMs.p95>33).map(x=>({fromSeconds:x.fromSeconds,toSeconds:x.toSeconds,p95:x.fullFrameMs.p95}));
    result.complete=result.progress.measuredSeconds>=seconds&&result.progress.gameSeconds>=seconds;
    result.pass=!result.diagnosticLayerIsolation&&result.complete&&!result.errors.length&&!result.failures.length&&result.heapPass&&(rate!==4||result.fullFrameMs.p95<=33);
    await p.screenshot({path:out+'/'+name+'.png'});
  }catch(e){result.failures.push(e.stack);result.pass=false;}
  finally{delete result._hist;clearTimeout(watchdog);save();await ctx.close().catch(()=>{});}
  console.log(JSON.stringify({name,pass:result.pass,complete:result.complete,heapGrowth:result.heapGrowth,plateau:result.plateauLastFiveMinutes,p95:result.fullFrameMs?.p95,errors:result.errors,failures:result.failures}));
  return result;
}
(async()=>{const b=await launch(),results=[];try{for(let i=1;i<=runCount;i++)results.push(...await Promise.all(maps.map(map=>run(b,map,i))));fs.writeFileSync(out+'/summary.json',JSON.stringify(results,null,2));if(results.some(r=>!r.pass))process.exitCode=1;}finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
