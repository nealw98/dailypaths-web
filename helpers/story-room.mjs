import {writeFileSync,readFileSync,mkdirSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
export const CMS_ORIGIN='https://daily-paths-story-room.nealw98.chatgpt.site';
export const PREVIEW_ORIGIN='https://daily-paths-soft-daylight.nealw98.chatgpt.site';
export const validPath=p=>/^\/(?:articles|guides|topics)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(p)||p==='/about-alanon/';
export const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function composePage(base,approved){
 if(!base)return approved;
 let html=base;
 for(const re of [/<main\b[\s\S]*?<\/main>/i,/<title>[\s\S]*?<\/title>/i]){const value=approved.match(re)?.[0];if(value)html=html.replace(re,()=>value);}
 for(const name of ['description','og:title','og:description','og:image','og:url','twitter:title','twitter:description','twitter:image']){
  const re=new RegExp('<meta\\b(?=[^>]*(?:name|property)=["\']'+name+'["\'])[^>]*>','i');const value=approved.match(re)?.[0];if(value)html=re.test(html)?html.replace(re,()=>value):html.replace('</head>',()=>value+'\n</head>');
 }
 // Editorial structured data belongs to the approved article; site navigation stays current.
 const data=[...approved.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi)].map(m=>m[0]).join('\n');
 if(data)html=html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,'').replace('</head>',()=>data+'\n</head>');
 return html;
}
export async function getPublished(){
 const r=await fetch(CMS_ORIGIN+'/api/room/published',{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('Story Room publication feed unavailable; stopping to preserve approved content.');
 const data=await r.json();if(!Array.isArray(data.items))throw new Error('Invalid Story Room publication feed.');return data.items.filter(x=>validPath(x.path));
}
export function syncCatalog(items,articles,guides){
 for(const item of items){const wanted=item.content_type==='guide'?guides:articles,other=item.content_type==='guide'?articles:guides;const old=other.findIndex(x=>x.path===item.path);if(old>=0)other.splice(old,1);const data={title:item.card_title||item.title,path:item.path,description:item.summary,image:item.hero_url,alt:item.hero_alt,category:item.author?'Personal story · '+item.author:'Article',cms:true};const existing=wanted.find(x=>x.path===item.path);if(existing)Object.assign(existing,data);else wanted.push(data);}
}
export async function applyPublished(outDir,{production=false,origin=PREVIEW_ORIGIN,items}={}){
 items??=await getPublished();
 for(const item of items){const r=await fetch(CMS_ORIGIN+'/api/room/published?path='+encodeURIComponent(item.path),{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('Could not retrieve approved page '+item.path);const page=await r.json();const dest=join(outDir,item.path,'index.html');let html=composePage(existsSync(dest)?readFileSync(dest,'utf8'):null,page.html);
  html=html.replaceAll(PREVIEW_ORIGIN,origin);if(production)html=html.replace(/<meta\b(?=[^>]*name=["']robots["'])[^>]*>/gi,'');mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html);
 }
 return items;
}
