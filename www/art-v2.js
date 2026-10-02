/* Istanbul Mafia: Gece Vardiyası — original, code-authored pixel art.
 * No downloaded or generated artwork. All actors share a 24×32 logical grid.
 * Cached frames/tiles keep allocation and drawing cost outside the hot path. */
(function(){
'use strict';
const cache=new Map(),tiles=new Map(),heroSheets={},tileSheets={};
const ink='#101923',skin='#d6a179',light='#f3c69a',skinShade='#985f55';
const costumes={
 kurt:['#2d405d','#54718c','#192a40','#a84548','suit','gun'],
 ustura:['#393447','#635773','#201f30','#b97869','hood','knife'],
 celik:['#516044','#81916a','#303e35','#dc8c48','crop','bottle'],
 zarci:['#d2c4a1','#f0dfb8','#8b856e','#4c9c8a','hat','dice'],
 amca:['#325b52','#598674','#203b3a','#d3af66','gray','chain'],
 baba:['#987742','#c4a462','#5e5140','#e7d6b1','gray','shotgun'],
 abla:['#853f52','#bb6470','#522d41','#efd099','long','knife'],
 sofor:['#a78544','#d2ae63','#66553d','#dcc9a3','cap','wrench']
};
function rect(c,col,x,y,w,h){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);}
function canvas(w,h){let c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function actorFrame(id,frame,enemy){
 const key=id+':'+frame+':'+(enemy||'');if(cache.has(key))return cache.get(key);
 const a=canvas(24,32),c=a.getContext('2d');let v=costumes[id]||costumes.kurt;
 if(!enemy&&heroSheets[id]){c.drawImage(heroSheets[id],frame*24,0,24,32,0,0,24,32);if(id==='zarci')c.clearRect(18,18,6,6);cache.set(key,a);return a;}
 if(enemy)v=[enemy,'#b99d89','#313744','#e6bd76',id.includes('usta')||id.includes('kebap')?'chef':id.includes('gardiyan')?'cap':'crop',id.includes('nisanci')?'shotgun':id.includes('berber')?'knife':'club'];
 const [coat,hi,shade,accent,hair,weapon]=v;let step=frame===1?1:frame===3?-1:0,bob=frame%2;
 const p=(col,x,y,w=1,h=1)=>rect(c,col,x,y-bob,w,h);
 // Boots and individually articulated legs.
 p(ink,6,23,5,8-step);p(ink,13,23,5,8+step);
 p(shade,7,23,3,5-step);p(coat,14,23,3,5+step);
 p('#65707a',7,29-step,3);p('#65707a',14,29+step,3);
 // Outlined coat, shoulders and sleeves; lit from upper left.
 p(ink,5,12,14,13);p(ink,3,14,3,9);p(ink,19,14,3,9);
 p(coat,6,13,12,11);p(hi,6,14,2,8);p(shade,16,14,2,10);
 p(coat,4,15,2,6);p(hi,4,15,1,4);p(coat,19,15,2,6);
 p(skinShade,4,21,2,2);p(light,4,21);p(skin,19,21,2,2);
 p('#ddd6bc',10,13,4,5);p(accent,11,14,2,7);
 p(shade,8,14,2,7);p(hi,9,14,1,3);p(shade,14,14,2,8);
 p('#131f2a',7,24,10,1);p('#d0af69',11,24,2);
 p(shade,7,21,3);p(hi,7,20,3);p('#ccb587',16,19);
 // Face silhouette, side plane and three-pixel nose, no noisy dithering.
 p(ink,7,3,10,10);p(ink,6,5,12,6);p(skinShade,7,5,10,7);
 p(skin,8,5,8,6);p(light,8,5,5,3);p(skin,6,8,1,2);p(skinShade,17,8,1,2);
 p(ink,8,7,2);p(ink,14,7,2);p('#b47862',12,8,1,2);p('#754d4c',10,11,5);
 let hc=hair==='gray'?'#91979a':'#252735';
 p(hc,8,2,8,3);p(hc,7,4,2,3);p(hc,15,4,2,3);p(hair==='gray'?'#c5c6be':'#4d4650',9,2,5);
 if(hair==='hood'){p(ink,6,2,12,4);p(coat,7,2,10,3);p(hi,8,2,6);p(coat,5,5,2,8);p(coat,17,5,2,8);p(shade,8,10,8,3);}
 if(hair==='long'){p(hc,5,4,2,12);p(hc,17,4,2,12);p('#55404b',5,5,1,9);p('#e7bc69',6,10);p('#e7bc69',17,10);}
 if(hair==='hat'||hair==='cap'){p(ink,5,4,14,2);p(coat,7,1,10,4);p(hi,8,1,7);p(shade,5,4,14);}
 if(hair==='chef'){p('#ebe2cb',7,0,11,4);p('#ffefcd',8,0,3,2);p('#b4b3a5',8,4,9);}
 if(id==='sofor'||id==='baba'||id==='amca'){p(hair==='gray'?'#8f8d86':'#342a2d',9,10,7);p(skin,12,10);}
 // Each hero carries a recognisable, contrasting weapon.
 if(weapon==='gun'||weapon==='shotgun'){p(ink,18,18,6,4);p('#7c929b',18,18,6,2);p('#c2d5d1',20,18,4);p('#5d4240',18,20,2,3);if(weapon==='shotgun'){p('#adbcb6',14,17,10);p('#705345',14,19,5);}}
 if(weapon==='knife'){p(ink,20,13,3,10);p('#d9e4d4',21,13,1,7);p('#92b5bc',20,15,1,5);p(accent,19,20,4);}
 if(weapon==='bottle'){p('#6c9c69',20,17,3,6);p('#bfd58f',21,16,1,5);p('#f3ba64',21,14);p('#e76d42',20,13,2);}
 if(weapon==='dice'){}
 if(weapon==='chain'){for(let i=0;i<6;i++){p('#bdc5b8',20+(i%2),17+i*2,2);p('#5e7880',21+(i%2),18+i*2);}}
 if(weapon==='wrench'){p('#a6bec0',21,17,1,7);p('#d5d7c5',20,16,3,2);p(ink,21,16);}
 if(weapon==='club'){p('#8b6c51',21,15,2,8);p('#c1a779',21,15,1,6);}
 cache.set(key,a);return a;
}
function blit(c,a,x,y,scale,flip){c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x),Math.round(y));if(flip)c.scale(-1,1);c.drawImage(a,-Math.floor(a.width*scale/2),-Math.floor((a.height-2)*scale),Math.round(a.width*scale),Math.round(a.height*scale));c.restore();}
function shadow(c,x,y,r){rect(c,'#17202699',x-r,y-1,r*2,4);rect(c,'#17202655',x-r+3,y+3,r*2-6,2);}
function hero(c,x,y,id,scale,face,time,moving){let f=moving?Math.floor(time/130)%4:0;shadow(c,x,y,9*scale);blit(c,actorFrame(id,f),x,y,scale,face<0);}
const themes={
 kapalicarsi:['#3b3c39','#47473f','#515046','#2e3333','#896b4f','#9b5350'],
 uskudar:['#35464c','#40545b','#4b6065','#293d46','#547f87','#b3a889'],
 balat:['#42414b','#4c4b54','#585560','#303540','#92737e','#67958e'],
 besiktas:['#39454a','#465258','#505d5e','#28383e','#7c8e81','#a96c55'],
 galata:['#3b3e4e','#46495b','#515568','#2c3144','#798399','#7d607e'],
 taksim:['#41484b','#4c5456','#585e5d','#323c40','#8d8073','#a44848'],
 eminonu:['#3e4a47','#495650','#586259','#2e3c3c','#738f80','#698d80'],
 kasimpasa:['#3b3c42','#45474c','#52545a','#2b3038','#806c61','#8d6555'],
 bursa:['#34443a','#3f5040','#4d5c47','#27352f','#7c9164','#718953']
};
function hash(x,y){let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return(n^(n>>>16))>>>0;}
function tile(id,n){let key=id+n;if(tiles.has(key))return tiles.get(key);let a=canvas(64,64),c=a.getContext('2d'),t=themes[id]||themes.balat;
 if(tileSheets[id]){c.drawImage(tileSheets[id],n*64,0,64,64,0,0,64,64);tiles.set(key,a);return a;}
 rect(c,t[3],0,0,64,64);
 for(let row=0;row<4;row++)for(let col=-1;col<3;col++){let x=col*32+(row%2)*16,y=row*16,k=hash(n+col+99,row+3);rect(c,t[k%2],x+1,y+1,30,14);rect(c,t[2],x+2,y+1,28,1);rect(c,t[3],x+1,y+14,30,1);for(let j=0;j<4;j++)rect(c,t[(k+j)%3],x+3+(k>>j)%25,y+3+(k>>(j+3))%9,2,1);if(k%5===0){rect(c,t[3],x+10,y+7,3,1);rect(c,t[3],x+12,y+8,1,3);}}
 tiles.set(key,a);return a;
}
function floor(c,camX,camY,w,h,id){c.imageSmoothingEnabled=false;rect(c,window.MafiaUI?MafiaUI.colors.ink:ink,camX,camY,w,h);c.save();c.globalAlpha*=.56;for(let x=Math.floor(camX/64)*64;x<camX+w+64;x+=64)for(let y=Math.floor(camY/64)*64;y<camY+h+64;y+=64)c.drawImage(tile(id,hash(x/64,y/64)%8),x,y);c.restore();}
function prop(c,t,id){let x=Math.round(t.x-t.w/2),y=Math.round(t.y-t.h/2),w=Math.round(t.w),h=Math.round(t.h),pal=themes[id]||themes.balat;
 rect(c,'#15222b88',x+6,y+7,w,h);rect(c,ink,x,y,w,h);
 if(w<45||h>110){rect(c,pal[1],x+2,y+2,w-4,h-4);for(let yy=4;yy<h-4;yy+=12){rect(c,pal[2],x+2,y+yy,w-4,2);for(let xx=yy%24?12:24;xx<w-4;xx+=24)rect(c,pal[3],x+xx,y+yy+2,2,10);}return;}
 if(id==='galata'){rect(c,'#596172',x+2,y+2,w-4,h-4);for(let yy=4;yy<h-4;yy+=16){rect(c,'#333d51',x+2,y+yy,w-4,2);rect(c,'#788296',x+4,y+yy+2,w-8,2);}rect(c,'#313b4c',x+w/2-8,y+h/2,16,h/2-2);return;}
 if(id==='balat'||id==='kasimpasa'){
   let paint=['#7c6068','#647d79','#8c7968'][hash(x,y)%3];rect(c,paint,x+2,y+2,w-4,h-4);rect(c,'#34454b',x+3,y+h-7,w-6,5);
   rect(c,'#452f38',x-2,y-5,w+4,16);for(let xx=0;xx<w;xx+=10){rect(c,'#815457',x+xx,y-4,8,4);rect(c,'#9f6c65',x+xx+3,y+2,7,3);}
   for(let xx=12;xx<w-18;xx+=30){rect(c,'#c1b49b',x+xx,y+20,20,25);rect(c,'#20353e',x+xx+2,y+22,16,20);rect(c,'#9eab9f',x+xx+9,y+22,2,20);rect(c,'#c1b49b',x+xx,y+32,20,2);rect(c,'#a27662',x+xx-2,y+45,24,5);rect(c,'#739775',x+xx+2,y+42,6,4);}
   return;
 }
 if(id==='taksim'){
   rect(c,'#844c4d',x+2,y+2,w-4,h-4);rect(c,'#c0b399',x+2,y+4,w-4,3);rect(c,'#283f48',x+8,y+19,w-16,Math.max(12,h-34));
   for(let xx=12;xx<w-12;xx+=24){rect(c,'#9ea994',x+xx,y+19,3,Math.max(12,h-34));rect(c,'#c0b597',x+xx+4,y+23,12,4);}
   rect(c,'#563c42',x-3,y-4,w+6,9);rect(c,'#b1896a',x-2,y-5,w+4,2);return;
 }
 if(id==='uskudar'&&w>150){
   rect(c,'#466a73',x+3,y+3,w-6,h-6);rect(c,'#85a09f',x+3,y+3,w-6,4);rect(c,'#293c45',x+9,y+12,w-18,h-24);
   for(let xx=14;xx<w-12;xx+=18){rect(c,'#b49a76',x+xx,y+12,4,h-24);rect(c,'#d2bb8e',x+xx,y+12,2,h-24);}
   rect(c,'#799394',x+4,y+h-9,w-8,4);return;
 }
 // Raised wooden counter with slatted front, striped fabric canopy and goods.
 rect(c,'#634e42',x+3,y+3,w-6,h-6);rect(c,'#9d7b55',x+3,y+h-18,w-6,5);
 for(let xx=6;xx<w-6;xx+=12){rect(c,'#3f3633',x+xx,y+h-12,2,9);rect(c,'#b28b59',x+xx+2,y+h-12,1,8);}
 let cloth=pal[5];rect(c,'#282d32',x-2,y-3,w+4,23);
 for(let xx=0;xx<w;xx+=12){rect(c,xx%24===0?cloth:'#c1b395',x+xx,y-3,Math.min(12,w-xx),18);rect(c,xx%24===0?'#683f43':'#8c8979',x+xx,y+15,Math.min(12,w-xx),5);}
 rect(c,'#ddc590',x,y-4,w,2);rect(c,'#392f30',x+3,y+21,3,h-25);rect(c,'#392f30',x+w-6,y+21,3,h-25);
 for(let xx=12;xx<w-16;xx+=22){rect(c,'#2a3032',x+xx,y+28,18,Math.max(9,h-51));rect(c,'#9b7852',x+xx+1,y+29,16,2);let colors=id==='uskudar'?['#96b7b4','#577a85']:['#bca367','#bd744d','#8b9a62'];for(let j=0;j<3;j++)rect(c,colors[j%colors.length],x+xx+3+j*4,y+33+(j%2)*3,3,5);}
}
function barrel(c,x,y){x=Math.round(x);y=Math.round(y);shadow(c,x,y+8,12);rect(c,ink,x-11,y-12,22,22);rect(c,'#755840',x-9,y-11,18,20);rect(c,'#ad8754',x-7,y-10,3,19);rect(c,'#3c3836',x-10,y-6,20,3);rect(c,'#3c3836',x-10,y+4,20,3);rect(c,'#b3aaa0',x-8,y-6,3);}
function pillar(c,p,id){let r=p.r,t=themes[id]||themes.balat;shadow(c,p.x+4,p.y+r,r);rect(c,ink,p.x-r,p.y-r,r*2,r*2);rect(c,t[1],p.x-r+3,p.y-r+3,r*2-6,r*2-6);rect(c,t[2],p.x-r+4,p.y-r+4,r*2-8,5);rect(c,t[3],p.x-r+5,p.y+r-9,r*2-10,5);if(r<60){rect(c,'#a58b62',p.x-4,p.y-r-9,8,10);rect(c,'#ebcd85',p.x-2,p.y-r-8,4,6);}}
function world(c,wo,id,camX,camY,w,h){floor(c,camX,camY,w,h,id);wo.objects.forEach(o=>{let b=WorldRules.bounds(o);if(b.x>camX+w+16||b.x+b.w<camX-16||b.y>camY+h+16||b.y+b.h<camY-16)return;
 if(o.kind==='pillar')pillar(c,{x:o.x+o.r,y:o.y+o.r,r:o.r},id);else if(o.kind==='barrel')barrel(c,o.x+11,o.y+12);else{let x=Math.max(b.x,camX-64),y=Math.max(b.y,camY-64),right=Math.min(b.x+b.w,camX+w+64),bottom=Math.min(b.y+b.h,camY+h+64);prop(c,{x:(x+right)/2,y:(y+bottom)/2,w:right-x,h:bottom-y},o.kind==='wall'?'galata':id);}});}
