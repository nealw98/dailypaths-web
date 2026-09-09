import { readdirSync } from 'node:fs';

// A simple cycle through the app photo collection. No thematic matching.
const directory = new URL('../assets/reflections/', import.meta.url);
export const REFLECTION_IMAGES = readdirSync(directory)
  .filter(name => /\.(webp|png|jpe?g|avif)$/i.test(name))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

export function reflectionImage(dayOfYear) {
  if (!REFLECTION_IMAGES.length) return 'articles/daily_reflections.webp';
  const index = (Math.max(1, Number(dayOfYear) || 1) - 1) % REFLECTION_IMAGES.length;
  return `reflections/${REFLECTION_IMAGES[index]}`;
}
