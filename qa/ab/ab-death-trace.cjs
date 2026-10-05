// QA server response instrumentation only. Record the actual damage source without changing damage.
function instrument(html) {
  const sites = [
    ['applyDamage(e.type.auraDmg*dt/1000)', '__qaDamage(e.type.auraDmg*dt/1000,e,"aura")'],
    ['applyDamage(4*dt/1000)', '__qaDamage(4*dt/1000,e,"poison")'],
    ['applyDamage(11*dt/1000)', '__qaDamage(11*dt/1000,e,"flame")'],
    ['applyDamage(e.dmg)', '__qaDamage(e.dmg,e,"sniper")'],
    ['applyDamage(e.dmg*dt/1000)', '__qaDamage(e.dmg*dt/1000,e,"contact")']
  ];
  for (const [from,to] of sites) {
    if (!html.includes(from)) throw new Error('Damage probe target missing: '+from);
    html=html.replace(from,to);
  }
  return html.replace('// Android back handling', `
window.__deathTrace={events:[],totals:{},firstDamage:null};
function __qaDamage(amount,enemy,kind){
  const hp=P.hp,applied=applyDamage(amount);
  if(applied>0){
    const q=window.__deathTrace,id=enemy.type.id,key=id+':'+kind;
    const record={elapsed,wave,level:P.lvl,hpBefore:hp,hpAfter:P.hp,amount:applied,enemy:id,kind,distance:dn(P,enemy),enemies:enemies.length,x:P.x,y:P.y};
    q.totals[key]=(q.totals[key]||0)+applied;q.events.push(record);if(q.events.length>512)q.events.shift();if(!q.firstDamage)q.firstDamage=record;
  }
  return applied;
}
// Android back handling`);
}
module.exports={instrument};