function objectFrame(id){const key='object:'+id;if(cache.has(key))return cache.get(key);let a=canvas(24,24),c=a.getContext('2d'),p=(col,x,y,w=1,h=1)=>rect(c,col,x,y,w,h);
 if(id==='cay'||id==='raki'){p(ink,6,3,12,18);p('#b7c7c2',7,3,10,2);p('#8d423a',8,6,8,12);p('#b65743',9,6,3,9);p('#e8c8a0',7,19,10,2);p('#eee2c1',5,21,14,1);p('#f5bc74',9,9);p('#f5bc74',14,9);if(id==='raki'){p('#9aaab9',8,7,8,12);p('#e3e2ce',9,13,6,5);}}
 else if(id==='para'||id==='nazar'){p(ink,6,3,12,18);p(ink,3,6,18,12);let col=id==='para'?'#c89950':'#427eaa';p(col,6,4,12,16);p(col,4,6,16,12);p(id==='para'?'#efd48a':'#8ebbbd',7,6,10,12);p(id==='para'?'#966735':'#e9dfbf',9,8,6,8);p(id==='para'?'#e7c170':'#223c5d',11,10,3,4);}
 else if(id==='hali'){p(ink,2,2,20,20);p('#853f4e',3,3,18,18);p('#d5b276',5,5,14,14);p('#4b5363',6,6,12,12);for(let j=0;j<5;j++){p('#d4b17b',10-j,8+j,j*2+3,1);p('#d4b17b',2+j*4,0,1,2);p('#d4b17b',2+j*4,22,1,2);}p('#f8cf85',7,9,3);p('#f8cf85',14,9,3);}
 else if(id==='taksi'||id==='dolmus'){p(ink,1,9,22,12);p('#b68a40',2,10,20,9);p('#ecc76f',4,5,15,9);p('#446578',5,6,5,5);p('#76969d',12,6,5,5);p('#fff0b5',20,13,2,3);p(ink,4,18,5,5);p(ink,16,18,5,5);p('#9ba3a0',5,19,3,2);p('#9ba3a0',17,19,3,2);p('#e8d99c',9,3,6,2);}
 else if(id==='marti'){p(ink,2,9,20,6);p('#c5cfca',4,9,16,4);p('#edf0d9',1,6,6,4);p('#edf0d9',17,6,6,4);p('#e3e7d5',10,5,5,9);p('#d5a557',14,7,5,2);p(ink,13,6);}
 else if(id==='kaldirim'){p(ink,3,3,18,18);p('#667682',4,4,16,16);p('#93a2a4',5,5,13,3);p('#455461',7,13,13,6);p('#364451',8,8,2,4);p('#364451',10,11,4,2);}
 else if(id==='nargile'){p(ink,6,13,12,10);p('#786589',7,13,10,8);p('#b299a4',8,14,3,5);p('#c3ad7e',11,4,3,10);p('#a27b4c',8,3,9,3);p('#748e83',15,0,5,2);p('#465c58',17,2,4,3);}
 cache.set(key,a);return a;}
