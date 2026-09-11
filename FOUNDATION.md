# Daily Paths website foundation

This is the active website work, continuing the existing `2.0` branch. The public website remains on `main`. The September 9, 2026 Soft Daylight decisions below supersede older visual proposals in `design/handoff/`; those files remain useful source material.

## Shared visual system implemented site-wide

The September 10, 2026 cohesion pass replaces the conflicting per-page typography
rules with one final cascade layer: `css/site-system.css`. Newsreader sets practical
headings and reading prose; Cormorant Garamond italic is reserved for reflection
titles, prayers, the wordmark, and an occasional thesis quote; Manrope sets interface
text. The type ladder visibly distinguishes a daily reflection, index or article
title, guide title, section, chapter, card, lede, reading body, and label.

Every normal route loads the same locally served fonts and the shared system after
its structural stylesheet. Structural styles are copied intact: do not reintroduce
the old build-time CSS regex that removed declarations, because it also removed
resets and layout rules. Future cross-site typography, measures, spacing, masthead,
footer, and repeated-component edits belong in `css/site-system.css`; page-specific
geometry remains in the structural stylesheets. Guide/article roles follow
`helpers/content-catalog.mjs` without changing stable URLs.

The two private `/typography-review/` routes remain available for old links but
now use the same typography as the normal pages. They are excluded from indexing.
The old local migration stash is superseded; do not apply it over this implementation.
Launch content review remains separate from visual-system approval.

## Agreed direction

- Warm white, restrained olive, daylight photography, confident editorial typography.
- Full-bleed daily reflection hero. People and recognizable everyday moments are appropriate.
- The supplied full-page mockup is the visual specification, not loose inspiration. Homepage: bold sans-serif masthead over the full-bleed window photograph, readable upright Lora serif hero, portrait article images beside text, three guides in a compact horizontal row, shallow photographic app invitation, centered compact email signup, and a small publication footer. All six guides remain on the guide index.
- The homepage has its own `editorial-home.css` and does not load the legacy version-c / soft-daylight stylesheets. Do not revert it to stacked cards, a separate header band, numbered guide lists, or a tall app section. Preserve the compositional reference in `design/approved-homepage-reference.webp`. The September 10 typography reference is `design/approved-upright-typography.webp`: upright Georgia section, article, guide, and email headings, with italic emphasis retained only in the app invitation and photo caption. The main reflection title uses upright Lora, reduced sizing, and 1.08–1.1 line spacing for readability; this explicitly supersedes the earlier italic hero.
- Six guides: Where to Start, Detachment, Boundaries, Finding Support, One Day at a Time, Finding Yourself.
- Letting Go remains a prominent article, linked from the homepage, articles index, and guides index.
- Photographic app invitation with the actual supplied app screenshot, not a simulated screen.
- One email invitation on the homepage. Attraction, not promotion: no popups, urgency, repeated subscription prompts, or invented social proof.

## Brand lockup

The path icon precedes the Cormorant italic wordmark in the shared header and both
footer layouts. The lockup is icon plus “Daily Paths” only—no tagline. Use the
existing 48px and 192px icon assets with responsive selection and keep the icon and
wordmark optically balanced as one compact mark.

## What is reused

The complete 366-day reflection collection, 12 steps, 12 existing topic pages, legal pages, About, Al-Anon information, Start Here, Essentials, literature, date archives, related reflections, calendar, and existing URLs. The detailed Letting Go article and its original diagrams are retained. The latest `2.0` photography, callout hierarchy, and supporting assets are retained.

`helpers/content-catalog.mjs` controls article and guide labels and destinations independently of URLs. New indexes are `/articles/`, `/guides/`, and `/reflections/`. The homepage is now a separate editorial page; dated reflection pages remain the complete readings.

The guide index currently leads to existing source material. These are not six newly commissioned, launch-approved long-form guides. Finding Yourself currently opens Self-Worth & Identity; Finding Support opens the existing Al-Anon introduction. Expand and review each source as the writing progresses. The support guide still needs the agreed coverage of other relevant groups.

The approved displayed Step principles are: Acceptance, Hope, Faith, Courage,
Honesty, Patience, Humility, Willingness, Brotherly Love, Integrity, Spiritual
Awareness, and Service. Established Step paths retain their earlier wording so
existing links and search references continue to work while display names evolve.

The reflection library is organized by Step rather than by date. `/reflections/`
is the collection index, with one Step-led collection for each month; the month is
secondary metadata. Each `/months/[month]/` page leads with the Step, its principle,
the short description, and the Step text before the dated reading list, followed by
a “More about Step [number]” link to the supporting long-form Step article. The
former `/steps/` index redirects to `/reflections/`; individual established Step
URLs remain available as supporting articles and stay in the sitemap. Traditions
and Concepts may become parallel collection views later; do not add them to the
Step cards until their structure is decided.

## Working on content

1. Pick a guide or article and inventory its existing text before drafting.
2. Draft and review it using `dailypaths-content`. Detachment and Boundaries are the first substantial educational guides to develop.
3. Add the approved article body to the existing template or content module and keep its stable URL. The rich Letting Go module in `templates/theme-guides/letting-go.mjs` is the existing long-form example; its folder name does not determine its editorial classification.
4. Update the catalogue if needed, build the private version, and read the actual page. Do not overwrite database content as part of website layout work.
5. Mark editorial approval here when received. Layout approval and prose approval are separate.

