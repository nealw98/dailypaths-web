await import('../build.mjs');
const {readFileSync}=await import('node:fs');
const {applyCmsRouting}=await import('../helpers/cms-routing.mjs');
const snapshot=JSON.parse(readFileSync(new URL('../data/story-room-cache.json',import.meta.url),'utf8'));
applyCmsRouting(process.env.SITE_ENV==='production'?'docs':'dist',snapshot.routes||[]);
if(process.env.SITE_ENV!=='production')await import('./package-cms-preview.mjs');
