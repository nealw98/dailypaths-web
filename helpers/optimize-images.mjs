import {readdirSync,readFileSync,writeFileSync,existsSync,statSync} from 'node:fs';
import {join} from 'node:path';
import sharp from 'sharp';

// Photos and diagrams that are still JPG or PNG are served as WebP, which is far smaller at the same look.
// Source files in assets/ are untouched. The WebP copy is written next to the original in the built site, and every
// page and stylesheet is pointed at it. The original stays in place (old links and share-preview tags still work),
// and share-preview/structured-data tags keep the original format because social sites handle it most reliably.
const KEEP=/favicon|app-icon|og-image|apple-touch|logo/i;
const REF=/\/assets\/[^"'()\s,]+?\.(?:jpe?g|png)(?=["'()\s,?#]|$)/gi;
const walk=(dir,ok)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name),ok):ok(e.name)?[join(dir,e.name)]:[]);

export async function optimizeImages({outDir}){
 const files=[...walk(outDir,n=>/\.(html|css)$/.test(n))];
 const refs=new Set();
 for(const f of files)for(const m of readFileSync(f,'utf8').matchAll(REF))if(!KEEP.test(m[0]))refs.add(m[0]);
 const done=new Map();let saved=0;
 for(const ref of refs){
  const src=join(outDir,ref);if(!existsSync(src))continue;
  const out=src.replace(/\.(jpe?g|png)$/i,'.webp');
  try{
   // Phone screenshots are shown small; 944px wide is twice the largest display size.
   const width=/\/Screenshots\//i.test(ref)?944:2400;
   const buf=await sharp(src).rotate().resize({width,withoutEnlargement:true}).webp({quality:86,effort:5}).toBuffer();
   const before=statSync(src).size;
   if(buf.length>=before*0.9)continue;
   writeFileSync(out,buf);done.set(ref,ref.replace(/\.(jpe?g|png)$/i,'.webp'));saved+=before-buf.length;
  }catch(e){console.warn(`  ! ${ref} left as is: ${e.message}`);}
 }
 // Share-preview tags and structured data keep the original format.
 const swap=t=>t.replace(REF,m=>done.get(m)||m);
 for(const f of files){
  const html=readFileSync(f,'utf8');
  const out=f.endsWith('.css')?swap(html):html.replace(/(<meta\b[^>]*>|<script\b[^>]*application\/ld\+json[\s\S]*?<\/script>)|[^<]+|<[^>]*>/gi,(part,keep)=>keep?part:swap(part));
  if(out!==html)writeFileSync(f,out);
 }
 return {converted:done.size,savedKB:Math.round(saved/1024)};
}