## Building and previewing

Node 20 or newer; install using the lockfile. Supply `SUPABASE_URL` and `SUPABASE_ANON_KEY` in a local ignored `.env` or build environment. `.env.example` names the required values. Use the existing public anonymous key, never a service-role key.

- `npm run build`: builds the private preview into ignored `dist/`.
- `SITE_ENV=production npm run build`: builds future production output into `docs/`. This does not itself publish.
- `SITE_BASE_URL` can override the private preview origin for another authorized deployment.

The private build fetches published content read-only at build time. It excludes the admin page and contribution forms, disables production analytics, emits `noindex`, and disallows indexing. It does not include a production CNAME. The homepage chooses the visitor's current reflection from the generated 366-day manifest, so it continues to advance without daily redeployment. Database edits require a new build to appear.

Use the Sites project in `.openai/hosting.json`; do not create another site. GitHub `2.0` is the development source of truth. The Sites repository stores compact deployment snapshots of the same source tree, so the first private upload does not carry the entire historical GitHub repository. Continue all editing on GitHub `2.0`. For Sites, create a deployment commit from the exact reviewed GitHub tree, using the previous Sites commit as its parent when present; record the GitHub revision in its message. Verify identical trees, push the deployment commit, and package the matching build. Never rewrite GitHub history for this. After publishing, return the working checkout to `2.0`. Do not push new website work to GitHub `main` or change public hosting until launch is requested.

## Before launch

- Complete editorial review of the six guides and selected launch articles. Existing inherited copy is not automatically approved by this foundation work.
- Review About, privacy, and terms for the final website/email services and clarify independent status where appropriate.
- Connect an actual email service. `NEWSLETTER_ACTION` is the build-time form action hook; leave it unset until provider-specific field names, consent text, and success/error behavior have been verified. With no provider, the site truthfully says email reflections are coming soon and offers the daily reading.
- Check the finished design and reading experience on desktop and phone with real launch content.
- Confirm app-store destinations and all final content links.
- Rebuild with production configuration, review generated output, then request/execute the explicitly authorized launch. Preserve existing redirects and the daily rebuild workflow.

## Reflection imagery and discovery

Every dated reflection now uses the Soft Daylight hero grammar. Twelve purpose-built
photographs map to the twelve reflection themes, replacing the unrelated landscape
and app-photo rotation. The images show recognizable domestic moments in natural
window light, with warm cream, restrained olive, varied people, and quiet space for
live typography. September 10 retains its bespoke entryway photograph. The image
selection is stable and thematically related to each reading; titles are always HTML,
never baked into image assets.

On phones, the date and title sit inside a warm image-to-paper fade at the foot of the
hero. This keeps the compactness of an overlaid hero without relying on a dark scenic
photograph or a heavy black scrim. Long reflection titles may wrap to three or four
balanced lines.

“Keep reading” remains a three-card grid on larger screens and becomes a native,
single-row scroll-snap carousel on phones. Paid content is never inserted as a card.
A separate, labelled advertisement slot follows the reading carousel and reserves
the page height a future ad provider will need.

September 11 is the approved review route for the next discovery model; the other
365 reflections remain unchanged until Neal reviews it. The trial contains six
crawlable reflection links from the reading’s calendar month, ranked by the combined
count of positive ratings and app favorites. This keeps every month focused on its
Step even when an individual reading concerns a Concept or Tradition. The horizontal
rail is followed by a separate 300-by-600-style desktop ad rail that becomes a short
mobile block, one relevant article and one practical Step guide, and a combined
closing app/email invitation. The universal Start Here panel is removed only from
this trial page. Email remains visibly “coming soon” while `NEWSLETTER_ACTION` is unset.
The trial’s discovery heading is “Related Readings,” followed by “Additional
reflections on Step [number] — [principle]” and the matching Step hook. Its final link
opens the calendar-month archive. The closing app CTA uses Neal’s September 9 Daily
Paths screen capture. Eyebrows on the trial page are smaller and have more separation
from their headings.

Within the seafoam takeaway panel, the reminder message is the highest-value element:
the memorable line a reader can carry into the day and receive on their phone. The
small “Today’s Reminder” label is only a muted locator and must never compete with it.
The takeaway uses a light italic editorial voice in warm ink: related to a pull quote,
but centered and more direct while its label remains quiet and separate.

## Asset provenance

`editorial-window.webp`, `editorial-doorway.webp`, and `editorial-phone.webp` reconstruct the photography direction in the supplied reference; `soft-daylight-journal.webp` supports the photographic app invitation. The twelve `soft-daylight-*.jpg` reflection heroes and the bespoke September 10 entryway hero are generated assets. The earlier landscape and app-photo collection is retained but no longer selected by reflection pages. `Screenshots/today-actual.png` is Neal's supplied app screenshot from September 9, 2026. Other assets were already committed to `2.0` and remain available.
