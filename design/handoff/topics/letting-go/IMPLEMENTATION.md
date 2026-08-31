# Letting Go implementation notes

## Intent

Preserve the site's established editorial design while allowing this topic's
content to determine its structure. The page should read as one emotional
journey, not as a stack of equally weighted boxes.

## Content rules

- Use `ARTICLE.md` as the approved copy source. Do not silently rewrite it.
- The HTML comments in `ARTICLE.md` are placement notes and must not render.
- Render the listed headings as authored; do not replace them with the older
  generic four-chapter eyebrow labels.
- Pull quotes are extracted from nearby prose. Avoid making every memorable
  sentence a separate visual treatment.
- Keep the Daily Paths reading links contextual and retain the four-card
  reading section at the end.
- Preserve the site's independence/source note and existing app/footer
  treatment.

## Insert placement

| Insert | Place after | Temporary treatment | Final treatment |
| --- | --- | --- | --- |
| The Worry Loop | The promise hidden inside the worry | Use the provided PNG | Responsive live-text diagram |
| What Returns to Me | Second paragraph of What returns to me | Use the provided PNG | Responsive live-text containment/ripple diagram |
| Let Go and Let God | What Returns to Me section | Use the provided PNG | Live HTML/CSS editorial insert |
| Tonight's Next Honest Action | Intro paragraph of the final section | Use the provided PNG | Responsive live-text practice panel |

The four PNGs are placeholders and visual references, not final shippable
infographics. Keep their use easy to replace. Do not bake them into unrelated
backgrounds or generated site bundles.

## Spiritual insert

The Let Go and Let God insert is central to the article, not optional related
content. Show its concise reflection and faith pull quote in the page. Its
link should use the descriptive label `Higher Power and Trust →` and point to
the current canonical page for that topic.

Do not create a second active topic row solely to obtain the proposed
`higher-power-and-trust` slug. If the site still uses `/topics/higher-power/`,
link there or follow the project's existing redirect/migration plan.

## Visual direction

- Use existing Daily Paths tokens and typefaces.
- Maintain a readable long-form measure (the existing 820px article measure
  is the reference).
- The inserts are moments in the journey, not four interchangeable cards:
  - Worry Loop: dark, circular, trapped.
  - What Returns to Me: centered, clarifying, reclaiming.
  - Let Go and Let God: spiritually expansive and quiet.
  - Tonight's Next Honest Action: light, spacious, moving toward rest.
- Avoid box fatigue. Ordinary prose should remain ordinary prose.
- Keep the hero, topic rail, readings grid, source note, app CTA, and footer
  consistent with the current mockup unless the current codebase has a newer
  approved treatment.

## Responsive and accessibility requirements

- Temporary PNGs need useful alt text describing the concept; do not repeat
  every word of the image in a huge alt attribute.
- Provide the full insert text in nearby accessible markup or a visually
  hidden description while the text-heavy PNG placeholders are used.
- Final versions must use real text, preserve logical reading order, and work
  without relying on arrows or position alone.
- Verify narrow mobile layouts, keyboard focus for links, color contrast, and
  reduced-motion behavior if any animation is introduced.
- Do not put essential copy exclusively in a CSS background image.

## Verification

1. Run the existing build.
2. Open `/topics/letting-go/` at the local preview URL.
3. Check desktop and mobile widths.
4. Verify every reading and neighboring-topic link.
5. Confirm there is no duplicate active Letting Go page or broken canonical.
6. Report changes and screenshots for owner review.
7. Do not publish without explicit approval.
