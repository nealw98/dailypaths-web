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
assert.equal((fallback['/guides/'].match(/<li data-cms-path=/g)||[]).length,4);
assert.equal((fallback['/articles/'].match(/<article class="sd-story"/g)||[]).length,4);
assert.match(fallback['/guides/'],/Finding Help/);
assert.doesNotMatch(fallback['/articles/'],/Personal story · Jeff J\./);
assert.match(fallback['/articles/'],/Personal Story · Jeff J\./);
assert.doesNotMatch(fallback['/articles/the-line-i-kept-moving/'],/Coming soon/);
const canonical=route=>fallback[route].match(/<link rel="canonical" href="([^"]+)"/)[1];
for(const route of paths) assert.equal(canonical(route),'https://daily-paths-soft-daylight.nealw98.chatgpt.site'+route);
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
 return Response.json({items:[{id:'de45655f-f3a2-46a4-a2a7-a52a7174ed98',path:'/articles/lances-new-title/',title:'First Meeting',content_type:'article'},...LAUNCH_REVIEW.deferred.map(path=>({path,title:'Deferred',content_type:'article'})),{path:'/about-alanon/',card_title:'Finding Support',content_type:'guide'}]});};
globalThis.HTMLRewriter=class{on(selector){selectors.push(selector);return this;}transform(response){return response;}};
try{
 const worker=createCmsWorker(fallback,paths.map(path=>({path})),composePage,LAUNCH_REVIEW,transformLaunchPreview);
 for(const route of LAUNCH_REVIEW.drafts.filter(path=>!LAUNCH_REVIEW.cmsManaged.includes(path))){const response=await worker.fetch(new Request('https://review.test'+route));assert.equal(response.status,200);assert.match(await response.text(),/Placeholder content/);}
 assert.equal(cmsRequests,0,'Draft review pages must not request an approved replacement');
 const meeting=await worker.fetch(new Request('https://review.test/articles/your-first-al-anon-meeting/'));
 const meetingHtml=await meeting.text();assert.match(meetingHtml,/Approved body stays here/);assert.doesNotMatch(meetingHtml,/Placeholder content/);
 assert.equal(meeting.headers.get('X-Story-Room-Revision'),'test-approved');
 const response=await worker.fetch(new Request('https://review.test/topics/letting-go/'));const html=await response.text();
 assert.match(html,/Approved body stays here/);assert.doesNotMatch(html,/Coming soon|href="\/topics\/one-day-at-a-time\//);assert.equal(response.headers.get('X-Story-Room-Revision'),'test-approved');
 await worker.fetch(new Request('https://review.test/guides/'));
 assert.ok(selectors.some(s=>s.includes('/about-alanon/')));
 for(const deferred of LAUNCH_REVIEW.deferred)assert.ok(!selectors.some(s=>s.includes(deferred)),`CMS tries to reintroduce ${deferred}`);
 const head=await worker.fetch(new Request('https://review.test/about-alanon/',{method:'HEAD'}));assert.equal(await head.text(),'');
 globalThis.fetch=async()=>Response.json({items:[]});
 const notPublished=await worker.fetch(new Request('https://review.test/articles/your-first-al-anon-meeting/'));
 assert.match(await notPublished.text(),/Placeholder content/);
 globalThis.fetch=async()=>{throw Error('Simulated CMS outage');};
 const unpublished=await worker.fetch(new Request('https://review.test/articles/your-first-al-anon-meeting/'));
 assert.match(await unpublished.text(),/Placeholder content/);
 const offline=await worker.fetch(new Request('https://review.test/guides/'));assert.equal(offline.status,200);assert.match(await offline.text(),/Finding Help/);
} finally {globalThis.fetch=originalFetch;globalThis.HTMLRewriter=originalRewriter;}
console.log('Launch review checks passed: retained routes, four guides/four articles, draft isolation, CMS filtering/outage fallback, canonical preservation, and 366 reflections.');
