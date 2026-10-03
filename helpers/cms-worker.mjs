// This small HTTP layer serves only CMS-managed routes. The existing static
// generator and its assets continue to serve reflections and the rest of the site.
export function createCmsWorker(fallback,knownPaths,composePage,launchPolicy={},transformPreview=html=>html,editorialPolicy=html=>html,syncChrome=html=>html){
 const origin='https://daily-paths-story-room.nealw98.chatgpt.site';
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return {async fetch(request){
  const u=new URL(request.url);let path=u.pathname.replace(/\/index\.html$/,'/');
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  if(!path.endsWith('/')&&!path.split('/').at(-1).includes('.'))return Response.redirect(u.origin+path+'/',308);
  let catalog=null;try{const response=await fetch(origin+'/api/room/published',{signal:AbortSignal.timeout(10000)});if(response.ok)catalog=await response.json();}catch{}
  const routes=catalog?.routes||launchPolicy.cmsRoutes||[];const route=routes.find(r=>r.path===path);
  const policy={...launchPolicy,deferred:(launchPolicy.deferred||[]).filter(p=>!(catalog?.items||[]).some(i=>i.path===p&&i.route_managed))};
  if(route?.kind==='redirect'&&route.target)return Response.redirect(u.origin+route.target+u.search,301);
  if(policy.retired?.includes(path))return new Response(request.method==='HEAD'?null:'This article has been removed.',{status:410,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
  // Consolidated into another page: 301 rather than the 410 above, so the link
  // equity follows the content to where it now lives.
  if(policy.consolidated?.[path])return Response.redirect(u.origin+policy.consolidated[path]+u.search,301);
  if(path==='/sitemap.xml'){let xml=fallback[path]||'';const moved=new Set(routes.filter(r=>r.kind==='redirect').map(r=>r.path));xml=xml.replace(/<url>[\s\S]*?<\/url>/g,block=>{const loc=block.match(/<loc>([^<]+)<\/loc>/)?.[1];return loc&&moved.has(new URL(loc).pathname)?'':block;});for(const item of catalog?.items||[]){if(!xml.includes('<loc>'+u.origin+item.path+'</loc>'))xml=xml.replace('</urlset>','<url><loc>'+esc(u.origin+item.path)+'</loc></url></urlset>');}return new Response(request.method==='HEAD'?null:xml,{headers:{'Content-Type':'application/xml','X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store'}});}
  const isIndex=['/','/articles/','/guides/'].includes(path);
  const eligible=isIndex||!!fallback[path]||/^\/(articles|guides|topics|steps|themes)\/[a-z0-9-]+\/$/.test(path);
  if(!eligible)return new Response('Page not found',{status:404});
  // These three manuscripts are explicitly awaiting review. Keep approved CMS
  // snapshots intact while the development site renders the review version.
  if(policy.drafts?.includes(path)&&!policy.cmsManaged?.includes(path)&&fallback[path])return new Response(request.method==='HEAD'?null:fallback[path],{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
  let html=fallback[path],revision='';
  try{
   let cmsPath=path;
   const linkedId=route?.story_id||Object.keys(policy.linkedStories||{}).find(id=>policy.linkedStories[id]===path);
   if(linkedId){const item=catalog?.items?.find(item=>item.id===linkedId);if(item)cmsPath=item.path;}
   const r=isIndex&&catalog?{ok:true,json:async()=>catalog}:await fetch(origin+'/api/room/published'+(isIndex?'':'?path='+encodeURIComponent(cmsPath)),{signal:AbortSignal.timeout(10000)});
   if(r.ok){const data=await r.json();
    if(data.redirect)return Response.redirect(u.origin+data.redirect+u.search,301);
    if(!isIndex){html=composePage(html,cmsPath===path?data.html:data.html.replaceAll(cmsPath,path));revision=data.revision;}
    else{
     const items=(data.items||[]).map(item=>({...item,path:item.route_managed?item.path:policy.linkedStories?.[item.id]||item.path})).filter(item=>!item.id?.startsWith('website-step-')).filter(item=>!policy.retiredPaths?.includes(item.path)&&!policy.deferred?.includes(item.path)&&!policy.retired?.includes(item.path)&&!policy.consolidated?.[item.path]).map(item=>{const override=policy.metadata?.[item.path];return override?{...item,author:override.author||item.author,card_title:override.title||item.card_title,summary:(override.description||item.summary)+(policy.drafts?.includes(item.path)&&!policy.cmsManaged?.includes(item.path)?' Placeholder':'')}:item;});
     // Keep the established index composition. Add newly published pages in the same lists.
     let response=new Response(html,{headers:{'Content-Type':'text/html'}});
     let rewriter=new HTMLRewriter();
     for(const old of routes.filter(r=>r.kind==='redirect')){
      rewriter=rewriter.on(`[data-cms-path="${old.path}"]`,{element(el){el.remove();}});
      rewriter=rewriter.on(`.sd-guide-list a[href="${old.path}"]`,{element(el){el.remove();}});
     }
     for(const item of items){
      if(!/^\/[a-z0-9/-]+\/$/.test(item.path))continue;
      const selector=`a[href="${item.path}"]`;
      if(policy.cmsManaged?.includes(item.path))rewriter=rewriter.on(`[data-cms-path="${item.path}"] .sd-kicker`,{element(el){el.setInnerContent((item.content_type==='guide'?'Guide':'Article')+(item.author?' · '+item.author:''));}});
      rewriter=rewriter.on(`h3 ${selector},h2 ${selector}`,{element(el){el.setInnerContent(item.card_title||item.title);}});
      rewriter=rewriter.on(`.sd-guide-list ${selector} h3`,{element(el){el.setInnerContent(item.card_title||item.title);}});
      rewriter=rewriter.on(`.sd-guide-list ${selector} p`,{element(el){el.setInnerContent(item.summary);}});
      rewriter=rewriter.on(`[data-cms-path="${item.path}"] .cms-card-summary`,{element(el){el.setInnerContent(item.summary);}});
      rewriter=rewriter.on(`[data-cms-path="${item.path}"] img`,{element(el){if(item.hero_url){el.setAttribute('src',item.hero_url);el.setAttribute('alt',item.hero_alt||'');}}});
      if(path==='/articles/'&&item.content_type!=='article'||path==='/guides/'&&item.content_type!=='guide')rewriter=rewriter.on(`[data-cms-path="${item.path}"]`,{element(el){el.remove();}});
     }
     const fresh=items.filter(x=>!knownPaths.some(k=>k.path===x.path&&k.content_type===x.content_type)&&(path==='/articles/'?x.content_type==='article':path==='/guides/'?x.content_type==='guide':false));
     if(fresh.length){const cards=fresh.map(x=>x.content_type==='guide'?`<li><a href="${esc(x.path)}"><span><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p></span></a></li>`:`<article class="sd-story">${x.hero_url?`<a class="sd-story-image" href="${esc(x.path)}"><img src="${esc(x.hero_url)}" alt="${esc(x.hero_alt)}" loading="lazy"></a>`:''}<h3><a href="${esc(x.path)}">${esc(x.title)}</a></h3><p>${esc(x.summary)}</p><a class="sd-text-link" href="${esc(x.path)}">Read the article</a></article>`).join('');
      rewriter=rewriter.on(path==='/guides/'?'.sd-guide-list':'.sd-article-library',{element(el){el.append(cards,{html:true});}});
     }
     html=await rewriter.transform(response).text();
    }
   }
  }catch{ /* Existing generated pages remain available during a transient CMS outage. */ }
  if(!html)return new Response('Page not found',{status:404});
  for(const r of routes.filter(r=>r.kind==='redirect'&&r.target))html=html.replaceAll('href="'+r.path+'"','href="'+r.target+'"');
  html=editorialPolicy(transformPreview(html,path,policy),path);
  html=syncChrome(html,fallback['/']);
  return new Response(request.method==='HEAD'?null:html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow',...(revision?{'X-Story-Room-Revision':revision}:{})}});
 }};
}
