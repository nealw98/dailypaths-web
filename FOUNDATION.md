# Daily Paths website foundation

This is the active website work, continuing the existing `2.0` branch. The public website remains on `main`. The September 9, 2026 Soft Daylight decisions below supersede older visual proposals in `design/handoff/`; those files remain useful source material.

## Shared visual system implemented site-wide

The September 10, 2026 cohesion pass replaces the conflicting per-page typography
rules with one final cascade layer: `css/site-system.css`. Newsreader sets practical
headings and reading prose; Cormorant Garamond italic is reserved for reflection
titles, prayers, the wordmark, and an occasional thesis quote; Manrope sets interface
text. The type ladder visibly distinguishes a daily reflection, index or article
title, guide title, section, chapter, card, lede, reading body, and label.
Canonical long-form prose uses a dedicated reading-body role at 19px/1.7 on phones
and 20.5px/1.68 on larger screens. Supporting UI, cards, panels, labels, and
promotional copy retain their smaller roles.

Every normal route loads the same locally served fonts and the shared system after
its structural stylesheet. Structural styles are copied intact: do not reintroduce
the old build-time CSS regex that removed declarations, because it also removed
resets and layout rules. Future cross-site typography, measures, spacing, masthead,
footer, and repeated-component edits belong in `css/site-system.css`; page-specific
geometry remains in the structural stylesheets. Guide/article roles follow
`helpers/content-catalog.mjs` without changing stable URLs.

Links and navigation follow one quiet editorial interaction system. Inline prose
links and standalone text links use restrained text-width underlines; navigation
uses no hover underline and reserves its short olive underline for the current
page. Most links carry no arrow. A right arrow is reserved for an important forward
CTA, the diagonal arrow identifies an external text destination, and left/right
arrows remain for true previous/next or back navigation. Image-based store badges
need no added arrow. Cards may be a single link only when they have one clear
destination; editorial previews keep the title as their primary link when future
secondary interactions may be added. Shared keyboard focus, touch targets, masthead
states, and mobile-menu behavior are owned by `css/site-system.css` and `js/main.js`.

The two private `/typography-review/` routes remain available for old links but
now use the same typography as the normal pages. They are excluded from indexing.
The old local migration stash is superseded; do not apply it over this implementation.
Launch content review remains separate from visual-system approval.

## Agreed direction

- Warm white, restrained olive, daylight photography, confident editorial typography.
- Full-bleed daily reflection hero. People and recognizable everyday moments are appropriate.
- The supplied full-page mockup is the visual specification, not loose inspiration. Homepage: bold sans-serif masthead in the shared warm-white header above the full-bleed window photograph, readable upright Lora serif hero, portrait article images beside text, three guides in a compact horizontal row, shallow photographic app invitation, centered compact email signup, and a small publication footer. All six guides remain on the guide index.
- The homepage has its own `editorial-home.css` and does not load the legacy version-c / soft-daylight stylesheets. The homepage photograph begins below the shared header, matching the Daily Reflections page; “full bleed” describes the image width, not an underlapping masthead. Do not revert it to stacked cards, numbered guide lists, or a tall app section. Preserve the compositional reference in `design/approved-homepage-reference.webp`. The September 10 typography reference is `design/approved-upright-typography.webp`: upright Georgia section, article, guide, and email headings, with italic emphasis retained only in the app invitation. The main reflection title uses upright Lora, reduced sizing, and 1.08–1.1 line spacing for readability; this explicitly supersedes the earlier italic hero. The decorative “A moment of your own…” caption has been removed from the homepage hero.
- Homepage article previews retain their editorial image-and-copy pairing on larger screens, but stack image above copy on phones. Phone images use a consistent 16:10 crop so text never overlaps or becomes compressed beside a narrow image.
- Six guides: Surrender, Detachment, Boundaries, One Day at a Time, Finding Yourself, Finding Support.
- Letting Go remains a prominent article, linked from the homepage, articles index, and guides index.
- Photographic app invitation with the actual supplied app screenshot, not a simulated screen.
- One quiet email invitation closes every public page immediately above the footer. Attraction, not promotion: no popups, urgency, repeated subscription prompts, or invented social proof.

## Brand lockup

