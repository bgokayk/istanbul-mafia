const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'results/night');
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const before=JSON.parse(fs.readFileSync(path.join(out,'protected-before.json')));
function compare(files,allowed=()=>false){const changed=[],missing=[];for(const [f,h]of Object.entries(files)){if(!fs.existsSync(f))missing.push(f);else if(hash(f)!==h&&!allowed(f))changed.push(f);}return{checked:Object.keys(files).length,changed,missing};}
const result={v1:compare(before.v1),androidExceptIcons:compare(before.android,f=>/[/\\]res[/\\]mipmap-[^/\\]+[/\\]ic_launcher[^/\\]*$/.test(f)),textures:compare(before.textures),scan:[],images:[],listings:[]};
const forbidden=/polat|memati|çakır|cakir|abdülhey|abdulhey|necmi|eşref|esref|premium|abonelik|reklamsiz|jackpot/i;
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
for(const f of walk(path.join(root,'www'))){const data=fs.readFileSync(f);if(data.includes(0))continue;const matches=data.toString('utf8').split(/\r?\n/).filter(line=>forbidden.test(line));if(matches.length)result.scan.push({file:path.relative(root,f),count:matches.length});}
const html=fs.readFileSync(path.join(root,'www/index.html'),'utf8');result.version=html.match(/var APP_VERSION='([^']+)'/)[1];result.productionTestHook=html.includes('__testEval');
for(const f of walk(path.join(__dirname,'results/screenshots')).filter(f=>f.endsWith('.png'))){const b=fs.readFileSync(f);result.images.push({file:path.basename(f),width:b.readUInt32BE(16),height:b.readUInt32BE(20),colorType:b[25],bytes:b.length});}
result.androidIcons=walk(path.join(root,'android/app/src/main/res')).filter(f=>/[/\\]mipmap-[^/\\]+[/\\]ic_launcher[^/\\]*\.png$/.test(f)).map(f=>{const b=fs.readFileSync(f);return{file:path.relative(root,f),width:b.readUInt32BE(16),height:b.readUInt32BE(20),sha256:hash(f)};});
for(const lang of ['tr','en']){const text=fs.readFileSync(path.join(root,`docs/store-listing-${lang}.md`),'utf8'),sections=text.split(/^## /m);const title=sections[1].split('\n').slice(2).join('\n').trim(),short=sections[2].split('\n').slice(2).join('\n').trim();result.listings.push({language:lang,titleLength:title.length,shortLength:short.length});assert(title.length<=30);assert(short.length<=80);}
fs.writeFileSync(path.join(out,'release-audit.json'),JSON.stringify(result,null,2));
assert.equal(result.version,'1.0.0');assert.equal(result.productionTestHook,false);assert.equal(result.scan.length,0);
for(const key of ['v1','androidExceptIcons','textures'])assert.equal(result[key].changed.length+result[key].missing.length,0,key);
const shots=result.images.filter(x=>/^0[1-5]-/.test(x.file));assert.equal(shots.length,5);assert(shots.every(x=>x.width===1080&&x.height===1920));
const feature=result.images.find(x=>x.file==='feature-1024x500.png');assert(feature.width===1024&&feature.height===500&&feature.colorType===2);
const icon=result.images.find(x=>x.file==='play-icon-512.png');assert(icon.width===512&&icon.height===512&&icon.bytes<1024*1024);
assert(result.androidIcons.length>=18);console.log(JSON.stringify({pass:true,version:result.version,protectedFiles:result.v1.checked+result.androidExceptIcons.checked,textureFiles:result.textures.checked,forbiddenMatches:0,screenshots:shots.length,androidIcons:result.androidIcons.length}));
