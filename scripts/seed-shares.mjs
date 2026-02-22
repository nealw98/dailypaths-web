/**
 * Seed member_shares with the default hardcoded share for all 12 themes.
 * Each gets is_approved = true so they show on the site immediately.
 *
 * Run: node scripts/seed-shares.mjs
 */
import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const defaultContent = `For years, I thought my \u201Ccare\u201D was measured by how much I worried. I spent my energy trying to get ahead of the next crisis, thinking that if I could just predict the drinker\u2019s behavior, I could prevent the fallout. I was exhausted and lost.

When I learned about Detachment, I realized I wasn\u2019t helping; I was just drowning alongside them. It didn\u2019t mean I stopped loving them; it meant I stopped trying to manage their consequences. Today, I use this principle by taking a deep breath and \u201Cletting go of the results.\u201D I focus on my own reactions, and for the first time in a long time, I can find peace even when the storm is still blowing.`;

const themes = [
  'detachment',
  'powerlessness',
  'focus-on-yourself',
  'one-day-at-a-time',
  'boundaries',
  'letting-go-of-control',
  'self-worth',
  'higher-power',
  'honesty',
  'gratitude-and-hope',
  'the-disease',
  'fellowship',
];

const rows = themes.map(slug => ({
  topic_slug: slug,
  display_name: 'An Al-Anon member',
  content: defaultContent,
  consent_confirmed: true,
  is_approved: true,
}));

console.log('Seeding member shares...');
console.log(`  URL: ${url}`);

const response = await fetch(`${url}/rest/v1/member_shares`, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  },
  body: JSON.stringify(rows),
});

if (!response.ok) {
  const err = await response.text();
  console.error(`  Failed: ${response.status} ${err}`);
  process.exit(1);
}

console.log(`  Inserted ${rows.length} approved shares (one per theme)`);
console.log('\nDone!');
