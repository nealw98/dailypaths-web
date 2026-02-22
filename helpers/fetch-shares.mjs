/**
 * Fetch approved member shares from external Supabase.
 * Returns a Map of topic_slug → array of approved shares (most recent first).
 */
export async function fetchApprovedShares() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  const params = new URLSearchParams({
    select: 'id,topic_slug,display_name,content,created_at',
    is_approved: 'eq.true',
    order: 'created_at.desc',
  });

  const response = await fetch(`${url}/rest/v1/member_shares?${params}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase shares fetch failed: ${response.status} ${response.statusText}`);
  }

  const shares = await response.json();

  if (!Array.isArray(shares)) {
    return new Map();
  }

  // Group by topic_slug
  const sharesMap = new Map();
  for (const share of shares) {
    if (!sharesMap.has(share.topic_slug)) {
      sharesMap.set(share.topic_slug, []);
    }
    sharesMap.get(share.topic_slug).push(share);
  }

  console.log(`  Fetched ${shares.length} approved shares across ${sharesMap.size} themes`);
  return sharesMap;
}
