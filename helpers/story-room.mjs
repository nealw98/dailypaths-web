import {applyEditorialPolicy} from './editorial-policy.mjs';
import {LAUNCH_REVIEW} from './launch-review.mjs';
import {syncHeroSocialImage} from './social-image.mjs';
import {loadStoryRoomCache,saveStoryRoomCache} from './story-room-cache.mjs';
import {writeFileSync,readFileSync,mkdirSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
export const CMS_ORIGIN='https://daily-paths-story-room.nealw98.chatgpt.site';
export const PREVIEW_ORIGIN='https://daily-paths-soft-daylight.nealw98.chatgpt.site';
// About Al-Anon and About the Al-Anon Program were consolidated into Finding
// Help and retired. Neither /about-alanon/ nor /guides/about-alanon/ is a place
// CMS content can land now; both only forward to /guides/finding-help/. The root
// path never matched this pattern, which is what kept the old import off the site.
export const validPath=p=>/^\/(?:articles|guides|topics)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(p);
export const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function moveBylineIntoTitleBlock(html){
 const byline=html.match(/<article\b[^>]*>\s*(<p class="story-byline">[^<]*<\/p>)/i)?.[1];
 if(!byline||!html.includes('photo-hero-inner'))return html;
 return html.replace(byline,'').replace(/(<div class="photo-hero-inner">[\s\S]*?)(\s*<\/div>\s*<\/header>)/i,(_,inner,end)=>`${inner}\n          ${byline}${end}`);
}
export function composePage(base,approved){
 if(!base)return syncHeroSocialImage(moveBylineIntoTitleBlock(approved),'https://daily-paths-soft-daylight.nealw98.chatgpt.site');
 let html=base;
 for(const re of [/<main\b[\s\S]*?<\/main>/i,/<title>[\s\S]*?<\/title>/i]){const value=approved.match(re)?.[0];if(value)html=html.replace(re,()=>value);}
 for(const name of ['description','og:title','og:description','og:image','og:url','twitter:title','twitter:description','twitter:image']){
  const re=new RegExp('<meta\\b(?=[^>]*(?:name|property)=["\']'+name+'["\'])[^>]*>','i');const value=approved.match(re)?.[0];if(value)html=re.test(html)?html.replace(re,()=>value):html.replace('</head>',()=>value+'\n</head>');
 }
 // Editorial structured data belongs to the approved article; site navigation stays current.
 const data=[...approved.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi)].map(m=>m[0]).join('\n');
 if(data)html=html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,'').replace('</head>',()=>data+'\n</head>');
 return syncHeroSocialImage(moveBylineIntoTitleBlock(html),'https://daily-paths-soft-daylight.nealw98.chatgpt.site');
}
export const CACHE_PATH=join(dirname(fileURLToPath(import.meta.url)),'..','data','story-room-cache.json');

/** The feed and every approved page, straight from the Story Room. Throws if any part is unavailable. */
async function fetchLive(){
 const r=await fetch(CMS_ORIGIN+'/api/room/published',{signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw new Error(`Story Room feed returned ${r.status}`);
 const data=await r.json();
 if(!Array.isArray(data.items))throw new Error('Story Room feed was not a list of items.');
 const pages={};
 for(const item of data.items){
  const p=await fetch(CMS_ORIGIN+'/api/room/published?path='+encodeURIComponent(item.path),{signal:AbortSignal.timeout(20000)});
  if(!p.ok)throw new Error(`Story Room returned ${p.status} for ${item.path}`);
  pages[item.path]=(await p.json()).html;
 }
 return {feed:data.items,pages};
}

/** Filtering and remapping run on each build, so a launch-review change takes effect even from cache. */
const selectPublished=({feed,pages})=>feed
 .filter(x=>validPath(x.path)&&!LAUNCH_REVIEW.retiredPaths.includes(x.path))
 .map(item=>({...item,cmsPath:item.path,path:LAUNCH_REVIEW.linkedStories[item.id]||item.path,html:pages[item.path]}))
 .filter(item=>!LAUNCH_REVIEW.retired.includes(item.path)&&!LAUNCH_REVIEW.consolidated[item.path]);

export async function getPublished({cachePath=CACHE_PATH}={}){
 let snapshot,live=true;
 try{
  snapshot=await fetchLive();
  saveStoryRoomCache(cachePath,snapshot);
 }catch(err){
  live=false;
  snapshot=loadStoryRoomCache(cachePath);
  if(!snapshot)throw new Error(`Story Room unavailable (${err.message}) and no cache at ${cachePath}. Refusing to publish with approved content missing.`);
  console.warn(`  WARNING: Story Room unavailable (${err.message}).`);
  console.warn(`  Building from content captured ${snapshot.capturedAt}. Anything published since is not in this build.`);
 }
 const items=selectPublished(snapshot);
 if(live)console.log(`  Story Room: ${items.length} published items`);
 for(const item of items)if(typeof item.html!=='string')throw new Error(`No approved HTML for ${item.cmsPath}; refusing to publish it empty.`);
 return items;
}
export function syncCatalog(items,articles,guides){
 for(const item of items){const wanted=item.content_type==='guide'?guides:articles,other=item.content_type==='guide'?articles:guides;const old=other.findIndex(x=>x.path===item.path);if(old>=0)other.splice(old,1);const data={title:item.card_title||item.title,path:item.path,description:LAUNCH_REVIEW.metadata[item.path]?.description||item.summary,image:item.hero_url,alt:item.hero_alt,category:'Article',author:LAUNCH_REVIEW.metadata[item.path]?.author||item.author,cms:true};const existing=wanted.find(x=>x.path===item.path);if(existing){data.category=existing.category;Object.assign(existing,data);}else wanted.push(data);}
}
export async function applyPublished(outDir,{production=false,origin=PREVIEW_ORIGIN,items}={}){
 items??=await getPublished();
 for(const item of items){const dest=join(outDir,item.path,'index.html');let html=composePage(existsSync(dest)?readFileSync(dest,'utf8'):null,item.html);
  if(item.cmsPath&&item.cmsPath!==item.path)html=html.replaceAll(item.cmsPath,item.path);
  html=applyEditorialPolicy(html,item.path);
  html=html.replaceAll(PREVIEW_ORIGIN,origin);if(production)html=html.replace(/<meta\b(?=[^>]*name=["']robots["'])[^>]*>/gi,'');mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html);
 }
 return items;
}
