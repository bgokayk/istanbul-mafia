// Serialize the two CPU tests; optional file gates keep other QA runs out.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
(async()=>{
 for(const file of [process.env.QA_WAIT_FOR,process.env.QA_WAIT_FOR_EXTRA].filter(Boolean))while(!fs.existsSync(file))await new Promise(r=>setTimeout(r,1000));
 const results=[];
 for(const rate of [4,6]){
  const out=path.join(__dirname,'results/soak/final-'+rate+'x');
  const exitCode=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[path.join(__dirname,'ab-soak.cjs')],{windowsHide:true,env:{...process.env,PORT:String(8833+(rate===6?1:0)),QA_OUT:out,QA_SECONDS:'600',QA_WARMUP_SECONDS:'30',QA_MAPS:'kapalicarsi',QA_SOAK_RUNS:'1',QA_CPU_RATE:String(rate),QA_HEAP_SNAPSHOTS:'0'},stdio:['ignore','pipe','pipe']});child.stdout.pipe(process.stdout);child.stderr.pipe(process.stderr);child.on('error',reject);child.on('close',resolve);});
  results.push({rate,exitCode});
 }
 fs.writeFileSync(path.join(__dirname,'results/soak/throttle-suite.json'),JSON.stringify(results,null,2));if(results.some(r=>r.exitCode!==0))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
