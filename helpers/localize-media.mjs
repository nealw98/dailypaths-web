import {readdirSync,readFileSync,writeFileSync,existsSync,mkdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import sharp from 'sharp';

// Images uploaded in the Story Room are served from its own address. The live site should not depend on it,
// so each one is copied into assets/story-room/ (kept in the repo, so later builds work offline), converted to WebP,
// and the pages are pointed at the copy. A new Story Room image is picked up automatically on the next build.
const MEDIA=/https:\/\/daily-paths-story-room\.nealw98\.chatgpt\.site\/api\/room\/media\/([0-9a-f-]{36})/g;
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith('.html')?[join(dir,e.name)]:[]);

export async function localizeStoryRoomMedia({outDir,assetsDir,origin}){
 const files=walk(outDir),ids=new Set();
 for(const f of files)for(const m of readFileSync(f,'utf8').matchAll(MEDIA))ids.add(m[1]);
 const cache=join(assetsDir,'story-room'),published=join(outDir,'assets','story-room');
 mkdirSync(cache,{recursive:true});mkdirSync(published,{recursive:true});
 const have=new Map();let copied=0;
 for(const id of ids){
  const name=id+'.webp',file=join(cache,name);
  if(!existsSync(file)){
   try{
    const r=await fetch(`https://daily-paths-story-room.nealw98.chatgpt.site/api/room/media/${id}`,{signal:AbortSignal.timeout(30000)});
    if(!r.ok)throw new Error('status '+r.status);
    const type=r.headers.get('content-type')||'';
    if(!/^image\/(png|jpe?g|webp|avif)/.test(type))throw new Error('not a convertible image: '+type);
    const input=Buffer.from(await r.arrayBuffer());
    writeFileSync(file,await sharp(input).rotate().resize({width:2000,withoutEnlargement:true}).webp({quality:82}).toBuffer());
    copied++;
   }catch(e){console.warn(`  ! Story Room image ${id} left as a link: ${e.message}`);continue;}
  }
  writeFileSync(join(published,name),readFileSync(file));
  have.set(id,name);
 }
 // Share-preview tags and structured data need full addresses; everything else can be site-relative.
 const swap=(text,prefix)=>text.replace(MEDIA,(whole,id)=>have.has(id)?prefix+'/assets/story-room/'+have.get(id):whole);
 for(const f of files){
  let html=readFileSync(f,'utf8');const before=html;
  // The enlarge-image script is served from the site (js/story-insert-view.js) instead of the Story Room.
  html=html.replace(/(<script\b[^>]*\bsrc=")https:\/\/daily-paths-story-room\.nealw98\.chatgpt\.site\/insert-view\.js/gi,'$1/js/story-insert-view.js');
  html=html.replace(/<meta\b[^>]*>|<script\b[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi,tag=>swap(tag,origin));
  html=swap(html,'');
  if(html!==before)writeFileSync(f,html);
 }
 return {copied,kept:ids.size-have.size};
}
