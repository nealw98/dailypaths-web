export async function fetchAllSteps() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  }

  const params = new URLSearchParams({
    select: 'id,number,text,month,month_slug,principle,description,questions,hook,tagline,pull_quote,tools,updated_at',
    order: 'number',
  });

  const response = await fetch(`${url}/rest/v1/steps?${params}`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase steps fetch failed: ${response.status} ${response.statusText}`);
  }

  const steps = await response.json();

  if (!Array.isArray(steps) || steps.length === 0) {
    console.warn('  Warning: No steps fetched from Supabase, falling back to hardcoded data');
    return null;
  }

  console.log(`  Fetched ${steps.length} steps from Supabase`);
  return steps;
}
