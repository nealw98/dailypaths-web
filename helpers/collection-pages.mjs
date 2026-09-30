/**
 * The two reflection collections that sit alongside the twelve Steps.
 *
 * Kept free of imports so the build, the sitemap, the destination catalog and the
 * page template can all agree on these addresses without pulling templates into
 * the helper layer.
 *
 * `stepTag` is the step_theme prefix a reflection carries to belong here:
 * "Tradition 3", "Concept 11".
 */
export const COLLECTION_PAGES = [
  {
    path: '/traditions/',
    title: 'The Twelve Traditions',
    description: 'How groups stay united, with principles for our own recovery.',
    stepTag: 'Tradition',
  },
  {
    path: '/concepts/',
    title: 'The Twelve Concepts of Service',
    description: 'How Al-Anon shares service, with principles for our own recovery.',
    stepTag: 'Concept',
  },
];
