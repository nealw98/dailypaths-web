/**
 * Fetch aggregated reading ratings and favorites from external Supabase.
 * Returns a Map of day_of_year → { positive, neutral, negative, total, favorites }
 */
export async function fetchReadingRatings(readings = []) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  const params = new URLSearchParams({
    select: 'day_of_year,rating',
  });

  const headers = { 'apikey': key, 'Authorization': `Bearer ${key}` };
  const [response, favoritesResponse] = await Promise.all([
    fetch(`${url}/rest/v1/app_reading_feedback?${params}`, { headers }),
    fetch(`${url}/rest/v1/admin_reading_favorites_stats?select=reading_id,favorites_count`, { headers }),
  ]);

  if (!response.ok) {
    throw new Error(`Supabase ratings fetch failed: ${response.status} ${response.statusText}`);
  }

  const feedback = await response.json();
  const favorites = favoritesResponse.ok ? await favoritesResponse.json() : [];

  if (!Array.isArray(feedback)) {
    return new Map();
  }

  // Aggregate by day_of_year
  const ratingsMap = new Map();
  for (const f of feedback) {
    if (!f.day_of_year) continue;
    if (!ratingsMap.has(f.day_of_year)) {
      ratingsMap.set(f.day_of_year, { positive: 0, neutral: 0, negative: 0, total: 0, favorites: 0 });
    }
    const entry = ratingsMap.get(f.day_of_year);
    if (f.rating === 'positive') entry.positive++;
    else if (f.rating === 'neutral') entry.neutral++;
    else if (f.rating === 'negative') entry.negative++;
    entry.total++;
  }

  const dayByReadingId = new Map(readings.map(reading => [reading.id, reading.day_of_year]));
  for (const favorite of favorites) {
    const day = dayByReadingId.get(favorite.reading_id);
    if (!day) continue;
    if (!ratingsMap.has(day)) {
      ratingsMap.set(day, { positive: 0, neutral: 0, negative: 0, total: 0, favorites: 0 });
    }
    ratingsMap.get(day).favorites = favorite.favorites_count || 0;
  }

  console.log(`  Fetched engagement for ${ratingsMap.size} readings (${feedback.length} ratings, ${favorites.length} favorite counts)`);
  return ratingsMap;
}
