// Staged screenshots use the real game renderer/UI. They are not natural-run evidence.
process.env.PORT=8804;
const {fs,path,out,root,server,launch,ev,start}=require('./ab-harness.cjs');
(async()=>{const b=await launch(),errors=[];try{
 const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8804');await p.evaluate(()=>document.fonts.ready);
 await p.waitForFunction(()=>window.MafiaUI&&document.querySelector('.mb-play svg'));
 await p.screenshot({path:out+'/01-menu.png'});
 await start(p,'uskudar');await ev(p,'stopTutorial()');await p.locator('#ultHud').waitFor({state:'visible'});
 await ev(p,`cancelAnimationFrame(raf2);resetInput();for(let x=19500;x<22000;x+=100){if(WorldRules.free(worldObj,x,19500,180)){P.x=x;P.y=19500;break;}}enemies=[];for(let i=0;i<22;i++){spawnEnemy(ET[i%6]);let e=enemies[enemies.length-1],a=i*2.39996,r=100+(i%4)*46;e.x=P.x+Math.cos(a)*r;e.y=P.y+Math.sin(a)*r;}orbs=[];goldOrbs=[];for(let i=0;i<14;i++){orbs.push({x:P.x-160+i*24,y:P.y+70+(i%3)*24,r:7,col:'#38dfbf',v:4,life:20000});goldOrbs.push({x:P.x-160+i*24,y:P.y-110+(i%3)*20,r:5,v:1,life:20000});}elapsed=91000;kills=127;wave=3;P.lvl=7;gupdate(16);cancelAnimationFrame(raf2);gdraw();`);
 await p.waitForFunction(()=>!document.querySelector('.reward-burst')&&!document.getElementById('achPopup').classList.contains('show')&&['miniBossBanner','bossBanner'].every(id=>!document.getElementById(id)||getComputedStyle(document.getElementById(id)).display==='none'));await ev(p,'screenShake=0;gdraw()');await p.screenshot({path:out+'/02-combat.png'});
 await ev(p,'showCards(false)');await p.screenshot({path:out+'/03-level-up.png'});
 await p.locator('#lvlup.on .luc').first().click();
 await ev(p,`enemies=[];for(let i=0;i<9;i++){spawnEnemy(ET[i%5]);let e=enemies[enemies.length-1];e.x=P.x+Math.cos(i)*170;e.y=P.y+Math.sin(i)*150;}spawnEnemy(ET.find(e=>e.boss));let boss=enemies[enemies.length-1];boss.x=P.x+70;boss.y=P.y-125;boss.hp=boss.maxHp*.72;wave=5;elapsed=300000;gupdate(16);cancelAnimationFrame(raf2);gdraw();`);
 await p.waitForFunction(()=>!document.querySelector('.reward-burst')&&!document.getElementById('achPopup').classList.contains('show')&&['miniBossBanner','bossBanner'].every(id=>!document.getElementById(id)||getComputedStyle(document.getElementById(id)).display==='none'));await ev(p,'screenShake=0;gdraw()');await p.screenshot({path:out+'/04-boss.png'});
 await ev(p,"pdata.gold=1200;goTo('shopScreen');buildShopScreen()");await p.mouse.move(0,0);await p.screenshot({path:out+'/05-shop.png'});
 const assets=path.join(root,'../assets');fs.mkdirSync(assets,{recursive:true});
 const generated=await p.evaluate(async()=>{
  await document.fonts.load('32px "Press Start 2P"');
  function surface(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  const c=surface(1024,1024),x=c.getContext('2d');x.scale(4,4);x.imageSmoothingEnabled=false;
  const col=MafiaUI.colors,rect=(color,a,b,w,h)=>{x.fillStyle=color;x.fillRect(a,b,w,h);};
  rect(col.ink,0,0,256,256);rect(col.gold,12,12,232,232);rect(col.ink,18,18,220,220);rect(col.teal,24,24,208,5);
  for(let i=0;i<9;i++){let h=30+(i%3)*16;rect('#214655',24+i*24,225-h,20,h);rect(col.gold,28+i*24,232-h,3,4);}
  x.font='116px "Press Start 2P"';x.textAlign='center';x.fillStyle='#704927';x.fillText('M',132,175);x.fillStyle=col.gold;x.fillText('M',128,169);
  rect('#ffe8a3',70,53,22,5);rect('#ffe8a3',163,53,22,5);
  x.fillStyle=col.teal;x.font='10px "Press Start 2P"';x.fillText('İSTANBUL',128,208);
  const small=surface(512,512);small.getContext('2d').drawImage(c,0,0,512,512);
  const foreground=surface(1024,1024),f=foreground.getContext('2d');f.imageSmoothingEnabled=false;f.drawImage(c,240,240,544,544);
  const background=surface(1024,1024),bg=background.getContext('2d');bg.fillStyle=col.ink;bg.fillRect(0,0,1024,1024);
  const feature=surface(1024,500),g=feature.getContext('2d',{alpha:false});g.imageSmoothingEnabled=false;MafiaArt.menu(g,1024,500,0);g.fillStyle='#0c182799';g.fillRect(0,0,1024,500);
  ['ustura','kurt','celik'].forEach((id,i)=>MafiaArt.hero(g,105+i*126,386-(i===1?26:0),id,i===1?6:5,1,0,false));
  g.fillStyle=col.ink;g.fillRect(470,76,514,340);g.strokeStyle=col.gold;g.lineWidth=6;g.strokeRect(470,76,514,340);g.fillStyle=col.teal;g.fillRect(480,86,494,5);
  g.textAlign='center';g.fillStyle=col.gold;g.font='22px "Press Start 2P"';g.fillText('İSTANBUL',727,153);g.font='61px "Press Start 2P"';g.fillText('MAFIA',727,245);g.font='16px "Press Start 2P"';g.fillStyle=col.teal;g.fillText('GECE VARDİYASI',727,299);g.fillStyle='#fff1ce';g.font='12px "Press Start 2P"';g.fillText('AYAKTA KAL. GÜÇLEN.',727,355);
  return {icon:c.toDataURL(),play:small.toDataURL(),foreground:foreground.toDataURL(),background:background.toDataURL(),feature:feature.toDataURL()};
 });
 for(const [key,file]of Object.entries({icon:assets+'/icon-only.png',foreground:assets+'/icon-foreground.png',background:assets+'/icon-background.png',play:out+'/play-icon-512.png',feature:out+'/feature-1024x500.png'}))fs.writeFileSync(file,Buffer.from(generated[key].split(',')[1],'base64'));
 const promo=await b.newPage({viewport:{width:1024,height:500},deviceScaleFactor:1});await promo.setContent('<style>html,body{margin:0;background:#0c1827}img{display:block;width:1024px;height:500px}</style><img src="'+generated.feature+'">');await promo.locator('img').evaluate(img=>img.decode());await promo.screenshot({path:out+'/feature-1024x500.png'});await promo.close();
 fs.writeFileSync(out+'/capture.json',JSON.stringify({version:await p.evaluate(()=>APP_VERSION),viewport:[540,960],deviceScaleFactor:2,pixels:[1080,1920],staged:true,setup:'Real renderer: fixed encounter layout, elapsed/level/boss HP and shop balance staged in memory only. No natural-run claims.',art:'Existing game font, sprites and skyline; code-native monogram; no generated portraits',errors},null,2));
 if(errors.length)throw Error(errors.join('\n'));
 }finally{await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
