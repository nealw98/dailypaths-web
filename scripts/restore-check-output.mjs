import fs from 'node:fs';import path from 'node:path';
const target=process.argv[2];if(!target||!path.isAbsolute(target))throw Error('Provide an absolute temporary output directory');
fs.mkdirSync(target,{recursive:true});fs.cpSync('dist/client',target,{recursive:true});
const source=fs.readFileSync('dist/server/index.js','utf8');const fallback=JSON.parse(source.split('\n')[0].slice('const fallback='.length,-1));
for(const [route,html] of Object.entries(fallback)){const file=path.join(target,route,route.endsWith('/')?'index.html':'');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);}
// Represent the Worker's redirect-only routes in the static validation view.
const {LAUNCH_REVIEW}=await import('../helpers/launch-review.mjs');
for(const [from,to] of Object.entries(LAUNCH_REVIEW.consolidated)){const file=path.join(target,from,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,`<html><head><meta http-equiv="refresh" content="0;url=${to}"></head><body></body></html>`);}
