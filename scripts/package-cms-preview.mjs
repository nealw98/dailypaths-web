import fs from 'node:fs';
import path from 'node:path';
import {ARTICLES,GUIDES} from '../helpers/content-catalog.mjs';
import {createCmsWorker} from '../helpers/cms-worker.mjs';
import {composePage} from '../helpers/story-room.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname),dist=path.join(root,'dist');
if(fs.existsSync(path.join(dist,'server')))throw new Error('Build the static website before packaging its CMS routes.');
const catalog=[...ARTICLES.map(x=>({path:x.path,content_type:'article'})),...GUIDES.map(x=>({path:x.path,content_type:'guide'}))];const paths=catalog.map(x=>x.path);const fallback={};
for(const p of ['/','/articles/','/guides/',...paths]){const filename=path.join(dist,p,'index.html');if(fs.existsSync(filename))fallback[p]=fs.readFileSync(filename,'utf8');}
const entries=fs.readdirSync(dist);fs.mkdirSync(path.join(dist,'client'));
for(const entry of entries){if(entry==='.openai')continue;fs.renameSync(path.join(dist,entry),path.join(dist,'client',entry));}
// Static HTML for these routes must not preempt the CMS request handler.
for(const p of Object.keys(fallback))fs.rmSync(path.join(dist,'client',p,'index.html'));
fs.mkdirSync(path.join(dist,'server'));fs.mkdirSync(path.join(dist,'.openai'),{recursive:true});
fs.writeFileSync(path.join(dist,'server','index.js'),`const fallback=${JSON.stringify(fallback)};\nconst knownPaths=${JSON.stringify(catalog)};\n${composePage.toString()}\n${createCmsWorker.toString()}\nexport default createCmsWorker(fallback,knownPaths,composePage);\n`);
fs.writeFileSync(path.join(dist,'server','wrangler.json'),JSON.stringify({name:'daily-paths-cms-preview',main:'index.js',compatibility_date:'2026-05-15',assets:{directory:'../client'}}));
fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(dist,'.openai/hosting.json'));
console.log('Prepared CMS publishing for '+paths.length+' existing pages and future articles/guides.');
