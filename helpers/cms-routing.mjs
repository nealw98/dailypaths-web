import fs from 'node:fs';
import path from 'node:path';
export function applyCmsRouting(directory,routes=[]){
 const redirects=routes.filter(r=>r.kind==='redirect'&&r.target);
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 for(const r of redirects){if(!/^\/(?:[a-z0-9-]+\/)+$/.test(r.path)||!/^\/(?:[a-z0-9-]+\/)*$/.test(r.target))throw Error('Invalid CMS redirect');const file=path.join(directory,r.path,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,`<!doctype html><html><head><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${escape(r.target)}"><link rel="canonical" href="${escape(r.target)}"></head><body><a href="${escape(r.target)}">Continue</a></body></html>`);}
 function rewrite(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())rewrite(file);else if(item.name.endsWith('.html')){let html=fs.readFileSync(file,'utf8');for(const r of redirects)html=html.replaceAll('href="'+r.path+'"','href="'+r.target+'"');fs.writeFileSync(file,html);}}}rewrite(directory);
 const sitemap=path.join(directory,'sitemap.xml');if(fs.existsSync(sitemap)){const moved=new Set(redirects.map(r=>r.path));const xml=fs.readFileSync(sitemap,'utf8').replace(/<url>[\s\S]*?<\/url>/g,block=>{const url=block.match(/<loc>([^<]+)<\/loc>/)?.[1];return url&&moved.has(new URL(url).pathname)?'':block;});fs.writeFileSync(sitemap,xml);}
}
