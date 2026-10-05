// Changing critical text versus fixed labels, isolated render diagnostic only.
const {fs,out,server,launch,ev,start}=require('./ab-harness.cjs');
(async()=>{const b=await launch(),results=[];try{const p=await b.newPage({viewport:{width:390,height:844}}),cdp=await p.context().newCDPSession(p);await start(p,'kapalicarsi');await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await ev(p,`cancelAnimationFrame(raf2);stopTutorial();resetInput();screenShake=0;enemies=[];particles=[];bullets=[];orbs=[];goldOrbs=[];healthOrbs=[];chests=[];floorItems=[];window.__labels=Array.from({length:45},(_,j)=>({x:P.x-150+j%9*37,y:P.y-200+Math.floor(j/9)*90,born:Date.now(),val:300+j,_crit:true}));`);
for(const mode of ['digits-fixed','crit-fixed','crit-variable','none']){
const r=await ev(p,`new Promise(resolve=>{dmgNums=${mode==='none'?'[]':'__labels'};let frames=[],last=0,start=performance.now();function frame(ts){dmgNums.forEach((d,j)=>{d.born=Date.now()-200;d.val=${mode==='digits-fixed'?'300+j':mode==='crit-fixed'?"'💥'+(300+j)":"'💥'+(300+j+Math.floor(ts)%999)"};});if(last)frames.push(ts-last);last=ts;gdraw();if(performance.now()-start<8000)requestAnimationFrame(frame);else{frames.sort((a,b)=>a-b);resolve({n:frames.length,p50:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)]});}}requestAnimationFrame(frame);})`);results.push({mode,...r});console.log(results.at(-1));}
fs.writeFileSync(out+'/damage-render.json',JSON.stringify(results,null,2));
}finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
