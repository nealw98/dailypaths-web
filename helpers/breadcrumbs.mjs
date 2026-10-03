import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

// Adds a BreadcrumbList to every searchable page that does not already have one (hubs, step essays, month pages,
// policy pages, and Story Room pages whose saved copy carries only Article data). Reflection and topic pages
// build their own breadcrumbs and are left alone.
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name==='index.html'?[join(dir,e.name)]:[]);
const decode=s=>s.replace(/&rsquo;|&#8217;|&#39;/g,'’').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ');
const text=html=>decode(html.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
// Where a page sits in the site, by its first path segment: [parent name, parent address].
const PARENT={articles:['Articles','/articles/'],guides:['Guides','/guides/'],steps:['The Twelve Steps','/guides/twelve-steps/'],months:['Daily Reflections','/reflections/'],reflections:['Daily Reflections','/reflections/']};

export function addBreadcrumbs({outDir,origin}){
 let added=0;
 for(const file of walk(outDir)){
  const path='/'+file.slice(outDir.length+1).replace(/index\.html$/,'');
  if(path==='/')continue;
  let html=readFileSync(file,'utf8');
  if(/http-equiv="refresh"|name="robots"[^>]*noindex|BreadcrumbList/i.test(html))continue;
  const h1=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title=text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'').split(' | ')[0].split(' — ')[0];
  const name=title||text(h1||'');
  if(!name)continue;
  const parts=path.split('/').filter(Boolean),parent=parts.length>1?PARENT[parts[0]]:null;
  if(parts.length>1&&!parent)continue;
  const crumbs=[['Home','/'],...(parent&&parent[1]!==path?[parent]:[]),[name,path]];
  const json=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map(([n,p],i)=>({'@type':'ListItem',position:i+1,name:n,item:origin+p}))},null,2);
  html=html.replace('</head>',()=>`  <!-- Structured Data -->\n  <script type="application/ld+json">\n${json}\n  </script>\n</head>`);
  writeFileSync(file,html);added++;
 }
 return added;
}
