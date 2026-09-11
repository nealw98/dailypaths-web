/**
 * Theme-matched Soft Daylight photography for every daily reflection.
 *
 * The old app-image rotation mixed landscapes, interiors, and unrelated visual
 * styles. This deliberately small editorial collection trades novelty for a
 * coherent publication voice and a meaningful relationship to each reading.
 */
export const SOFT_DAYLIGHT_THEME_IMAGES = {
  detachment: 'soft-daylight-detachment.jpg',
  powerlessness: 'soft-daylight-powerlessness.jpg',
  'focus-on-yourself': 'soft-daylight-focus-on-yourself.jpg',
  'one-day-at-a-time': 'soft-daylight-one-day-at-a-time.jpg',
  boundaries: 'soft-daylight-boundaries.jpg',
  'letting-go': 'soft-daylight-letting-go.jpg',
  'self-worth': 'soft-daylight-self-worth.jpg',
  'higher-power': 'soft-daylight-higher-power.jpg',
  honesty: 'soft-daylight-honesty.jpg',
  'gratitude-and-hope': 'soft-daylight-gratitude-and-hope.jpg',
  'the-disease': 'soft-daylight-the-disease.jpg',
  fellowship: 'soft-daylight-fellowship.jpg',
};

export const REFLECTION_IMAGES = Object.values(SOFT_DAYLIGHT_THEME_IMAGES);

export function reflectionImage(dayOfYear, topicSlug = '') {
  const themed = SOFT_DAYLIGHT_THEME_IMAGES[topicSlug];
  if (themed) return `reflections/${themed}`;

  const index = (Math.max(1, Number(dayOfYear) || 1) - 1) % REFLECTION_IMAGES.length;
  return `reflections/${REFLECTION_IMAGES[index]}`;
}
