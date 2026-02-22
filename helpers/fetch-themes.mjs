export async function fetchAllThemes() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  const params = new URLSearchParams({
    select: 'id,slug,name,short_description,meta_description,image,image_alt,body,featured_days,pull_quote,theme_tags,tools,updated_at',
    order: 'id',
  });

  const response = await fetch(`${url}/rest/v1/themes?${params}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase themes fetch failed: ${response.status} ${response.statusText}`);
  }

  const themes = await response.json();

  if (!Array.isArray(themes) || themes.length === 0) {
    console.warn('  Warning: No themes fetched from Supabase, falling back to hardcoded data');
    return null;
  }

  console.log(`  Fetched ${themes.length} themes from Supabase`);
  return themes;
}
