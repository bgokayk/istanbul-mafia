const assert=require('assert/strict'),cp=require('child_process');
const {fs,path,root,out,server,launch,ev,start}=require('./ab-harness.cjs');
const old=cp.execFileSync('git',['-c','safe.directory='+path.dirname(root).replaceAll('\\','/'),'show','HEAD:www/index.html'],{cwd:path.dirname(root),encoding:'utf8'});
const from=old.indexOf('function gdraw(){'),baseline=old.slice(from,old.indexOf('\nvar keys={}',from)).replace('function gdraw(){','function baselineDraw(){');
(async()=>{const browser=await launch(),result={errors:[]};try{const p=await browser.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>result.errors.push(e.message));await start(p,'kapalicarsi');
 result.tests=await ev(p,`(()=>{cancelAnimationFrame(raf2);stopTutorial();resetInput();${baseline}
  let calls=0;const random=Math.random,now=Date.now;Math.random=()=>{calls++;return .5;};particles=[];boom(P.x,P.y,'#ff0000',2000,3);const cap={count:particles.length,randomCalls:calls};
  screenShake=0;v2Settings.calm=true;Date.now=()=>1234567;P._nazarBeamT=0;_dashAfterT=0;enemies=[];rescueNpcs=[];healthOrbs=[];floorItems=[];chests=[];dmgNums=[];orbs=[];goldOrbs=[];particles=[];bullets=[];
  for(let j=0;j<1000;j++){let x=P.x-700+(j%50)*28,y=P.y-600+Math.floor(j/50)*60;orbs.push({x,y,v:2,r:6,col:j%2?'#00ff88':'#ffd700'});goldOrbs.push({x:x+5,y:y+5,v:7,life:8000});particles.push({x:x+10,y:y+10,r:3,col:'#ff2244',life:500,ml:700});bullets.push({x:x+14,y:y+14,r:3,col:'#88ccff',type:'tb'});}
  baselineDraw();const a=gctx.getImageData(0,0,GW,GH).data;gdraw();const b=gctx.getImageData(0,0,GW,GH).data;let changedChannels=0;for(let j=0;j<a.length;j++)if(a[j]!==b[j])changedChannels++;
  const counts={xp:orbs.length,gold:goldOrbs.length,particles:particles.length,bullets:bullets.length};Math.random=random;Date.now=now;return{cap,changedChannels,counts};})()`);
 assert.deepEqual(result.tests.cap,{count:500,randomCalls:8000});assert.equal(result.tests.changedChannels,0,'Culling must preserve visible pixels');assert(Object.values(result.tests.counts).every(n=>n===1000));assert.equal(result.errors.length,0);result.pass=true;
}finally{fs.writeFileSync(out+'/render-bounds.json',JSON.stringify(result,null,2));await browser.close();server.close();}console.log(JSON.stringify(result));})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
