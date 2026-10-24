import { readFileSync, existsSync } from 'node:fs';

const PAIRINGS_PATH = new URL('../data/personal-experience.json', import.meta.url);

/**
 * Stories shown under "Personal Experience" on reflection pages.
 *
 * data/personal-experience.json says which saved story (Supabase `stories`, by its
 * day_of_year) belongs on which reflection. Only listed reflections get the section.
 * Returns a Map of reading day_of_year → { title, opening, body }.
 *
 * Any failure returns an empty Map: a reflection page without this section is
 * still a complete page, so this never stops the build.
 */
export async function fetchPersonalExperiences() {
  if (!existsSync(PAIRINGS_PATH)) return new Map();
  const { pairings = [] } = JSON.parse(readFileSync(PAIRINGS_PATH, 'utf8'));
  if (!pairings.length) return new Map();

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');

  const storyDays = [...new Set(pairings.map(p => p.story_day))];
  const params = new URLSearchParams({
    select: 'day_of_year,title,opening,body',
    day_of_year: `in.(${storyDays.join(',')})`,
  });
  const response = await fetch(`${url}/rest/v1/stories?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Supabase stories fetch failed: ${response.status} ${response.statusText}`);

  const stories = new Map((await response.json()).map(s => [s.day_of_year, s]));
  const byReading = new Map();
  for (const { reading_day, story_day } of pairings) {
    const story = stories.get(story_day);
    if (story && (story.opening || story.body)) {
      byReading.set(reading_day, { title: story.title, opening: story.opening, body: story.body });
    }
  }
  return byReading;
}
