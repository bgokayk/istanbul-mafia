// Real browser regression: a zero-size HUD must never produce a passing layout.
const fs=require('fs'),path=require('path'),assert=require('assert');
if(process.env.QA_LAYOUT_FAULT==='zero'){
 const Module=require('module'),load=Module._load;
 Module._load=function(request,parent,isMain){const value=load.apply(this,arguments);
  if(request==='./ab-harness.cjs'&&parent.filename.endsWith('ab-layout-test.cjs'))return {...value,start:async(p,...args)=>{await value.start(p,...args);await p.addStyleTag({content:'#ultHud{width:0!important;height:0!important;min-width:0!important;min-height:0!important;max-width:0!important;max-height:0!important;padding:0!important;border:0!important;overflow:hidden!important;}'});}};
  return value;
 };require('./ab-layout-test.cjs');
}else{
 const out=path.resolve(process.env.QA_OUT||path.join(__dirname,'results/night/layout-negative'));fs.mkdirSync(out,{recursive:true});
 const child=require('child_process').spawnSync(process.execPath,[__filename],{env:{...process.env,QA_LAYOUT_FAULT:'zero',QA_OUT:out},encoding:'utf8',timeout:45000});
 fs.writeFileSync(path.join(out,'negative.json'),JSON.stringify({fault:'zero-size ultHud',expectedExit:1,actualExit:child.status,stderr:child.stderr},null,2));
 assert.equal(child.status,1,child.stderr);console.log('Zero-size HUD correctly failed with exit 1');
}
