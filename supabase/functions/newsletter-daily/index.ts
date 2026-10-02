// Sends the day's reflection teaser to confirmed subscribers.
// Called by a database schedule (see the cron migration) with a secret held in public.newsletter_config.
// Modes (JSON body): {"mode":"preview"} returns the email without sending; {"mode":"test","to":"you@example.com"} sends one;
// {"mode":"send"} sends to every subscribed address, once per day, and only when newsletter_config.send_enabled is 'true'.
const SITE = 'https://dailypaths.org';
const TZ = 'America/New_York';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Featured = { kind: 'article' | 'guide'; title: string; description: string; path: string };

// A short, clean excerpt: whole sentences up to roughly 200-330 characters. Only a very long first sentence is cut, at a word.
function makeExcerpt(raw: string): string {
  const t = (raw || '').replace(/<[^>]*>/g, ' ').replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  const sentences = t.match(/[^.!?]+[.!?]+["\u201d\u2019)]*\s*|[^.!?]+$/g) || [t];
  let out = '';
  for (const sentence of sentences) {
    if (out && (out + sentence).length > 330) break;
    out += sentence;
    if (out.length >= 200) break;
  }
  out = out.trim();
  if (out.length > 360) out = out.slice(0, 340).replace(/\s+\S*$/, '').replace(/[,;:\u2014-]+$/, '') + '\u2026';
  return out;
}

function buildEmail(r: { title: string; date: string; thought: string; slug: string }, unsubscribeUrl: string, excerpt = '', featured: Featured | null = null) {
  const link = `${SITE}/${r.slug}/`;
  const featuredLink = featured ? `${SITE}${featured.path}` : '';
  const featuredCta = featured ? (featured.kind === 'guide' ? 'Read the guide' : 'Read the article') : '';
  const serif = "Newsreader,Georgia,'Times New Roman',serif", wordmark = "'Cormorant Garamond',Georgia,'Times New Roman',serif", sans = "Manrope,Helvetica,Arial,sans-serif";
  const fonts = `${SITE}/assets/fonts/`;
  const css = `@font-face{font-family:Newsreader;font-style:normal;font-weight:400 600;src:url(${fonts}newsreader-normal-latin.woff2) format("woff2");}`
    + `@font-face{font-family:Newsreader;font-style:italic;font-weight:400 600;src:url(${fonts}newsreader-italic-latin.woff2) format("woff2");}`
    + `@font-face{font-family:"Cormorant Garamond";font-style:italic;font-weight:500 600;src:url(${fonts}cormorant-garamond-italic-latin.woff2) format("woff2");}`
    + `@font-face{font-family:"Daily Paths Wordmark";font-style:italic;font-weight:600;src:url(${fonts}cormorant-garamond-italic-latin.woff2) format("woff2");}`
    + `@font-face{font-family:Manrope;font-style:normal;font-weight:400 600;src:url(${fonts}manrope-normal-latin.woff2) format("woff2");}`;
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(r.title)}</title><style>${css}</style></head>`
    + `<body style="margin:0;padding:0;background-color:#faf9f5;">`
    + `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#faf9f5;">${esc(r.thought)}</div>`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#faf9f5"><tr><td align="center" style="padding:32px 20px 40px 20px;">`
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;">`
    + `<tr><td style="padding:0 0 18px 0;border-bottom:1px solid #dfdfd3;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>`
    + `<td valign="middle" style="padding-right:12px;"><img src="${SITE}/assets/app-icon.png" width="42" height="42" alt="" border="0" style="display:block;border-radius:9px;"></td>`
    + `<td valign="middle" style="font-family:'Daily Paths Wordmark',${wordmark};font-style:italic;font-weight:600;font-size:28px;line-height:34px;letter-spacing:-0.35px;color:#444e34;">Daily Paths</td></tr></table></td></tr>`
    + `<tr><td style="padding:30px 0 0 0;font-family:${sans};font-weight:600;font-size:12px;line-height:18px;letter-spacing:1.1px;text-transform:uppercase;color:#4f5b3d;">${esc(r.date)}</td></tr>`
    + `<tr><td style="padding:8px 0 0 0;font-family:${wordmark};font-style:italic;font-weight:500;font-size:40px;line-height:42px;letter-spacing:-0.3px;color:#34382e;">${esc(r.title)}</td></tr>`
    + `<tr><td style="padding:24px 0 0 0;font-family:${sans};font-weight:600;font-size:12px;line-height:18px;letter-spacing:1.1px;text-transform:uppercase;color:#66685d;">Thought for the day</td></tr>`
    + `<tr><td style="padding:6px 0 0 0;font-family:${serif};font-style:italic;font-size:21px;line-height:32px;color:#34382e;">&ldquo;${esc(r.thought)}&rdquo;</td></tr>`
    + (excerpt ? `<tr><td style="padding:22px 0 0 0;font-family:${serif};font-size:18px;line-height:29px;color:#34382e;">${esc(excerpt)}</td></tr>` : '')
    + `<tr><td style="padding:28px 0 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#4f5b3d" style="background-color:#4f5b3d;border-radius:2px;"><a href="${link}" style="display:inline-block;padding:14px 24px;font-family:${sans};font-size:15px;line-height:20px;font-weight:500;color:#ffffff;text-decoration:none;">Read today&rsquo;s reflection</a></td></tr></table></td></tr>`
    + (featured ? `<tr><td style="padding:40px 0 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #dfdfd3;padding-top:24px;">`
      + `<div style="font-family:${sans};font-weight:600;font-size:12px;line-height:18px;letter-spacing:1.1px;text-transform:uppercase;color:#4f5b3d;">New on Daily Paths</div>`
      + `<div style="padding-top:8px;font-family:${serif};font-weight:500;font-size:24px;line-height:30px;letter-spacing:-0.2px;color:#34382e;">${esc(featured.title)}</div>`
      + `<div style="padding-top:8px;font-family:${serif};font-size:17px;line-height:27px;color:#34382e;">${esc(featured.description)}</div>`
      + `<div style="padding-top:14px;font-family:${sans};font-size:15px;line-height:22px;font-weight:500;"><a href="${featuredLink}" style="color:#4f5b3d;text-decoration:underline;">${featuredCta}</a></div>`
      + `</td></tr></table></td></tr>` : '')
    + `<tr><td style="padding:36px 0 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #dfdfd3;padding-top:16px;font-family:${sans};font-size:13px;line-height:21px;color:#66685d;">`
    + `You&rsquo;re receiving this because you signed up for Daily Paths email updates.<br>`
    + `<a href="${unsubscribeUrl}" style="color:#4f5b3d;text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp; <a href="${SITE}/privacy/" style="color:#4f5b3d;text-decoration:underline;">Privacy</a>`
    + `</td></tr></table></td></tr></table></td></tr></table></body></html>`;
  const text = `${r.date}\n\n${r.title}\n\nThought for the day:\n"${r.thought}"\n\n${excerpt ? excerpt + '\n\n' : ''}Read today's reflection: ${link}\n\n${featured ? `New on Daily Paths\n${featured.title}\n${featured.description}\n${featuredCta}: ${featuredLink}\n\n` : ''}--\nYou're receiving this because you signed up for Daily Paths email updates.\nUnsubscribe: ${unsubscribeUrl}\nPrivacy: ${SITE}/privacy/`;
  return { subject: r.title, html, text };
}

Deno.serve(async (req: Request) => {
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const url = Deno.env.get('SUPABASE_URL')!, key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendKey = Deno.env.get('RESEND_API_KEY') || '', from = Deno.env.get('NEWSLETTER_FROM') || '';
  const replyTo = Deno.env.get('NEWSLETTER_REPLY_TO') || 'support@dailypaths.org';
  const db = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
  const rest = (path: string, init: RequestInit = {}) => fetch(`${url}/rest/v1/${path}`, { ...init, headers: { ...db, ...(init.headers || {}) } });
  try {
    // The caller must present the secret stored in the database.
    const config: Record<string, string> = {};
    for (const row of await (await rest('newsletter_config?select=key,value')).json()) config[row.key] = row.value;
    const given = req.headers.get('x-send-secret') || '';
    if (!config.send_secret || given.length !== config.send_secret.length || given !== config.send_secret) return json(401, { error: 'Unauthorized.' });
    const body = await req.json().catch(() => ({}));
    const mode = String(body?.mode || 'send');
    if (!['preview', 'test', 'send'].includes(mode)) return json(400, { error: 'Unknown mode.' });

    // Today's reading, by calendar date in New York, from the published manifest.
    const today = new Date();
    const label = today.toLocaleDateString('en-US', { timeZone: TZ, month: 'long', day: 'numeric' });
    const isoDate = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(today);
    const manifest = await (await fetch(`${SITE}/readings-manifest.json`, { headers: { 'Cache-Control': 'no-cache' } })).json();
    const reading = Array.isArray(manifest) ? manifest.find((m: any) => m.date === label) : null;
    if (!reading || !reading.title || !reading.thought || !reading.slug) return json(502, { error: `No reading found for ${label}.` });

    // Excerpt from the reading itself, and today's "New on Daily Paths" item if one is active. Either may be absent.
    let excerpt = '';
    try {
      if (reading.d) {
        const row = (await (await rest(`readings?day_of_year=eq.${encodeURIComponent(String(reading.d))}&select=opening,body`)).json())[0];
        excerpt = makeExcerpt(row?.opening || row?.body || '');
      }
    } catch { excerpt = ''; }
    let featured: Featured | null = null;
    try {
      const rows = await (await rest(`newsletter_featured?show_from=lte.${isoDate}&show_until=gte.${isoDate}&order=show_from.desc&limit=1&select=kind,title,description,path`)).json();
      if (Array.isArray(rows) && rows[0]) featured = rows[0];
    } catch { featured = null; }

    const unsubscribeUrl = (token: string) => `${SITE}/email/unsubscribe/?token=${token}`;
    const oneClick = (token: string) => ({ 'List-Unsubscribe': `<${url}/functions/v1/newsletter-manage?action=unsubscribe&token=${token}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' });

    if (mode === 'preview') {
      const e = buildEmail(reading, unsubscribeUrl('00000000-0000-4000-8000-000000000000'), excerpt, featured);
      return json(200, { date: label, reading: { title: reading.title, slug: reading.slug }, subject: e.subject, html: e.html, text: e.text });
    }
    if (!resendKey || !from) return json(503, { error: 'Sending is not configured.' });

    if (mode === 'test') {
      const to = String(body?.to || '').trim().toLowerCase();
      if (!/^\S+@[^\s@]+\.[^\s@]+$/.test(to)) return json(400, { error: 'Give a valid "to" address.' });
      const found = (await (await rest(`newsletter_subscribers?email=eq.${encodeURIComponent(to)}&select=unsubscribe_token,status`)).json())[0];
      const token = found?.unsubscribe_token || '00000000-0000-4000-8000-000000000000';
      const e = buildEmail(reading, unsubscribeUrl(token), excerpt, featured);
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, reply_to: [replyTo], to: [to], subject: '[Test] ' + e.subject, html: e.html, text: e.text, headers: oneClick(token) }) });
      return json(r.ok ? 200 : 502, { sent: r.ok, to, status: r.status });
    }

    // Real send.
    if (config.send_enabled !== 'true') return json(409, { error: 'Daily sending is switched off (send_enabled is not true).' });
    const claim = await rest('newsletter_sends', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ send_date: isoDate, reading_title: reading.title }) });
    if (claim.status === 409) return json(409, { error: `Already sent or in progress for ${isoDate}.` });
    if (!claim.ok) return json(503, { error: 'Could not record the send.' });

    const subscribers: { email: string; unsubscribe_token: string }[] = [];
    for (let from_ = 0; ; from_ += 1000) {
      const page = await (await rest('newsletter_subscribers?status=eq.subscribed&select=email,unsubscribe_token&order=created_at.asc', { headers: { Range: `${from_}-${from_ + 999}` } })).json();
      if (!Array.isArray(page)) throw new Error('subscriber read failed');
      subscribers.push(...page);
      if (page.length < 1000) break;
    }
    let sent = 0, failed = 0;
    for (let i = 0; i < subscribers.length; i += 100) {
      const batch = subscribers.slice(i, i + 100).map((s) => {
        const e = buildEmail(reading, unsubscribeUrl(s.unsubscribe_token), excerpt, featured);
        return { from, reply_to: [replyTo], to: [s.email], subject: e.subject, html: e.html, text: e.text, headers: oneClick(s.unsubscribe_token) };
      });
      const r = await fetch('https://api.resend.com/emails/batch', { method: 'POST', headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json', 'Idempotency-Key': `daily-${isoDate}-${i / 100}` }, body: JSON.stringify(batch) });
      if (r.ok) sent += batch.length; else failed += batch.length;
      await sleep(600); // stay under Resend's request rate limit
    }
    if (subscribers.length > 0 && sent === 0) await rest(`newsletter_sends?send_date=eq.${isoDate}`, { method: 'DELETE' }); // nothing went out; allow a retry
    else await rest(`newsletter_sends?send_date=eq.${isoDate}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ completed_at: new Date().toISOString(), recipient_count: sent }) });
    return json(200, { date: label, title: reading.title, subscribers: subscribers.length, sent, failed });
  } catch {
    return json(503, { error: 'The daily send could not complete.' });
  }
});
