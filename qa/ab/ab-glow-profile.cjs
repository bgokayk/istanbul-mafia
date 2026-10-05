// Render-only isolation: same frozen scene, compare each expensive layer.
const {fs,out,server,launch,ev,start}=require('./ab-harness.cjs');
(async()=>{const b=await launch(),results=[];try{const p=await b.newPage({viewport:{width:390,height:844}}),cdp=await p.context().newCDPSession(p);await start(p,'kapalicarsi');await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await ev(p,`cancelAnimationFrame(raf2);stopTutorial();resetInput();screenShake=0;enemies=[];particles=[];bullets=[];orbs=[];goldOrbs=[];for(let j=0;j<300;j++)orbs.push({x:P.x-180+j%20*18,y:P.y-300+Math.floor(j/20)*40,r:6,col:'#00ff88'});window.__probeOrbs=orbs;`);
 if(process.env.QA_HUD_PROBE==='1')await ev(p,'P.weaps=[];P._godMode=true;spawnT=0;');
 if(process.env.QA_DAMAGE_PROBE==='1')await ev(p,`dmgNums=Array.from({length:30},(_,j)=>({x:P.x-150+j%10*30,y:P.y-100+Math.floor(j/10)*80,born:Date.now(),val:300+j}));window.__probeDamage=dmgNums;`);
 for(const mode of ['full','no-orbs','full']){
  const r=await ev(p,`new Promise(resolve=>{orbs=${mode==='no-orbs'?'[]':'__probeOrbs'};${process.env.QA_DAMAGE_PROBE==='1'?`dmgNums=${mode==='no-orbs'?'[]':'__probeDamage'};`:''}let frames=[],cpu=[],last=0,began=performance.now(),px=P.x,py=P.y;function frame(ts){P.x=px+Math.sin(ts/1000)*20;P.y=py+Math.cos(ts/1000)*20;dmgNums.forEach(d=>d.born=Date.now()-200);if(last)frames.push(ts-last);last=ts;let a=performance.now();${process.env.QA_HUD_PROBE==='1'&&mode==='full'?'gupdate(0);':''}gdraw();cpu.push(performance.now()-a);if(performance.now()-began<8000)requestAnimationFrame(frame);else{frames.sort((a,b)=>a-b);cpu.sort((a,b)=>a-b);resolve({p50:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)],callback95:cpu[Math.floor(cpu.length*.95)]});}}requestAnimationFrame(frame);})`);results.push({mode,...r});
 }
 fs.writeFileSync(out+'/glow-profile.json',JSON.stringify(results,null,2));console.log(results);
}finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