The path icon precedes the Cormorant italic wordmark in the shared header. The
lockup is icon plus “Daily Paths” only—no tagline. Use the existing 48px and 192px
icon assets with responsive selection and keep the icon and wordmark optically
balanced as one compact mark. Footers are intentionally utility-only and do not
repeat the brand lockup.

## What is reused

The complete 366-day reflection collection, 12 steps, 12 existing topic pages, legal pages, About, Al-Anon information, Start Here, Essentials, literature, date archives, related reflections, calendar, and existing URLs. The detailed Letting Go article and its original diagrams are retained. The latest `2.0` photography, callout hierarchy, and supporting assets are retained.

`helpers/content-catalog.mjs` controls article and guide labels and destinations independently of URLs. New indexes are `/articles/`, `/guides/`, and `/reflections/`. The homepage is now a separate editorial page; dated reflection pages remain the complete readings.

The guide index currently leads to existing source material. Finding Yourself currently opens Self-Worth & Identity; Finding Support opens the existing Al-Anon introduction. Expand and review each source as the writing progresses. The support guide still needs the agreed coverage of other relevant groups. Surrender is the approved long-form Step One guide at the stable `/topics/powerlessness/` path and focuses on recognizing powerlessness and unmanageability, the Three C’s, practical surrender, and program tools. Its three supplied visual inserts are rendered unaltered and uncropped from `assets/guides/surrender/`; the Serenity Prayer closes the article as an editorial typography treatment rather than a fourth image.

`/start/` is not the Surrender guide. It is the newcomer doorway into Al-Anon: a short self-check, what the program and a first meeting are like, a few initial readings, and a meeting link. “Start here” appears as a quiet primary-navigation item on every screen and as one concise homepage invitation immediately after the hero. It does not repeat as a large panel on individual reflection pages.

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

The Reflections index uses `assets/articles/daily-reflections-hero.webp`, a custom
Soft Daylight journaling photograph, beneath the “Daily Reflections” page title.
The twelve collection cards contain only the Step number, principle, one-line
description, and “View reflections” link; month/date metadata begins on the
collection page. `/reflections/favorites/` lists the ten readings with the highest
year-wide combined score of positive responses plus app favorites, with favorites
and positive responses used as tie-breakers in that order.

The homepage hero mirrors the current daily reflection’s exact hero asset, including
bespoke reflection images. The generated manifest updates the image alongside the
date, title, excerpt, and link without a daily deployment. Homepage cropping and
the light text scrim remain specific to the homepage composition.

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
Advertising layout is deferred until AdSense approval; no placeholder currently
reserves space on reflection pages.

September 11 is the approved review route for the next discovery model; the other
365 reflections remain unchanged until Neal reviews it. The trial contains six
crawlable reflection links from the reading’s calendar month, ranked by the combined
count of positive ratings and app favorites. This keeps every month focused on its
Step even when an individual reading concerns a Concept or Tradition. The horizontal
rail is followed by a separate 300-by-600-style desktop ad rail that becomes a short
mobile block, one relevant article and one practical Step guide, and the closing app
invitation. Start Here is handled through the shared navigation
and homepage invitation, not a repeated reading-page panel. The site-wide email
invitation remains visibly “coming soon” while `NEWSLETTER_ACTION` is unset.
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

`editorial-window.webp`, `editorial-doorway.webp`, and `editorial-phone.webp` reconstruct the photography direction in the supplied reference; `soft-daylight-journal.webp` supports the photographic app invitation. `articles/letting-go-hero.jpg` is Neal's supplied September 13 image of a woman pausing during a phone call at her dining table; it is the shared source for the Letting Go article, Articles hub, and homepage preview. The twelve `soft-daylight-*.jpg` reflection heroes and the bespoke September 10 entryway hero are generated assets. The earlier landscape and app-photo collection is retained but no longer selected by reflection pages. `Screenshots/today-actual.png` is Neal's supplied app screenshot from September 9, 2026. Other assets were already committed to `2.0` and remain available.

The Letting Go article uses two supplied illustrated inserts: the revised
`the_worry_loop.webp` and `whats_mine_whats_theirs.webp`. Each image has a
complete visually hidden transcript; the artwork carries the visible typography
while assistive technology receives the same distinctions and takeaway in
semantic text. `back_to_my_side.webp` is retained as an available asset but is
not part of this article. “Let go and let God” remains in the normal article flow
rather than appearing as an insert, followed by the pull quote “They have a
higher power and I’m not it.” The bottom of the article links readers onward to
the One Day at a Time guide.

