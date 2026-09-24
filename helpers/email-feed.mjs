import {readingSlug} from './slug-utils.mjs';
const xml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const plain=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/\\n/g,' ').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_#]/g,'').replace(/\s+/g,' ').trim();
export function emailFeed(readings,origin,now=new Date()){
 const lengths=[31,29,31,30,31,30,31,31,30,31,30,31];const items=[];
 for(let offset=0;offset<7;offset++){
  const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()-offset));
  const day=lengths.slice(0,date.getUTCMonth()).reduce((sum,n)=>sum+n,0)+date.getUTCDate();
  const reading=readings.find(r=>r.day_of_year===day);if(!reading)continue;
  const link=origin+'/'+readingSlug(day,reading.title)+'/';
  const text=plain(reading.opening||reading.body||reading.thought_for_day);const excerpt=text.length>180?text.slice(0,180).replace(/\s+\S*$/,'')+'…':text;
  const description=xml(`<p>${xml(excerpt)}</p><p><a href="${xml(link)}">Read today’s reflection</a></p>`);
  items.push(`<item><title>${xml(reading.title)}</title><link>${xml(link)}</link><guid isPermaLink="false">daily-paths-${date.toISOString().slice(0,10)}</guid><pubDate>${date.toUTCString()}</pubDate><description>${description}</description></item>`);
 }
 return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Daily Paths — Daily Reflections</title><link>${xml(origin+'/reflections/')}</link><description>A brief invitation to today’s reflection. Read the full piece at Daily Paths.</description><language>en-us</language><lastBuildDate>${now.toUTCString()}</lastBuildDate><atom:link href="${xml(origin+'/reflections.xml')}" rel="self" type="application/rss+xml"/>${items.join('')}</channel></rss>`;
}
