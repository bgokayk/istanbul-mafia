// Four independent fresh saves, up to 10 game minutes or legitimate death.
// Eminonu retains its production three-minute deadline. No invulnerability.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const base=path.resolve(process.env.QA_OUT||path.join(__dirname,'results/soak/first-session'));
(async()=>{
 if(process.env.QA_WAIT_FOR)while(!fs.existsSync(process.env.QA_WAIT_FOR))await new Promise(r=>setTimeout(r,1000));
 fs.mkdirSync(base,{recursive:true});
 const results=await Promise.all(['kapalicarsi','uskudar','besiktas','eminonu'].map((map,i)=>new Promise((resolve,reject)=>{
  const out=path.join(base,map),child=spawn(process.execPath,[path.join(__dirname,'ab-natural.cjs')],{windowsHide:true,env:{...process.env,PORT:String(8840+i),QA_OUT:out,QA_RUNS:JSON.stringify({[map]:1}),QA_NATURAL_SECONDS:'600',QA_DAMAGE_TRACE:'1',QA_ALL_MAPS:'0',QA_MODIFIERS:'0'},stdio:['ignore','pipe','pipe']});
  child.stdout.pipe(process.stdout);child.stderr.pipe(process.stderr);child.on('error',reject);
  child.on('close',code=>{const file=path.join(out,'natural-summary.json');resolve({map,exitCode:code,runs:fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[]});});
 })));
 fs.writeFileSync(path.join(base,'summary.json'),JSON.stringify(results,null,2));if(results.some(r=>r.exitCode!==0||r.runs.length!==1))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
