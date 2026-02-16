export async function fetchAllReadings() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  const params = new URLSearchParams({
    select: 'id,day_of_year,title,opening,body,quote,thought_for_day,step_theme,secondary_theme,display_date,application',
    order: 'day_of_year',
  });

  const response = await fetch(`${url}/rest/v1/readings?${params}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase fetch failed: ${response.status} ${response.statusText}`);
  }

  const readings = await response.json();

  if (!Array.isArray(readings) || readings.length === 0) {
    throw new Error(`Expected array of readings, got: ${JSON.stringify(readings).slice(0, 200)}`);
  }

  console.log(`  Fetched ${readings.length} readings from Supabase`);
  return readings;
}
