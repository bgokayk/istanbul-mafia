// Controlled regression: run the actual natural runner in child processes with
// a fake browser harness. No www files, game state or production hooks change.
const fs=require('fs'),path=require('path'),assert=require('assert');
const scenario=process.env.QA_EXIT_FIXTURE;
if(scenario){
  const Module=require('module'),load=Module._load;
  const out=process.env.QA_OUT;fs.mkdirSync(out,{recursive:true});
  let now=10000,step=0,onError=()=>{};Date.now=()=>now;
  const locator={isVisible:async()=>false,count:async()=>0,click:async()=>{},first(){return this;}};
  const p={on:(event,cb)=>{if(event==='pageerror')onError=cb;},evaluate:async()=> 'fixture',waitForTimeout:async ms=>{now+=ms;},locator:()=>locator,keyboard:{up:async()=>{},down:async()=>{},press:async()=>{}},screenshot:async()=>{}};
  const ctx={newPage:async()=>p,close:async()=>{}};
  const harness={fs,out,root:path.resolve(__dirname,'../../www'),server:{close(){}},launch:async()=>({newContext:async()=>ctx,close:async()=>{}}),start:async()=>{},ev:async(_p,code)=>{
    if(code==='selMap.id')return 'besiktas';if(!code.includes('const dirs='))return {x:100,y:100,free:true};
    step++;
    if(scenario==='js'&&step===2)onError(Error('intentional QA JavaScript fault'));
    const death=['death','death-js','death-collision'].includes(scenario)&&step===2;
    if(scenario==='death-js'&&death)onError(Error('intentional error alongside death'));
    return {elapsed:scenario==='freeze'?0:step*1000,end:death||(scenario==='early-end'&&step===2),hp:death?0:100,god:false,paused:false,modal:false,x:100+step,y:100,level:1,kills:0,modifier:null,ultReady:false,enemies:1,free:!(['collision','death-collision'].includes(scenario)&&step===2),near:200,choices:[{x:1,y:0,score:1}]};
  }};
  Module._load=function(request,parent,isMain){if(request==='./ab-harness.cjs'&&parent.filename.endsWith('ab-natural.cjs'))return harness;return load.apply(this,arguments);};
  require('./ab-natural.cjs');
}else{
  const {spawnSync}=require('child_process');
  const base=path.resolve(process.env.QA_OUT||path.join(__dirname,'results/exit-regression'));
  const results=[];
  for(const [name,exit,death]of [['complete',0,false],['death',0,true],['freeze',1,false],['collision',1,false],['js',1,false],['early-end',1,false],['death-js',1,true],['death-collision',1,true]]){
    const out=path.join(base,name);
    const child=spawnSync(process.execPath,[__filename],{env:{...process.env,QA_EXIT_FIXTURE:name,QA_RUNS:'{"besiktas":1}',QA_OUT:out},encoding:'utf8',timeout:15000});
    assert.equal(child.status,exit,name+': '+child.stderr);
    const [r]=JSON.parse(fs.readFileSync(path.join(out,'natural-summary.json'),'utf8'));
    assert.equal(r.death,death,name+' death');assert.equal(r.pass,exit===0,name+' pass');
    results.push({scenario:name,exitCode:child.status,death:r.death,outcome:r.outcome,failures:r.failures});
  }
  fs.writeFileSync(path.join(base,'exit-regression.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
}
