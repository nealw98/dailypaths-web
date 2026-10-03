import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createCmsWorker} from '../helpers/cms-worker.mjs';
import {composePage} from '../helpers/story-room.mjs';
import {LAUNCH_REVIEW,transformLaunchPreview,launchItems} from '../helpers/launch-review.mjs';

const root=path.resolve(process.argv[2]||'dist');
const source=fs.readFileSync(path.join(root,'server/index.js'),'utf8');
const fallback=JSON.parse(source.split('\n')[0].slice('const fallback='.length,-1));
const paths=Object.keys(fallback);
for(const route of LAUNCH_REVIEW.deferred) assert.ok(fallback[route],`Retain ${route}`);
for(const route of LAUNCH_REVIEW.drafts) assert.match(fallback[route],/Placeholder content/);
for(const route of ['/','/guides/','/articles/']){
 for(const deferred of LAUNCH_REVIEW.deferred) assert.ok(!fallback[route].includes(`href="${deferred}"`),`${route} promotes ${deferred}`);
}
// Every local resource and destination used by the launch pages must exist.
for (const [route,html] of Object.entries(fallback)) {
 for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
  if(!match[1].startsWith('/')) continue;
  const pathname=new URL(match[1],'https://review.test').pathname;
  const destination=path.join(root,'client',pathname,pathname.endsWith('/')?'index.html':'');
  assert.ok(fallback[pathname] || fs.existsSync(destination),route+' has missing destination/resource '+pathname);
 }
}
// Five guides including The Twelve Steps;
// seven articles since the first-meeting piece, Who Am I Behind the Mask, The
// Stories We Tell Ourselves and Learning to Trust were published.
assert.equal((fallback['/guides/'].match(/<li data-cms-path=/g)||[]).length,5);
assert.equal((fallback['/articles/'].match(/<article class="sd-story"/g)||[]).length,7);
assert.match(fallback['/guides/'],/Finding Help/);
assert.doesNotMatch(fallback['/guides/'],/about-alanon/);
// Articles hub eyebrows were removed at Neal's request; article bylines remain on detail pages.
assert.doesNotMatch(fallback['/articles/'],/Jeff J\./);
assert.doesNotMatch(fallback['/articles/'],/class="sd-kicker"/);
assert.doesNotMatch(fallback['/articles/the-line-i-kept-moving/'],/Coming soon/);
const canonical=route=>fallback[route].match(/<link rel="canonical" href="([^"]+)"/)[1];
for(const route of paths.filter(p=>p!=='/sitemap.xml'&&!/http-equiv=["']refresh/i.test(fallback[p]))) assert.equal(canonical(route),'https://daily-paths-soft-daylight.nealw98.chatgpt.site'+route);
const readings=JSON.parse(fs.readFileSync(path.join(root,'client/readings-manifest.json'),'utf8'));
assert.equal(Object.keys(readings).length,366);
assert.ok(!fs.existsSync(path.join(root,'client/admin/index.html')));
assert.match(fallback['/'],/<meta name="robots" content="noindex, nofollow">/);
assert.equal(launchItems([{path:LAUNCH_REVIEW.deferred[0]}],false).length,1,'Production catalog preserved');

// Simulate a stale published CMS response: it must neither replace a review
// manuscript nor restore excluded related cards. Exercise the actual handler.
const originalFetch=globalThis.fetch,originalRewriter=globalThis.HTMLRewriter;
let cmsRequests=0;const selectors=[];
globalThis.fetch=async url=>{cmsRequests++;const u=new URL(url);if(u.searchParams.has('path'))return Response.json({html:'<main><div class="story-related-links"><article><p class="sd-kicker">Article · Coming soon</p><h3>Unwritten</h3></article></div><p>Approved body stays here.</p><aside class="theme-related-guide"><a href="/topics/one-day-at-a-time/">Deferred</a></aside></main>',revision:'test-approved'});
 // The feed has to carry every linked story, or the worker cannot resolve the
 // address the Story Room publishes it at and quietly serves the built page
 // instead — which made the letting-go assertion below pass against the wrong
 // HTML. The first-meeting entry keeps a deliberately different CMS path, so the
 // remapping is still exercised.
 const FIRST_MEETING_ID='de45655f-f3a2-46a4-a2a7-a52a7174ed98';
 const linked=Object.entries(LAUNCH_REVIEW.linkedStories).map(([id,site])=>
  ({id,path:id===FIRST_MEETING_ID?'/articles/lances-new-title/':site,title:'Linked',content_type:'article'}));
 return Response.json({items:[...linked,...LAUNCH_REVIEW.deferred.map(path=>({path,title:'Deferred',content_type:'article'})),{path:'/about-alanon/',card_title:'Finding Support',content_type:'guide'}]});};
globalThis.HTMLRewriter=class{on(selector){selectors.push(selector);return this;}transform(response){return response;}};
try{
 const worker=createCmsWorker(fallback,paths.map(path=>({path})),composePage,LAUNCH_REVIEW,transformLaunchPreview);
 for(const route of LAUNCH_REVIEW.drafts.filter(path=>!LAUNCH_REVIEW.cmsManaged.includes(path))){const response=await worker.fetch(new Request('https://review.test'+route));assert.equal(response.status,200);assert.match(await response.text(),/Placeholder content/);}
 assert.equal(cmsRequests,0,'Draft review pages must not request an approved replacement');
 const meeting=await worker.fetch(new Request('https://review.test/articles/your-first-al-anon-meeting/'));
 const meetingHtml=await meeting.text();assert.match(meetingHtml,/Approved body stays here/);assert.doesNotMatch(meetingHtml,/Placeholder content/);
 assert.equal(meeting.headers.get('X-Story-Room-Revision'),'test-approved');
 const response=await worker.fetch(new Request('https://review.test/articles/letting-go/'));const html=await response.text();
 assert.match(html,/Approved body stays here/);assert.doesNotMatch(html,/Coming soon|href="\/topics\/one-day-at-a-time\//);assert.equal(response.headers.get('X-Story-Room-Revision'),'test-approved');
 await worker.fetch(new Request('https://review.test/guides/'));
 assert.ok(!selectors.some(s=>s.includes('/about-alanon/')));
 for(const deferred of LAUNCH_REVIEW.deferred)assert.ok(!selectors.some(s=>s.includes(deferred)),`CMS tries to reintroduce ${deferred}`);
 const head=await worker.fetch(new Request('https://review.test/about-alanon/',{method:'HEAD'}));assert.equal(await head.text(),'');
 // Both About Al-Anon addresses were consolidated into Finding Help. Each must
 // land there in one hop — a redirect to the other would be a chain.
 for(const retired of ['/about-alanon/','/guides/about-alanon/','/topics/fellowship/']){
  const moved=await worker.fetch(new Request('https://review.test'+retired));
  assert.equal(moved.status,301,`${retired} should redirect`);
  assert.equal(new URL(moved.headers.get('location')).pathname,'/guides/finding-help/',`${retired} should land on Finding Help`);
 }
 // These two used to assert the review manuscript reappeared when the CMS had
 // nothing. The manuscripts are retired and the article is published, so the
 // contract is now the documented one: an outage falls back to the last build,
 // serving that page's real content rather than 404ing or emptying the page.
 const firstMeeting='/articles/your-first-al-anon-meeting/';
 globalThis.fetch=async()=>Response.json({items:[]});
 const notPublished=await worker.fetch(new Request('https://review.test'+firstMeeting));
 assert.equal(notPublished.status,200);
 assert.match(await notPublished.text(),/Your First Al-Anon Meeting/);
 globalThis.fetch=async()=>{throw Error('Simulated CMS outage');};
 const unpublished=await worker.fetch(new Request('https://review.test'+firstMeeting));
 assert.equal(unpublished.status,200);
 assert.match(await unpublished.text(),/Your First Al-Anon Meeting/);
 const offline=await worker.fetch(new Request('https://review.test/guides/'));assert.equal(offline.status,200);assert.match(await offline.text(),/Finding Help/);
} finally {globalThis.fetch=originalFetch;globalThis.HTMLRewriter=originalRewriter;}
console.log('Launch review checks passed: retained routes, five guides / seven articles, consolidated redirects, CMS filtering/outage fallback, canonical preservation, and 366 reflections.');
