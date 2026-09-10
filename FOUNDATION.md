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
footer layouts. Use the existing 48px and 192px icon assets with responsive selection.
The tagline is “Daily reflections and practical guidance for a life of your own.”
It is defined once in the base template and wraps on narrow screens.

## What is reused

The complete 366-day reflection collection, 12 steps, 12 existing topic pages, legal pages, About, Al-Anon information, Start Here, Essentials, literature, date archives, related reflections, calendar, and existing URLs. The detailed Letting Go article and its original diagrams are retained. The latest `2.0` photography, callout hierarchy, and supporting assets are retained.

`helpers/content-catalog.mjs` controls article and guide labels and destinations independently of URLs. New indexes are `/articles/`, `/guides/`, and `/reflections/`. The homepage is now a separate editorial page; dated reflection pages remain the complete readings.

The guide index currently leads to existing source material. These are not six newly commissioned, launch-approved long-form guides. Finding Yourself currently opens Self-Worth & Identity; Finding Support opens the existing Al-Anon introduction. Expand and review each source as the writing progresses. The support guide still needs the agreed coverage of other relevant groups.

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

## Reflection image rotation

The 42 app photos in `assets/reflections/` now rotate across full reflection pages by calendar day, cycling in numeric filename order. This is a simple daily rotation, not a match between photographs and subjects. The homepage keeps its consistent Soft Daylight window photograph. The choice is stable when revisiting a dated reading and works with the existing 366-day calendar. Matching images to individual reflections is explicitly deferred.

## Asset provenance

`editorial-window.webp`, `editorial-doorway.webp`, and `editorial-phone.webp` reconstruct the photography direction in the supplied reference; `soft-daylight-journal.webp` supports the photographic app invitation. These are generated assets. The earlier window photo is retained as an unused asset. `Screenshots/today-actual.png` is Neal's supplied app screenshot from September 9, 2026. Other assets were already committed to `2.0` and remain available.