const objects=new Set(['cay','raki','para','nazar','hali','taksi','dolmus','marti','kaldirim','nargile']);
function enemy(c,e,time){let id=e.type.id,s=Math.max(1,Math.min(3,Math.round(e.r/10))),f=Math.floor((time+hash(Math.round(e.x/10),0)%200)/150)%4;shadow(c,e.x,e.y+e.r*.5,e.r*.8);
 if(objects.has(id))blit(c,objectFrame(id),e.x,e.y+e.r*.7,s,e.vf<0);
 else {let boss=e.type.boss||e._isMiniTimeBoss;let col=boss?'#804b58':e.type.col||'#6e7277';blit(c,actorFrame(id,f,col),e.x,e.y+e.r*.6,boss?Math.max(2,Math.round(e.r/12)):Math.max(1,Math.min(2,Math.round(e.r/11))),e.vf<0);if(boss){rect(c,ink,e.x-27,e.y-e.r*2.2,54,6);rect(c,'#c26963',e.x-26,e.y-e.r*2.2+1,52*Math.max(0,e.hp/e.maxHp),4);}}
 if(e.type.boss||e._isMiniTimeBoss){c.save();c.font='8px "Press Start 2P"';c.textAlign='center';c.fillStyle='#ead7b0';c.fillText(id==='testere_testere'?'TESTERE':id.replaceAll('_',' ').toLocaleUpperCase('tr').slice(0,20),e.x,e.y-e.r*2.2-7);c.restore();}
 if(id==='testere_testere'){let sx=Math.round(e.x+e.r*.6),sy=Math.round(e.y-e.r*.4);rect(c,ink,sx-28,sy-24,56,48);rect(c,'#8b9f9f',sx-24,sy-18,48,36);rect(c,'#4b636b',sx-18,sy-12,36,24);for(let i=0;i<10;i++){let ang=i*Math.PI/5+Math.floor(time/100)*.63;rect(c,'#d2d3ba',sx+Math.cos(ang)*25-4,sy+Math.sin(ang)*21-4,8,8);}rect(c,'#b86258',sx-6,sy-6,12,12);}
 if(e._hitFlash>0){c.save();c.globalAlpha=.6;c.strokeStyle='#fff0c5';c.lineWidth=2;c.strokeRect(Math.round(e.x-e.r),Math.round(e.y-e.r),e.r*2,e.r*2);c.restore();}
}
function pickup(c,x,y,kind,col){x=Math.round(x);y=Math.round(y);if(kind==='xp'){rect(c,ink,x-4,y-4,8,8);rect(c,col||'#67b7bf',x-2,y-4,4,8);rect(c,col||'#67b7bf',x-4,y-2,8,4);rect(c,'#d4eee0',x-2,y-3,2,3);}else if(kind==='gold'){rect(c,'#644c35',x-4,y-5,8,10);rect(c,'#d5b367',x-3,y-4,6,8);rect(c,'#ffdf90',x-2,y-3,2,5);}else{rect(c,ink,x-7,y-7,14,14);rect(c,'#a94755',x-6,y-6,12,12);rect(c,'#f1ddc4',x-1,y-4,3,9);rect(c,'#f1ddc4',x-4,y-1,9,3);}}
function menu(c,w,h,time){let fullH=h;h=Math.min(h,540);rect(c,'#131e2a',0,0,w,fullH);let horizon=h*.34;
 for(let i=0;i<42;i++){let x=hash(i,2)%w,y=hash(i,4)%Math.max(1,horizon);rect(c,'#6c7d86',x,y,1,1);}
 rect(c,'#e4d4a0',w*.76,h*.075,22,22);rect(c,'#131e2a',w*.76+9,h*.075-3,18,19);
 for(let i=0;i<Math.ceil(w/28);i++){let bh=32+hash(i,1)%70,x=i*28;rect(c,'#223342',x,horizon-bh,26,bh);for(let yy=8;yy<bh;yy+=12)for(let xx=5;xx<23;xx+=9)rect(c,hash(i,yy+xx)%3?'#394d57':'#b49a66',x+xx,horizon-bh+yy,3,4);}
 // Galata tower and low Bosphorus skyline.
 let gx=w*.2;rect(c,'#1b2c38',gx,horizon-105,32,105);for(let i=0;i<8;i++)rect(c,'#50656d',gx+14-i*2,horizon-123+i*2,4+i*4,2);rect(c,'#bfab7b',gx+8,horizon-79,4,8);rect(c,'#bfab7b',gx+21,horizon-79,4,8);
 rect(c,'#283e48',0,horizon,w,h*.14);for(let i=0;i<32;i++)rect(c,i%4?'#3b5257':'#9c916f',hash(i,7)%w,horizon+hash(i,8)%Math.max(1,Math.floor(h*.13)),10+hash(i,9)%24,1);
 c.save();c.beginPath();c.rect(0,h*.48,w,fullH);c.clip();floor(c,0,0,w,fullH,'kapalicarsi');c.restore();
 prop(c,{x:w*.08,y:h*.57,w:110,h:70},'kapalicarsi');prop(c,{x:w*.94,y:h*.64,w:130,h:80},'kapalicarsi');
 rect(c,'#101a26bb',0,h*.53,w,fullH);
 let caption=document.querySelector('.menu-scene-caption'),canvas=document.getElementById('menuCanvas');
 let cy=caption&&canvas?caption.getBoundingClientRect().bottom-canvas.getBoundingClientRect().top-23:240;
 let ids=['ustura','celik','kurt','abla','zarci'];ids.forEach((id,i)=>hero(c,w*.5+(i-2)*Math.min(66,w*.16),cy-Math.abs(i-2)*3,id,innerHeight<500?2:3,1,time,false));
}
window.MafiaArt={hero,enemy,world,pickup,actorFrame,objectFrame,floor,tile,prop,barrel,pillar,menu,themes,rect,cache,tiles};
// Editable texture packs override procedural originals only after valid loading.
// Missing or corrupt sheets keep the original art and never block gameplay.
if(location.protocol==='http:'||location.protocol==='https:'||location.protocol==='file:'){
 Object.keys(costumes).forEach(id=>{let img=new Image();img.onload=()=>{if(img.naturalWidth!==96||img.naturalHeight!==32)return;heroSheets[id]=img;for(let f=0;f<4;f++)cache.delete(id+':'+f+':');};img.src='textures/characters/'+id+'.png';});
 Object.keys(themes).forEach(id=>{let img=new Image();img.onload=()=>{if(img.naturalWidth!==512||img.naturalHeight!==64)return;tileSheets[id]=img;for(let n=0;n<8;n++)tiles.delete(id+n);};img.src='textures/tiles/'+id+'.png';});
}
})();
