// Confirm or unsubscribe an email address from a token in an emailed link.
// Public (no JWT): the unguessable token is the credential. A person must press a
// button on the website page, so mail scanners that merely open links change nothing.
// Mail clients' one-click unsubscribe (RFC 8058) POSTs here directly.
const origins = new Set(['https://dailypaths.org','https://www.dailypaths.org','https://daily-paths-soft-daylight.nealw98.chatgpt.site']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin',
    ...(origins.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
    'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed.' });
  try {
    const q = new URL(req.url).searchParams;
    let action = q.get('action') || '', token = q.get('token') || '';
    if (!token) {
      // Page requests are JSON from our own site only.
      if (!origins.has(origin)) return reply(403, { error: 'Please use the link in your email.' });
      const body = await req.json().catch(() => ({}));
      action = String(body?.action || ''); token = String(body?.token || '');
    }
    if (!['confirm', 'unsubscribe'].includes(action) || !uuid.test(token)) return reply(400, { result: 'invalid' });
    const url = Deno.env.get('SUPABASE_URL')!, key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!url || !key) return reply(503, { error: 'Temporarily unavailable. Please try again later.' });
    const db = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
    const column = action === 'confirm' ? 'confirm_token' : 'unsubscribe_token';
    const find = async () => (await (await fetch(`${url}/rest/v1/newsletter_subscribers?${column}=eq.${token}&select=status`, { headers: db })).json())[0];
    const row = await find();
    if (!row) return reply(404, { result: 'invalid' });
    if (action === 'confirm') {
      if (row.status === 'subscribed') return reply(200, { result: 'already' });
      if (row.status !== 'pending') return reply(200, { result: 'unsubscribed' }); // never reactivate an unsubscribe
      const r = await fetch(`${url}/rest/v1/newsletter_subscribers?${column}=eq.${token}&status=eq.pending`, { method: 'PATCH', headers: { ...db, Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'subscribed', confirmed_at: new Date().toISOString() }) });
      return r.ok ? reply(200, { result: 'confirmed' }) : reply(503, { error: 'Temporarily unavailable. Please try again later.' });
    }
    if (row.status === 'unsubscribed' || row.status === 'suppressed') return reply(200, { result: 'unsubscribed' });
    const r = await fetch(`${url}/rest/v1/newsletter_subscribers?${column}=eq.${token}&status=in.(pending,subscribed)`, { method: 'PATCH', headers: { ...db, Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }) });
    return r.ok ? reply(200, { result: 'unsubscribed' }) : reply(503, { error: 'Temporarily unavailable. Please try again later.' });
  } catch {
    return reply(503, { error: 'Temporarily unavailable. Please try again later.' });
  }
});
