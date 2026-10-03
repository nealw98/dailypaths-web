import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createCmsWorker} from '../helpers/cms-worker.mjs';
if(!process.env.CMS_TEST_ROOT)throw Error('Set CMS_TEST_ROOT to the Story Room checkout for its Worker test runtime.');
const require=createRequire(new URL('file://'+process.env.CMS_TEST_ROOT+'/package.json'));
const {Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
let catalog={items:[{id:'new',path:'/articles/new/',route_managed:true,title:'New title',summary:'A summary',content_type:'article'}],routes:[{path:'/topics/old/',story_id:'new',kind:'redirect',target:'/articles/new/'},{path:'/articles/new/',story_id:'new',kind:'current',target:null}]};
const fallback={'/articles/':'<html><body><div class="sd-article-library"><article data-cms-path="/topics/old/"><h3><a href="/topics/old/">Old title</a></h3></article></div></body></html>','/topics/old/':'Old page','/sitemap.xml':'<urlset><url><loc>https://site.test/topics/old/</loc></url></urlset>','/steps/al-anon-step-1-honesty/':'Original step'};
const code=`${createCmsWorker.toString()}\nexport default createCmsWorker(${JSON.stringify(fallback)},[{path:'/topics/old/',content_type:'article'}],(base,approved)=>approved);`;
const mf=new Miniflare({modules:true,script:code,compatibilityDate:'2026-05-15',outboundService:async request=>{const path=new URL(request.url).searchParams.get('path');return Response.json(path?{html:'<html><main>Published body</main></html>',revision:'r1'}:catalog)}});
try{
 let r=await mf.dispatchFetch('https://site.test/topics/old/',{redirect:'manual'});assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://site.test/articles/new/');
 let html=await(await mf.dispatchFetch('https://site.test/articles/')).text();assert(html.includes('New title'));assert(!html.includes('Old title'));
 r=await mf.dispatchFetch('https://site.test/articles/new/',{redirect:'manual'});assert.equal(r.headers.get('x-story-room-revision'),'r1');
 let xml=await(await mf.dispatchFetch('https://site.test/sitemap.xml')).text();assert(xml.includes('/articles/new/'));assert(!xml.includes('/topics/old/'));
 catalog={items:[],routes:[...catalog.routes.map(r=>({...r,kind:'redirect',target:'/articles/'}))]};
 r=await mf.dispatchFetch('https://site.test/articles/new/',{redirect:'manual'});assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://site.test/articles/');
 html=await(await mf.dispatchFetch('https://site.test/articles/')).text();assert(!html.includes('Old title'));assert(!html.includes('New title'));
 catalog={items:[{id:'website-step-1',path:'/steps/al-anon-step-1-honesty/',title:'Step One',content_type:'article'}],routes:[]};
 r=await mf.dispatchFetch('https://site.test/steps/al-anon-step-1-honesty/');assert.equal(r.status,200);assert.equal(r.headers.get('x-story-room-revision'),'r1');
 html=await(await mf.dispatchFetch('https://site.test/articles/')).text();assert(!html.includes('>Step One<'),'Step essays retain their own collection');
 catalog={items:[],routes:[{path:'/topics/old/',story_id:'legacy',kind:'redirect',target:'/articles/',temporary:true}]};
 r=await mf.dispatchFetch('https://site.test/topics/old/',{redirect:'manual'});assert.equal(r.status,302);assert.equal(r.headers.get('location'),'https://site.test/articles/');assert.equal(r.headers.get('cache-control'),'no-store');
 xml=await(await mf.dispatchFetch('https://site.test/sitemap.xml')).text();assert(!xml.includes('/topics/old/'));
 const offlineCode=`${createCmsWorker.toString()}\nexport default createCmsWorker(${JSON.stringify(fallback)},[],(base,approved)=>approved,${JSON.stringify({cmsRoutes:catalog.routes})});`;
 const offline=new Miniflare({modules:true,script:offlineCode,compatibilityDate:'2026-05-15',outboundService:async()=>new Response('Unavailable',{status:503})});
 try{r=await offline.dispatchFetch('https://site.test/topics/old/',{redirect:'manual'});assert.equal(r.status,302,'CMS outage must not restore withdrawn fallback HTML');assert(!(await r.text()).includes('Old page'));}finally{await offline.dispose();}
 console.log('CMS routing checks passed: real HTML rewriting, 301s, listing removal/addition, sitemap and Step publication.');
}finally{await mf.dispose();}
