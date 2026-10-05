import {internalLinkDestination} from '../helpers/internal-link-destinations.mjs';
import inserts from '../helpers/editorial-inserts.json' with {type:'json'};
import {applyEditorialPolicy} from '../helpers/editorial-policy.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {ARTICLES,GUIDES} from '../helpers/content-catalog.mjs';
import {createCmsWorker} from '../helpers/cms-worker.mjs';
import {LAUNCH_REVIEW,transformLaunchPreview} from '../helpers/launch-review.mjs';
import {composePage,restorePublishedArticle} from '../helpers/story-room.mjs';
import {syncHeroSocialImage} from '../helpers/social-image.mjs';
import {syncNewsletter} from '../helpers/site-chrome.mjs';
import {ARTICLE_PLACEHOLDERS} from '../templates/article-placeholders.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname),dist=path.join(root,'dist');
if(fs.existsSync(path.join(dist,'server')))throw new Error('Build the static website before packaging its CMS routes.');
const catalog=[...ARTICLES.map(x=>({path:x.path,content_type:'article'})),...GUIDES.map(x=>({path:x.path,content_type:'guide'}))];const paths=catalog.map(x=>x.path);const fallback={};
for(const p of ['/','/articles/','/guides/',...paths,...ARTICLE_PLACEHOLDERS.map(x=>x.path)]){const filename=path.join(dist,p,'index.html');if(fs.existsSync(filename))fallback[p]=fs.readFileSync(filename,'utf8');}
// Let CMS redirects and publications take precedence over all editorial static routes.
for(const section of ['articles','guides','topics','steps','themes']){const base=path.join(dist,section);if(!fs.existsSync(base))continue;for(const entry of fs.readdirSync(base,{withFileTypes:true})){if(!entry.isDirectory())continue;const file=path.join(base,entry.name,'index.html');if(fs.existsSync(file))fallback['/'+section+'/'+entry.name+'/']=fs.readFileSync(file,'utf8');}}
fallback['/sitemap.xml']=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'data/story-room-cache.json'),'utf8'));LAUNCH_REVIEW.cmsRoutes=snapshot.routes||[];
const entries=fs.readdirSync(dist);fs.mkdirSync(path.join(dist,'client'));
for(const entry of entries){if(entry==='.openai')continue;fs.renameSync(path.join(dist,entry),path.join(dist,'client',entry));}
// Let the Worker return real HTTP redirects for consolidated pages rather than
// allowing their static meta-refresh pages to preempt it.
for (const retired of Object.keys(LAUNCH_REVIEW.consolidated)) {
 fs.rmSync(path.join(dist,'client',retired,'index.html'),{force:true});
}
fs.rmSync(path.join(dist,'client','guides','detachment-with-love','index.html'),{force:true});
// Static HTML for these routes must not preempt the CMS request handler.
for(const p of Object.keys(fallback))fs.rmSync(p==='/sitemap.xml'?path.join(dist,'client','sitemap.xml'):path.join(dist,'client',p,'index.html'),{force:true});
fs.mkdirSync(path.join(dist,'server'));fs.mkdirSync(path.join(dist,'.openai'),{recursive:true});
fs.writeFileSync(path.join(dist,'server','index.js'),`const fallback=${JSON.stringify(fallback)};\nconst knownPaths=${JSON.stringify(catalog)};\n${syncHeroSocialImage.toString()}\nconst inserts=${JSON.stringify(inserts)};\n${internalLinkDestination.toString()}\n${applyEditorialPolicy.toString()}\n${syncNewsletter.toString()}\n${composePage.toString()}\nconst publishedArticle=/<article\\b[^>]*class=["'][^"']*\\brd-article\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/article>/i;\n${restorePublishedArticle.toString()}\n${createCmsWorker.toString()}\nconst LAUNCH_REVIEW=${JSON.stringify(LAUNCH_REVIEW)};\n${transformLaunchPreview.toString()}\nexport default createCmsWorker(fallback,knownPaths,composePage,LAUNCH_REVIEW,transformLaunchPreview,applyEditorialPolicy,syncNewsletter,restorePublishedArticle);\n`);
fs.writeFileSync(path.join(dist,'server','wrangler.json'),JSON.stringify({name:'daily-paths-cms-preview',main:'index.js',compatibility_date:'2026-05-15',assets:{directory:'../client'}}));
fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(dist,'.openai/hosting.json'));
console.log('Prepared CMS publishing for '+paths.length+' existing pages and future articles/guides.');
