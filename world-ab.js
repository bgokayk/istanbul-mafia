/* Shared world geometry for rendering, spawn validation and movement. */
(function(){'use strict';
function bounds(o){return o.shape==='circle'?{x:o.x-o.r,y:o.y-o.r,w:o.r*2,h:o.r*2}:{x:o.x,y:o.y,w:o.w,h:o.h};}
function intersects(o,x,y,r){if(!o.solid)return false;if(o.shape==='circle')return Math.hypot(x-o.x,y-o.y)<r+o.r;let b=bounds(o),cx=Math.max(b.x,Math.min(x,b.x+b.w)),cy=Math.max(b.y,Math.min(y,b.y+b.h));return (x-cx)**2+(y-cy)**2<r*r;}
function free(world,x,y,r){return !world.objects.some(o=>intersects(o,x,y,r));}
function safeSpawn(world,x,y,r){if(free(world,x,y,r+8))return{x,y};for(let radius=24;radius<2000;radius+=24)for(let a=0;a<32;a++){let px=x+Math.cos(a*Math.PI/16)*radius,py=y+Math.sin(a*Math.PI/16)*radius;if(free(world,px,py,r+8))return{x:px,y:py};}throw new Error('No safe spawn point');}
function move(world,p,dx,dy){let count=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));dx/=count;dy/=count;for(let n=0;n<count;n++){if(free(world,p.x+dx,p.y,p.r))p.x+=dx;if(free(world,p.x,p.y+dy,p.r))p.y+=dy;}}
function build(id,size,rng=Math.random){
 const world={objects:[]},center=size/2;
 const add=o=>{o.id='world-'+world.objects.length;world.objects.push(o);return o;};
 const box=(kind,x,y,w,h)=>add({kind,shape:'rect',x,y,w,h,solid:true});
 const pole=(x,y,r)=>add({kind:'pillar',shape:'rect',x:x-r,y:y-r,w:r*2,h:r*2,r,solid:true});
 const barrel=(x,y)=>add({kind:'barrel',shape:'rect',x:x-11,y:y-12,w:22,h:22,solid:false});
 const rand=(a,b)=>Math.floor(a+rng()*(b-a)),clear=(x,y)=>Math.hypot(x-center,y-center)<300;
 box('wall',0,0,size,90);box('wall',0,size-90,size,90);box('wall',0,0,90,size);box('wall',size-90,0,90,size);
 if(id==='uskudar'){
   for(let i=0;i<20;i++)box('wall',rand(500,size-1500),rand(500,size-500),rand(150,400),rand(60,120));
   for(let i=0;i<18;i++)box('wall',rand(800,size-800),rand(800,size-800),rand(200,500),rand(40,80));
 }else{
   let count=id==='balat'?30:id==='besiktas'?22:25,thickness=id==='balat'?180:id==='besiktas'?150:160,min=id==='besiktas'?500:id==='balat'?800:1000,max=id==='besiktas'?1500:id==='balat'?2000:2500;
   for(let i=0;i<count;i++){if(rng()<.5)box('wall',rand(200,size-3000),rand(200,size-200),rand(min,max),thickness);else box('wall',rand(200,size-200),rand(200,size-3000),thickness,rand(min,max));}
 }
 if(id==='besiktas')pole(center,center,160);
 if(id==='taksim'){for(let i=0;i<6;i++)pole(center+Math.cos(i*Math.PI/3)*800,center+Math.sin(i*Math.PI/3)*800,45);pole(center,center,120);box('wall',0,center-220,size,20);box('wall',0,center+200,size,20);}
 const templates={kapalicarsi:[[120,70],[100,100],[200,40],[32,32]],uskudar:[[150,50],[180,80],[160,50]],balat:[[20,150],[60,40],[100,30]],besiktas:[[130,70],[160,70]],galata:[[140,80],[60,60]]};const sizes=templates[id]||[[140,80],[120,70]];
 for(let sx=0;sx<4;sx++)for(let sy=0;sy<4;sy++){
   let count=rand(5,9);for(let i=0;i<count;i++){let x=center-7000+sx*3500+175+rng()*3150,y=center-7000+sy*3500+175+rng()*3150;if(clear(x,y))continue;let [w,h]=sizes[rand(0,sizes.length)];box('stall',x-w/2,y-h/2,w,h);}
   for(let i=0,count=rand(2,4);i<count;i++){let x=center-7000+sx*3500+rng()*3500,y=center-7000+sy*3500+rng()*3500;if(!clear(x,y))barrel(x,y);}
 }
 for(let i=0;i<40;i++){let x=rand(300,size-300),y=rand(300,size-300);if(!clear(x,y))pole(x,y,rand(20,35));}
 [[-300,-250],[-120,-350],[200,-200],[350,-120],[-250,200],[120,300],[-350,80],[260,260],[-180,-130],[80,-300],[300,130],[-130,260]].forEach(([x,y])=>{let w=rand(100,180),h=rand(60,100);box('stall',center+x-w/2,center+y-h/2,w,h);});
 for(let i=0;i<8;i++){let d=rand(600,1400);pole(center+Math.cos(i*Math.PI/4)*d,center+Math.sin(i*Math.PI/4)*d,rand(25,45));}
 for(let i=0;i<20;i++)barrel(rand(center-1800,center+1800),rand(center-1800,center+1800));
 return world;
}
// A uniform grid bounds typical local separation work. Dense worst case remains quadratic.
function separation(enemies){const cell=192,grid=new Map();let checks=0,maxR=0;enemies.forEach(e=>{maxR=Math.max(maxR,e.r);e._sepX=0;e._sepY=0;let key=Math.floor(e.x/cell)+','+Math.floor(e.y/cell),bucket=grid.get(key);if(!bucket)grid.set(key,bucket=[]);bucket.push(e);});
 enemies.forEach(e=>{let ix=Math.floor(e.x/cell),iy=Math.floor(e.y/cell),range=Math.ceil((e.r+maxR)*1.1/cell);for(let x=ix-range;x<=ix+range;x++)for(let y=iy-range;y<=iy+range;y++){let bucket=grid.get(x+','+y);if(!bucket)continue;for(let j of bucket){if(j===e)continue;checks++;let dx=e.x-j.x,dy=e.y-j.y,md=(e.r+j.r)*1.1,ds=dx*dx+dy*dy;if(ds<md*md&&ds>.01){let d=Math.sqrt(ds),f=(md-d)/md;e._sepX+=dx/d*f;e._sepY+=dy/d*f;}}}});return checks;
}
window.WorldRules={build,bounds,intersects,free,safeSpawn,move,separation};
})();
