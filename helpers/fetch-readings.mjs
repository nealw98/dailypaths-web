const BASE_COLUMNS = 'id,day_of_year,title,opening,body,quote,thought_for_day,step_theme,secondary_theme,display_date,application';

// link_theme is the grouping vocabulary for related readings and Go deeper. It is
// requested separately from the columns the build cannot do without, so a database
// that has not had editorial/theme-taxonomy-apply.sql run against it still builds:
// PostgREST rejects the whole request for one unknown column, and losing the
// grouping is a worse page, while losing the body is no page at all.
const GROUPING_COLUMN = 'link_theme';

async function get(url, key, select) {
  const params = new URLSearchParams({ select, order: 'day_of_year' });
  return fetch(`${url}/rest/v1/readings?${params}`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
  });
}

export async function fetchAllReadings() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  let response = await get(url, key, `${BASE_COLUMNS},${GROUPING_COLUMN}`);
  let grouped = true;

  if (response.status === 400) {
    // Either the column is absent or the request is wrong; the retry tells us which.
    const retry = await get(url, key, BASE_COLUMNS);
    if (retry.ok) {
      console.warn(`  ⚠ readings.${GROUPING_COLUMN} not present — grouping related readings by the older theme table`);
      response = retry;
      grouped = false;
    }
  }

  if (!response.ok) {
    throw new Error(`Supabase fetch failed: ${response.status} ${response.statusText}`);
  }

  const readings = await response.json();

  if (!Array.isArray(readings) || readings.length === 0) {
    throw new Error(`Expected array of readings, got: ${JSON.stringify(readings).slice(0, 200)}`);
  }

  if (grouped) {
    const untagged = readings.filter(r => !(r[GROUPING_COLUMN] || '').trim()).length;
    if (untagged) console.warn(`  ⚠ ${untagged} reading${untagged === 1 ? '' : 's'} have no ${GROUPING_COLUMN} — those fall back to their Step`);
  }

  console.log(`  Fetched ${readings.length} readings from Supabase`);
  return readings;
}
