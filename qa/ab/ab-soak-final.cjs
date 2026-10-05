// Continue after both isolated CPU runs, then collect the final shared-host suite.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const base=path.join(__dirname,'results/soak'),results=[];
async function run(file,folder,env={}){
 const exitCode=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[path.join(__dirname,file)],{windowsHide:true,env:{...process.env,PORT:'8846',QA_OUT:path.join(base,folder),...env},stdio:['ignore','pipe','pipe']});child.stdout.pipe(process.stdout);child.stderr.pipe(process.stderr);child.on('error',reject);child.on('close',resolve);});
 results.push({file,folder,exitCode});fs.writeFileSync(path.join(base,'final-suite.json'),JSON.stringify(results,null,2));return exitCode;
}
(async()=>{
 if(process.env.QA_WAIT_CPU==='1')while(!fs.existsSync(path.join(base,'throttle-suite.json')))await new Promise(r=>setTimeout(r,1000));
 await Promise.all([
  run('ab-soak.cjs','final-1x',{PORT:'8831',QA_SECONDS:'900',QA_WARMUP_SECONDS:'30',QA_CPU_RATE:'1',QA_MAPS:'kapalicarsi,uskudar,besiktas,eminonu',QA_SOAK_RUNS:'2'}),
  (async()=>{await run('ab-natural.cjs','natural-final',{PORT:'8839',QA_RUNS:JSON.stringify({besiktas:3,eminonu:3,uskudar:3,kapalicarsi:3}),QA_DAMAGE_TRACE:'1',QA_ALL_MAPS:'0',QA_MODIFIERS:'0',QA_NATURAL_SECONDS:'180'});await run('ab-first-session.cjs','first-session');})()
 ]);
 for(const [file,folder] of [['ab-controlled.cjs','final-controlled'],['ab-opening-test.cjs','final-controlled'],['ab-natural-ui-test.cjs','final-controlled'],['ab-render-bound-test.cjs','final-render'],['ab-hud-noop-test.cjs','final-hud'],['ab-floor-icon-test.cjs','final-floor-icons'],['ab-tutorial-test.cjs','final-tutorial'],['ab-natural-exit-test.cjs','final-exit']])await run(file,folder);
 for(let i=1;i<=3;i++)await run('ab-layout-test.cjs','final-layout-'+i);
 await run('ab-soak-integrity.cjs','');await run('ab-soak-report.cjs','');
 if(results.some(r=>r.exitCode!==0))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
