/* Shared world geometry for rendering, spawn validation and movement. */
(function(){'use strict';
function bounds(o){return o.shape==='circle'?{x:o.x-o.r,y:o.y-o.r,w:o.r*2,h:o.r*2}:{x:o.x,y:o.y,w:o.w,h:o.h};}
function intersects(o,x,y,r){if(!o.solid)return false;if(o.shape==='circle')return Math.hypot(x-o.x,y-o.y)<r+o.r;const cx=Math.max(o.x,Math.min(x,o.x+o.w)),cy=Math.max(o.y,Math.min(y,o.y+o.h));return (x-cx)**2+(y-cy)**2<r*r;}
const WORLD_CELL=256;
const worldCollisionCells=new WeakMap();
function free(world,x,y,r){
 const cells=worldCollisionCells.get(world);
 if(!cells)return !world.objects.some(o=>intersects(o,x,y,r));
 for(let cx=Math.floor((x-r)/WORLD_CELL);cx<=Math.floor((x+r)/WORLD_CELL);cx++){
   const column=cells.get(cx);
   if(!column)continue;
   for(let cy=Math.floor((y-r)/WORLD_CELL);cy<=Math.floor((y+r)/WORLD_CELL);cy++){
     const objects=column.get(cy);
     if(objects&&objects.some(o=>intersects(o,x,y,r)))return false;
   }
 }
 return true;
}
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
 const cells=new Map();
 for(const object of world.objects){
   if(!object.solid)continue;
   const {x,y,w,h}=bounds(object);
   for(let cx=Math.floor(x/WORLD_CELL);cx<=Math.floor((x+w)/WORLD_CELL);cx++){
     let column=cells.get(cx);
     if(!column)cells.set(cx,column=new Map());
     for(let cy=Math.floor(y/WORLD_CELL);cy<=Math.floor((y+h)/WORLD_CELL);cy++){
       let objects=column.get(cy);
       if(!objects)column.set(cy,objects=[]);
       objects.push(object);
     }
   }
 }
 worldCollisionCells.set(world,cells);
 return world;
}
const ENEMY_CELL=64;
function indexEnemies(enemies){
 const columns=new Map();
 let maxRadius=0;
 for(let i=0;i<enemies.length;i++){
   const enemy=enemies[i],x=Math.floor(enemy.x/ENEMY_CELL),y=Math.floor(enemy.y/ENEMY_CELL);
   maxRadius=Math.max(maxRadius,enemy.r);
   let column=columns.get(x);
   if(!column)columns.set(x,column=new Map());
   let bucket=column.get(y);
   if(!bucket)column.set(y,bucket=[]);
   bucket.push(i);
 }
 return {columns,maxRadius,enemies};
}
function nearbyEnemyIndices(index,x,y,r,indices){
 indices.length=0;
 const reach=r+index.maxRadius;
 const left=Math.floor((x-reach)/ENEMY_CELL),right=Math.floor((x+reach)/ENEMY_CELL);
 const top=Math.floor((y-reach)/ENEMY_CELL),bottom=Math.floor((y+reach)/ENEMY_CELL);
 for(let cx=left;cx<=right;cx++){
   const column=index.columns.get(cx);
   if(!column)continue;
   for(let cy=top;cy<=bottom;cy++){
     const bucket=column.get(cy);
     if(bucket)for(const i of bucket){
       const enemy=index.enemies[i],limit=r+enemy.r;
       if(Math.abs(enemy.x-x)<limit&&Math.abs(enemy.y-y)<limit)indices.push(i);
     }
   }
 }
 // Piercing limits and critical-hit rolls rely on the original reverse array order.
 return indices.sort((a,b)=>b-a);
}
function separation(enemies){
 const {columns,maxRadius}=indexEnemies(enemies);
 let checks=0;
 for(const enemy of enemies){enemy._sepX=0;enemy._sepY=0;}
 for(let i=0;i<enemies.length;i++){
   const enemy=enemies[i],reach=(enemy.r+maxRadius)*1.1;
   const left=Math.floor((enemy.x-reach)/ENEMY_CELL),right=Math.floor((enemy.x+reach)/ENEMY_CELL);
   const top=Math.floor((enemy.y-reach)/ENEMY_CELL),bottom=Math.floor((enemy.y+reach)/ENEMY_CELL);
   for(let cx=left;cx<=right;cx++){
     const column=columns.get(cx);
     if(!column)continue;
     for(let cy=top;cy<=bottom;cy++){
       const bucket=column.get(cy);
       if(!bucket)continue;
       for(const j of bucket){
         if(j<=i)continue;
         checks++;
         const other=enemies[j],limit=(enemy.r+other.r)*1.1;
         const dx=enemy.x-other.x;
         if(dx<=-limit||dx>=limit)continue;
         const dy=enemy.y-other.y,distanceSquared=dx*dx+dy*dy;
         if(distanceSquared>=limit*limit||distanceSquared<=.01)continue;
         const distance=Math.sqrt(distanceSquared),force=(limit-distance)/limit;
         const sx=dx/distance*force,sy=dy/distance*force;
         enemy._sepX+=sx;
         enemy._sepY+=sy;
         other._sepX-=sx;
         other._sepY-=sy;
       }
     }
   }
 }
 return checks;
}
window.WorldRules={build,bounds,intersects,free,safeSpawn,move,separation,indexEnemies,nearbyEnemyIndices};
})();
