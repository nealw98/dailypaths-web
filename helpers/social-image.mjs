// Shared by the static layout and the CMS Worker (serialized at packaging).
// Read the rendered hero so imported snapshots and future image edits agree.
export function syncHeroSocialImage(html, origin) {
  const decode = value => value.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const escape = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const attr = (tag, name) => decode(tag.match(new RegExp('(?:\\s)' + name + '\\s*=\\s*(["\'])(.*?)\\1', 'i'))?.[2] || '');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || '';
  const images = [...main.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
  const hero = images.find(tag => /(?:^|\s)(?:photo-hero-img|ed-hero-photo)(?:\s|$)/.test(attr(tag, 'class')) || /\sdata-cms-hero(?:\s|=|>)/i.test(tag))
    || main.match(/<(?:header|section)\b[^>]*class=["'][^"']*\b(?:photo-hero|boundary-hero|ap-hero)\b[^"']*["'][^>]*>[\s\S]*?(<img\b[^>]*>)/i)?.[1];
  if (!hero || !attr(hero, 'src')) return html;
  let image;
  try { image = new URL(attr(hero, 'src'), origin); } catch { return html; }
  if (!['https:', 'http:'].includes(image.protocol)) return html;
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Daily Paths');
  const alt = attr(hero, 'alt') || title;
  const names = ['og:image', 'og:image:url', 'og:image:secure_url', 'og:image:width', 'og:image:height', 'og:image:type', 'og:image:alt', 'twitter:image', 'twitter:image:alt', 'twitter:card'];
  html = html.replace(/<meta\b[^>]*>/gi, tag => names.includes(attr(tag, 'property') || attr(tag, 'name')) ? '' : tag);
  const tags = [
    `<meta property="og:image" content="${escape(image.href)}">`,
    `<meta property="og:image:alt" content="${escape(alt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:image" content="${escape(image.href)}">`,
    `<meta name="twitter:image:alt" content="${escape(alt)}">`,
  ];
  // Do not claim every hero is 1200×630; let crawlers read its real dimensions.
  return html.replace(/<\/head>/i, () => tags.join('\n  ') + '\n</head>');
}
