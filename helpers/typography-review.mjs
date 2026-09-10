// A single review route uses the new system while the other pages retain their
// published typography. Once approved, the same shared tokens can be rolled out.
export const TYPOGRAPHY_REVIEW_PATH = '/typography-review/reflection/';
export const TYPOGRAPHY_REVIEW_DAY = 253; // September 9: Immediate Attention.
export const GUIDE_REVIEW_PATH = '/typography-review/guide/';

export function layoutWithoutTypography(css) {
  return css
    .replace(/(?<=[{;])(?:\s|\/\*[\s\S]*?\*\/)*(?:font(?:-[a-z-]+)?|line-height|letter-spacing|text-transform)\s*:[^;{}]*(?=;|})/g, '')
    .replace(/--(?:font-body|font-display|font-reading|display|hero|reading|ui)\s*:[^;{}]+;?/g, '')
    .replaceAll('prose-lora', 'prose-reading');
}
