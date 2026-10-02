import inserts from './editorial-inserts.json' with {type:'json'};
// Explicit September 24 author approvals and presentation decisions. Apply after
// CMS composition so an older published snapshot cannot undo these corrections.
export function applyEditorialPolicy(html, pathname, records = inserts) {
 if(!html)return html;
 const path=pathname||html.match(/<link\b[^>]*rel="canonical"[^>]*href="https?:\/\/[^/]+([^"?]+)/i)?.[1];
 // Story Room text replaced an inherited member-insight grid in this article.
 // Keep approved prose and inserts, but discard the old card/truncation behavior.
 if(['/articles/who-am-i-behind-the-mask/','/topics/self-worth/'].includes(path)){
  html=html.replace(/(<article\b[^>]*class="[^"]*rd-article[^"]*"[^>]*>)([\s\S]*?)(<\/article>)/i,(_,open,body,close)=>{
   if(body.includes('data-mask-prose'))return open+body+close;
   body=body.replace(/<button\b[^>]*data-insight-read-more[^>]*>[\s\S]*?<\/button>/gi,'');
   body=body.replace(/\sdata-insight-(?:grid|card-text|read-more)(?:="[^"]*")?/gi,'');
   body=body.replace(/\saria-label="Member insights[^"]*"/gi,'');
   body=body.replace(/<(p|h2|h3|div|section|aside)\b[^>]*>/gi,tag=>tag.replace(/\sclass="([^"]*)"/i,(_,classes)=>{
    const retired=new Set(['eyebrow','share-heading','share-prompt','sd-small','section--md','insight-grid','insight-card','insight-card-text','truncated','insight-card-attribution','panel-outlined','share-card']);
    const kept=classes.split(/\s+/).filter(c=>!retired.has(c)&&!(c==='pull-quote'&&/^<p\b/i.test(tag)&&/data-cms-block=/.test(tag)));
    return kept.length?' class="'+kept.join(' ')+'"':'';
   }));
   return open+'<div class="prose-reading" data-mask-prose>'+body+'</div>'+close;
  });
 }
 // October 1 approved Worry Loop artwork: keep the imported transcript in sync.
 if(['/articles/letting-go/','/topics/letting-go/'].includes(path)){
  html=html.replace(/(<div class="visually-hidden">)([\s\S]*?)(<\/div>)/g,(all,open,text,close)=>
   text.includes('The Worry Loop.')?open+text.replaceAll('Scanning the future','Scanning for problems').replaceAll('Reviewing the past','Regretting the past').replaceAll('Taking responsibility','Creating expectations')+close:all);
 }
 // Published CMS snapshots also receive the current shared Home navigation.
 if(path && path !== '/') {
  html=html.replace(/(<nav\b[^>]*(?:class="site-nav"|aria-label="Mobile navigation")[^>]*>)([\s\S]*?)(<\/nav>)/gi, (all,open,links,close)=>{
   if(/>Home<\//.test(links))return all;
   const home=open.includes('Mobile navigation')
    ? '<a href="/" class="mobile-menu-row"><span class="mobile-menu-label">Home</span></a>'
    : '<a href="/" class="nav-link">Home</a>';
   return open+home+links+close;
  });
 }
 html=html.replaceAll('/september-25-vision-and-improvement/','/september-25/').replaceAll('/october-31-the-intimacy-of-transparency/','/october-31/');
 const authorPaths=['/articles/voices-from-the-grave/','/articles/the-line-i-kept-moving/'];
 const description='Finding help when someone else’s drinking is affecting your life.';
 if(authorPaths.includes(path)){
  html=html.replaceAll('Jeff J.','Lance W').replaceAll('Jeff’s story','Lance’s story');
  if(!/class="story-byline"/.test(html))html=html.replace(/(<article\b[^>]*class="[^"]*rd-article[^\"]*"[^>]*>)/i,'$1<p class="story-byline">By Lance W</p>');
  html=html.replace(/<meta\b(?=[^>]*(?:name|property)="(?:author|article:author)")[^>]*>/gi,'');
  html=html.replace('</head>','<meta name="author" content="Lance W">\n</head>');
 }
 if(path==='/guides/finding-help/'){
  html=html.replace(/(<p\b[^>]*class="photo-hero-sub"[^>]*>)[\s\S]*?<\/p>/i,'$1'+description+'</p>');
  html=html.replace(/<meta\b(?=[^>]*(?:name|property)="(?:description|og:description|twitter:description)")[^>]*>/gi,tag=>tag.replace(/content="[^"]*"/,`content="${description}"`));
 }
 if(authorPaths.includes(path)||path==='/guides/finding-help/')html=html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/gi,(all,open,json,close)=>{
  try{const data=JSON.parse(json);const walk=value=>{if(!value||typeof value!=='object')return;if(['Article','BlogPosting','WebPage'].some(t=>[].concat(value['@type']||[]).includes(t))){if(authorPaths.includes(path))value.author={'@type':'Person',name:'Lance W'};if(path==='/guides/finding-help/')value.description=description;}Object.values(value).forEach(v=>Array.isArray(v)?v.forEach(walk):walk(v));};walk(data);return open+JSON.stringify(data).replaceAll('<','\\u003c')+close;}catch{return all;}
 });
 const plain=s=>s.replace(/<[^>]+>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[n]).replace(/\s+/g,' ').trim();
 html=html.replace(/<(aside|section)\b[^>]*class="[^"]*(?:boundary-insert--preparation|voices-practice|dp-text-panel--story)[^"]*"[^>]*>[\s\S]*?<\/\1>/gi,block=>{
  const item=records.find(item=>item.key===plain(block));if(!item)return block;
  const alt=item.alt.replaceAll('&','&amp;').replaceAll('"','&quot;');
  return `<figure class="story-insert editorial-vector"><button type="button" data-story-insert aria-label="Enlarge ${alt}"><img src="/assets/inserts/${item.name}.svg" alt="${alt}" width="${item.width}" height="${item.height}" loading="lazy"></button><div class="story-insert-transcript">${block}</div></figure>`;
 });
 html=html.replace(/<details\b[^>]*class="story-insert-text"[^>]*>[\s\S]*?<\/details>/gi,block=>block.replace(/<details[^>]*>/,'<div class="story-insert-transcript">').replace(/<summary>[\s\S]*?<\/summary>/,'').replace('</details>','</div>'));
 html=html.replaceAll('Four reflections on boundaries and self-worth. Complete text follows.','Four reflections on boundaries and self-worth.');
 // Retire older per-page handlers; one dialog now handles all informational art.
 html=html.replace(/<script\b[^>]*src="[^\"]*\/js\/(?:boundaries|surrender)\.js[^\"]*"[^>]*><\/script>/gi,'');
 if(!html.includes('src="/js/inserts.js'))html=html.replace('</body>','<script src="/js/inserts.js?v=20260924" defer></script>\n</body>');
 if(!html.includes('href="/css/inserts.css'))html=html.replace('</head>','<link rel="stylesheet" href="/css/inserts.css?v=20260924">\n</head>');
 return html;
}