## Content hub system

The Reflections, Articles, and Guides indexes are three variations of the same
Soft Daylight system. They share the wide shell, Newsreader page-title and deck
roles, token-based spacing, restrained link behavior, and responsive rhythm.
Articles and Guides use the shared `hubIntro` primitive. Reflections retains its
photographic opening while matching that primitive's title, deck, alignment, and
spacing roles through index-scoped CSS.

The differences are intentional: Reflections remains the immersive Step library;
Articles remain an open, photography-led editorial grid; Guides remain numbered,
ruled reference rows constrained to the existing wide reading measure. Article
images standardize geometry and cropping without global color treatment. Article
detail heroes show photography at its natural brightness and color with no scrim,
filter, opacity reduction, or gradient; their title and deck sit on paper below the
image instead of relying on an overlaid dark treatment. Legacy
`.wrap` and Step-card rules remain in place for non-hub templates; the hub
alignment corrections are deliberately scoped to avoid reading-page regressions.

## September 16 Letting Go editorial approval

Neal approved the condensed Letting Go canvas copy, including his final edits to
the worry/control paragraph and impossible-assignment section, for the Soft
Daylight preview. The night-shift ending is now a pull quote; the two supplied
illustrations, established URL, and reading/guide links are retained. This copy
supersedes the earlier Letting Go handoff. Public GitHub main is unchanged.

The September 16 approved insert restyles use `the_worry_loop_blue_gray.webp`
and `whats_mine_whats_theirs_blue_gray.webp`: blue-gray backgrounds, pale sage
and cream accents, deep teal text, and subtle paper texture. Generated with the
built-in image editor from the supplied originals, preserving artwork wording
and layout. The originals remain available; the article now uses these restyles.

Final approved Letting Go inserts now use `the_worry_loop_final.webp` (smaller
center and outer circles) and `whats_mine_whats_theirs_final.webp` (landscape
removed and closing quote raised). All artwork wording is preserved.

## September 16 Jeff J. personal story

`/articles/the-line-i-kept-moving/` is the member story by Jeff J., edited for
grammar and clarity from his supplied account of boundaries with his mother.
It retains his direct voice, dinner example, moving-line image, and recognition
that the pattern could follow him into another relationship. Neal requested
its addition to the preview after reviewing the editorial approach.

The approved green reflection insert with brown question rules is preserved
uncropped in `assets/articles/the-line-i-kept-moving/reflection-insert-editorial.png`.
Its exact edited text is also available in an expandable HTML transcript for
reading at larger text sizes and with assistive technology. The insert is
accompanying editorial content, not a verbatim contributor quotation.

Related readings: April 23 / day 114, June 28 / day 180, December 18 / day 353.
Live destinations: current Boundaries guide (rewrite still pending), Finding
Yourself, and Letting Go. Voices from the Grave and The Power of Saying No are
marked Coming soon. Their proposed paths are recorded in the story module;
they are not broken hyperlinks or empty published pages. Update status and
path when the full pieces are ready. Confirm contributor approval and credit
as part of the existing launch editorial review.

Neal restored discreet 01–04 numbering to the approved green insert while
retaining the brown left rules beside each question. Earlier insert iterations
remain in local development history; only the final insert is published.

Final insert revision aligns headings, paragraphs, and question rules on one
left edge with numbers in the margin. Question two now ends “next time?”;
the expanded text matches this approved edit.

The latest insert reduces heading and body scale, adds generous whitespace,
and uses plum questions with matching left rules. Numbering and the shortened
“next time?” question remain. This replaces the denser green treatment.

The revised insert uses a wider insight column and a contrasting sage question
column, plum question rules, restrained numbers, and open spacing. It replaces
the flat single-column treatment without changing the approved wording.

Neal approved syncing the story and insert to GitHub 2.0. The story now uses
`assets/articles/the-line-i-kept-moving/dinner-table-hero.webp`, a generated
editorial illustration of the dinner-table moment, in its hero and article preview.
Article imagery should respond to each story and may differ in style; do not apply
the Daily Reflections photography grammar to all articles. This illustration is
not a likeness of Jeff J. or his mother.

The byline is simply “By Jeff J.” Neal will have Jeff review and approve the
changes; do not add “Edited for clarity” to his byline.
