/**
 * Fetch aggregated reading ratings from external Supabase.
 * Returns a Map of day_of_year → { positive, neutral, negative, total }
 */
export async function fetchReadingRatings() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  const params = new URLSearchParams({
    select: 'day_of_year,rating',
  });

  const response = await fetch(`${url}/rest/v1/app_reading_feedback?${params}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase ratings fetch failed: ${response.status} ${response.statusText}`);
  }

  const feedback = await response.json();

  if (!Array.isArray(feedback)) {
    return new Map();
  }

  // Aggregate by day_of_year
  const ratingsMap = new Map();
  for (const f of feedback) {
    if (!f.day_of_year) continue;
    if (!ratingsMap.has(f.day_of_year)) {
      ratingsMap.set(f.day_of_year, { positive: 0, neutral: 0, negative: 0, total: 0 });
    }
    const entry = ratingsMap.get(f.day_of_year);
    if (f.rating === 'positive') entry.positive++;
    else if (f.rating === 'neutral') entry.neutral++;
    else if (f.rating === 'negative') entry.negative++;
    entry.total++;
  }

  console.log(`  Fetched ratings for ${ratingsMap.size} readings (${feedback.length} total feedback entries)`);
  return ratingsMap;
}
