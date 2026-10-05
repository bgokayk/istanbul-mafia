// Losslessly archive only this task's large raw diagnostics; keep summaries plain.
const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto');
const root=fs.realpathSync(path.join(__dirname,'results/soak')),rows=[];
for(const rel of ['trace-4x/kapalicarsi-4x-1-trace.json','heap-diagnostic/uskudar-1x-1-start.heapsnapshot','heap-diagnostic/uskudar-1x-1-end.heapsnapshot']){
 const src=path.resolve(root,rel),dest=src+(src.endsWith('.json')?'.gz':'.json.gz');
 if(!fs.existsSync(src)&&fs.existsSync(dest))continue;
 const inside=p=>p.toLowerCase().startsWith((root+path.sep).toLowerCase());
 if(!inside(fs.realpathSync(src))||!inside(path.join(fs.realpathSync(path.dirname(dest)),path.basename(dest))))throw Error('Archive path outside QA results');
 const bytes=fs.readFileSync(src),packed=zlib.gzipSync(bytes);
 fs.writeFileSync(dest,packed,{flag:'wx'});
 if(!zlib.gunzipSync(fs.readFileSync(dest)).equals(bytes))throw Error('Archive verification failed; original retained');
 rows.push({source:rel,archive:path.relative(root,dest).replaceAll('\\','/'),bytes:bytes.length,compressedBytes:packed.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
 fs.unlinkSync(src);
}
if(rows.length)fs.writeFileSync(path.join(root,'archive-manifest.json'),JSON.stringify(rows,null,2));
console.log(JSON.stringify(rows));
