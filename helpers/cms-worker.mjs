// This small HTTP layer serves only CMS-managed routes. The existing static
// generator and its assets continue to serve reflections and the rest of the site.
export function createCmsWorker(fallback,knownPaths,composePage){
 const origin='https://daily-paths-story-room.nealw98.chatgpt.site';
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return {async fetch(request){
  const u=new URL(request.url);let path=u.pathname.replace(/\/index\.html$/,'/');
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  if(!path.endsWith('/')&&!path.split('/').at(-1).includes('.'))return Response.redirect(u.origin+path+'/',308);
  const isIndex=['/','/articles/','/guides/'].includes(path);
  const eligible=isIndex||/^\/(articles|guides|topics)\/[a-z0-9-]+\/$/.test(path)||path==='/about-alanon/';
  if(!eligible)return new Response('Page not found',{status:404});
  let html=fallback[path],revision='';
  try{
   const r=await fetch(origin+'/api/room/published'+(isIndex?'':'?path='+encodeURIComponent(path)),{signal:AbortSignal.timeout(10000)});
   if(r.ok){const data=await r.json();
    if(!isIndex){html=composePage(html,data.html);revision=data.revision;}
    else{
     const items=data.items||[];
     // Keep the established index composition. Add newly published pages in the same lists.
     let response=new Response(html,{headers:{'Content-Type':'text/html'}});
     let rewriter=new HTMLRewriter();
     for(const item of items){
      if(!/^\/[a-z0-9/-]+\/$/.test(item.path))continue;
      const selector=`a[href="${item.path}"]`;
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
  return new Response(request.method==='HEAD'?null:html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow',...(revision?{'X-Story-Room-Revision':revision}:{})}});
 }};
}
