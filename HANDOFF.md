## October 3 — Footer contact link

Contact is a small “Contact Us” link to mailto:support@dailypaths.org beside
Support in the homepage and standard footers. The separate Contact section was
removed at Neal's request. Saved CMS publications receive the same footer link.

## October 3 — Internal recommendations avoid unrevised legacy essays

Internal links to Higher Power, Focus on Yourself and Understanding the Disease
now use published 2.0 Steps or guides. `internal-link-destinations.mjs` holds the
contextual replacements; `theme-destinations.mjs` resolves captured legacy mappings
without rewriting the generated Reading Room data. A future explicit new destination
in Reading Room takes precedence because only the legacy paths are substituted.
Saved CMS pages receive the same link corrections through editorial policy, including
the current October 31 address/title. The old Topics hub no longer recommends these
three essays. This changes internal recommendations only, not manuscript status or
legacy-page retirement. Do not infer that the remaining legacy pages are retired.

## October 3 — Remove development-only aliases

Removed `/guides/about-alanon/`, `/guides/detachment/` and the Story Room alias
`/articles/detachment/`. They never appeared in production main history.
Do not recreate redirects for them. Older notes below claiming that `/themes/`
and `/steps/step-N/` were never public are incorrect: main contains those routes,
so their redirects remain. Production `/about-alanon/`, `/prayers/` and historical
reflection addresses also retain their redirects. This section supersedes earlier
instructions about the three removed preview aliases.

# Structural work on `2.0` — what changed, and what to leave alone

## October 2 — App overview retired

Neal removed the app overview page and Get the app from desktop and mobile
navigation. The existing bottom app invitations and direct store buttons remain;
Explore the app links are removed, including from older CMS snapshots.
`/app/` is no longer built or listed in the sitemap. The original uploaded
screenshots remain in `assets/Screenshots/app/` for future use.

## October 2 — February 27 keeps its live address

Neal confirmed `/february-27-i-cant-do-everything/` is the correct address.
The preview-only `cannot` variant is dropped entirely, with no redirect and no
entry in the frozen slug map's past list. Existing CMS links are normalized to
`cant` during composition. Do not recreate the `cannot` page or a redirect.

## October 2 — Community & Fellowship retired

Neal confirmed that the inherited Community & Fellowship page is removed.
`/topics/fellowship/` and `/themes/fellowship/` now forward directly to
`/guides/finding-help/`, superseding the earlier proposed First Meeting target.
The topic no longer renders its old essay or an index card. Its theme links
resolve to Finding Help, and a stale CMS publication cannot restore the old page.
The source copy remains in git and the existing editorial draft for reference.

This records structural changes made on the `2.0` branch in late September 2026,
alongside the editorial work. Read it before touching URLs, slugs, redirects,
the sitemap, or anything under `data/`.

`FOUNDATION.md` still records the design and content decisions. This file only
covers how the site's addresses and generated state now work.

---

## 1. Reflection addresses are frozen — titles are free to change

**You can retitle any reflection without consequence. Do not do anything else
to keep its URL working.**

A reflection's address used to be derived from its title, so editing a title in
the Reading Room published the page at a new address and left the old one dead,
with no redirect. The build only ever forwarded the bare date form
(`/september-25/`), never a previous descriptive slug. Fifteen addresses were
abandoned this way between February and September 2026.

Addresses now come from **`data/reading-slugs.json`**:

```json
{
  "v": 1,
  "slugs": { "269": "september-25-improving-the-fellowship" },
  "past":  { "269": ["september-25-vision-and-improvement"] }
}
```

`readingSlug()` in `helpers/slug-utils.mjs` consults that map, so pages, the
sitemap, internal links, the email feed and redirects all resolve the same
address without each call site knowing about it. A reflection the map has never
seen derives its slug from the title once, and is recorded from then on.

The Steps already worked this way: `stepRecordSlug()` prefers a stored
`pathSlug`, which is why Step One sits at `/al-anon-step-1-honesty/` while its
principle reads "Acceptance". A slug drifting from its title is expected and
harmless — readers see the title, never the address.

### Rules

- **Do not** regenerate slugs from titles, or reintroduce a code path that does.
- **Do not** hand-edit `data/reading-slugs.json` to follow a retitle. The whole
  point is that the address stays put.
- **Do not** add entries to the retired-path map in `build.mjs`. It now holds
  one non-reflection entry; reflection redirects come from the `past` lists.
- **To change an address deliberately** (rare): edit that day's value in
  `slugs`, move the old value into that day's `past` array. The build writes
  the redirect.

---

## 2. Generated state under `data/` — do not hand-edit

Three files are written by tooling and committed so they survive between builds.
Treat them as state, not as configuration.

| File | Written by | Cadence |
|---|---|---|
| `data/reading-slugs.json` | the build, for unseen reflections only | rarely |
| `data/favorites-snapshot.json` | `scripts/capture-favorites.mjs` | quarterly |
| `data/theme-destinations.json` | `scripts/theme-destinations.mjs --seed` | when the mapping changes |
| `seo-lastmod.json` (repo root) | the build | every build |

**`data/theme-destinations.json` must stay complete.** The build treats a present
table as authoritative, so a theme missing from it has no destination — the
inherited groups are the fallback for the file's *absence*, not for gaps within
it. A partial file would strip every theme it left out. See section 6.

### Reader favorites are captured quarterly, not read live

Favorites and ratings decide "Keep reading" ordering, the favorites page, and
the featured readings on principle pages. The build used to query Supabase for
them on every nightly run, which meant those pages reshuffled at arbitrary hours
— and when Supabase was briefly unreachable, the build caught the error, carried
on with an empty set, and published a site with the favorites missing.

The build now reads `data/favorites-snapshot.json` and never queries for
favorites. `.github/workflows/refresh-favorites.yml` captures a fresh snapshot on
1 January, April, July and October, or on demand from the Actions tab.

**Do not** restore a live favorites query in the build. Neither the capture
script nor the build will accept an empty snapshot.

### Sitemap `lastmod` describes the page, not the build

Every URL used to be stamped with the build date, so the nightly rebuild told
Google all 417 pages changed daily. `seo-lastmod.json` fingerprints each page so
a date moves only when that page's content moves.

**Do not** reintroduce a build-time timestamp anywhere that lands in page output.
`main` has `?v=${Date.now()}` on its stylesheet link, which is why every nightly
rebuild there rewrites all 419 files; `2.0` replaced it with fixed labels
(`?v=brand-icon-1`). Keep it that way.

---

## 3. About Al-Anon is retired into Finding Help

On September 29, 2026, Neal consolidated three pieces into one guide: the
inherited **About Al-Anon**, the newer **About the Al-Anon Program**, and
**Finding Help**. The result is Finding Help at `/guides/finding-help/`, 2,309
words, published from the Story Room. The other two are retired.

This section previously recorded the opposite — About Al-Anon revived as a guide
alongside Finding Support. That is undone again, and this time the two addresses
are retired rather than repointed at each other.

- **`/about-alanon/`** → `/guides/finding-help/`
- **`/guides/about-alanon/`** → `/guides/finding-help/`

Both forward **straight** to Finding Help, not through each other. The five
retired `/literature/…` addresses used to forward to About Al-Anon and now go
straight to Finding Help too, for the same reason: `check:sitemap` fails a
redirect chain, and so does Google, quietly.

Neither is a valid CMS publish target. `templates/about-alanon.mjs` and
`css/about-alanon.css` are deleted, and the guide is out of the catalog, the
Guides listing and the sitemap. The static page's copy is preserved in
`editorial/about-alanon-comparison.md` and in git history.

The Story Room still lists `cms-about-alanon` as published at `/about-alanon/`.
It has never been able to reach the site — the root path does not match
`validPath` — so nothing is served from it, but unpublishing it there would make
the Story Room match the site.

---

## 3a. The whole URL picture, as of September 29, 2026

Derived from the code rather than a build, so re-run `check:launch-urls` against a
real build before launch — that is the gate, this is the map.

**417 addresses are live on dailypaths.org today. 2.0 has 420.** All 366
reflections keep their current addresses.

**14 live addresses leave the sitemap. Every one forwards:**

| Live today | Forwards to in 2.0 |
|---|---|
| `/topics/powerlessness/` | `/guides/surrender/` |
| `/topics/detachment/` | `/guides/detachment-with-love/` |
| `/topics/boundaries/` | `/guides/boundaries/` |
| `/topics/letting-go/` | `/articles/letting-go/` |
| `/topics/self-worth/` | `/articles/who-am-i-behind-the-mask/` |
| `/topics/honesty/` | `/articles/the-stories-we-tell-ourselves/` |
| `/about-alanon/` | `/guides/finding-help/` |
| `/literature/` + its 4 book pages | `/guides/finding-help/` |
| `/steps/` | `/reflections/` |
| `/essentials/` | `/reflections/` |

**17 addresses are new in 2.0 and have never been public:** `/articles/`,
`/guides/`, `/reflections/`, `/reflections/favorites/`, `/traditions/`,
`/concepts/`, the seven `/articles/…` pieces, and the four `/guides/…` guides.

**Redirect-only addresses that were never public either.** These exist solely so a
guessed or internal link lands somewhere: `/guides/about-alanon/` (created on 2.0
in `3e01481`, retired on 2.0, never shipped), `/guides/detachment/`, `/themes/`
and every `/themes/<slug>/`, and the legacy `/steps/step-N/` forms.

Verified: **no redirect chains**, and **no redirect points at an address outside
the sitemap**. Both are things `check:sitemap` fails on, and both are easy to
reintroduce — a retirement that forwards to a page that was itself retired is the
usual way.

---

## 3b. The homepage has couplings that break silently

Rebuilt on 30 September. Four things about it are load-bearing across more than one
file, and three of them fail without an error.

**The hero's `<h1>` is the small eyebrow label, not the reflection title.** The
title is an `<h2>`. That means every stylesheet rule for the hero title has to say
`h2`: five in `css/editorial-home.css` and **four in `css/site-system.css`**
(`.page-home .ed-hero h2`). site-system loads *after* editorial-home and is more
specific, so a single missed selector there renders the label at 66px in the
reflection's typography. Change the markup and both stylesheets together, or
neither.

**The collection band's responsive rules sit at the end of `editorial-home.css`,
on purpose.** That file's media blocks come *before* its later base rules, so
overrides placed inside those blocks never win. Put them at the end or the band
stays three columns on a phone. Do not sort or reorganise that file.

**`renderHomePage(reading, allReadings)` takes two arguments.** The second is the
full reading list, used for the six previous days. Drop it and the band disappears
with no error — the page still builds and still validates.

**`homepageStructuredData()` is called again.** It sat unused in `helpers/seo.mjs`
for months. It is not dead code; removing it takes the homepage's only structured
data with it.

A build is not enough to catch any of these. Load the built page in a browser and
look at the hero, and check the band at phone width.

### One pre-existing conflict, not introduced by that work

The hero reflection title computes to **Cormorant Garamond italic**, because
`site-system.css` sets `--type-reflection: italic 500 … var(--font-devotional)`.
`FOUNDATION.md` says the title "uses upright Lora … this explicitly supersedes the
earlier italic hero", and `editorial-home.css` does specify upright Lora — but
site-system overrides it. The live site has been contradicting that decision.
Left alone because fixing it is a visible change and Neal's call.

---

## 4. Checks to run before deploying

```bash
npm run check:sitemap        # every sitemap URL is a real, indexable page;
                             # no redirect loops, chains or dead ends
npm run check:launch-urls    # no address that is live today would 404
```

`check:sitemap` already gates the nightly deploy workflow. `check:launch-urls`
compares the deployed sitemap against the build in hand and is currently manual —
run it before any URL change and before launch.

`scripts/check-launch-review.mjs` covers the CMS Worker's redirect and retirement
behaviour. It needs a completed preview build (`dist/server/index.js`) and was
**not** run after the About Al-Anon change. Please run it.

---

## 5. What is designed but NOT built

Do not assume these exist. They were specified in detail but no code implements
them yet:

- **The reflections hub.** `/reflections/` still lists 12 months. The agreed
  design is three sections — Steps, Traditions, Concepts — linking to 12 Step
  pages plus one `/traditions/` and one `/concepts/` page.
- **`/traditions/` and `/concepts/`.** Do not exist.
- **Step pages listing their reflections.** The 12 Step pages still carry only
  their essays.
- **The theme → destination table.** Specified in section 6. Nothing reads it yet.
- **Moving the remaining six `/topics/…` pages.** Six have moved — see
  `helpers/theme-pages.mjs`; `self-worth` joined them as Who Am I Behind the Mask.
  Two await final titles from the rewrites (`one-day-at-a-time`,
  `gratitude-and-hope`), and both are in the Story Room already.
  `/topics/` retires once all twelve have moved.

  The last four — `higher-power`, `the-disease`, `focus-on-yourself`,
  `fellowship` — were called stubs here, and are not: 545 to 1,285 words of real
  prose each. What they have not had is a rewrite, a review, or a Story Room
  entry, which makes them the only content on the site that can be edited solely
  by changing code. `editorial/leftover-drafts/` holds each one's copy and
  metadata ready to paste in as a draft (`npm run drafts:leftovers`).

### One live defect this leaves

63 reflections are tagged `Tradition N` or `Concept N` in `step_theme`. Their
category pill renders as plain text with no link, because
`templates/reading.mjs:80` matches only `/^Step (\d+)$/`. Those pills gain
destinations when `/traditions/` and `/concepts/` are built. Until then, roughly
17% of reflections offer no onward link.

---

## 6. Themes: one table, read in both directions

`readings.secondary_theme` is free text, and it is about to carry more weight than
it can bear as free text. Two behaviours will read it:

- the **pill** on a reflection, pointing at an article, guide, Step or hub;
- the **related readings** on both that reflection and the destination page.

Both come from a single list of theme → destination pairs, read either way. A
reflection tagged `Trust` gets a pill to its destination; that destination lists
every reflection whose theme lands on it. **There is no second list, and articles
carry no tags.** `templates/topics.mjs:293` already works this way against the
inherited `TOPIC_THEME_TAGS` groups — this replaces those groups with an editable
table and retires the `THEME_TO_TOPIC` layer.

### The table

A theme list, not a field on each reading. `Trust` covers 19 reflections; storing
the destination per reading would mean 19 edits to change your mind, instead of
one.

| Column | |
|---|---|
| theme | the text that appears in `readings.secondary_theme` |
| destination | a site path, e.g. `/guides/surrender/` |

135 themes are in use across 366 reflections. Generate the current picture with:

```bash
node scripts/theme-destinations.mjs          # worksheet, CSV + readable
node scripts/theme-destinations.mjs --sql    # the November repairs, as UPDATEs
```

That writes `editorial/theme-destinations.csv` and `.md`, listing every theme, how
many reflections carry it, where it points today, and the destinations available.
71 themes have no destination yet.

**Seed the Reading Room's table from `data/theme-destinations.json`, not from the
CSV.** That file is what the build reads and it is authoritative: 64 themes,
including three settled by name (Humility → Step 7, Service → Step 12, Courage →
Step 4). Once the table exists it becomes the source and a capture overwrites
that file, so anything not carried into the table is lost.

### Assigning themes belongs to writing the piece

71 themes have no destination, covering 112 reflections — 30% of them. Those pages
are not broken: they group by their Step and their Go deeper card names their
collection. What they lack is a link to an article or guide, and for most of them
the reason is that the article has not been written yet.

So the last step of publishing an article or guide is to point the themes that
belong to it at its address. `editorial/theme-destinations.csv` lists which themes
are still unassigned and how many reflections each carries. Twelve of them are
used three or more times — Balance, Fear, Accountability, Choice, Discernment,
Empowerment, Growth, Forgiveness, Perspective, Practice, Progress,
Responsibility — and between them cover 45 reflections, taking coverage from 70%
to 82%. The remaining 51 are used by a single reflection each and are not worth a
decision until one of them bothers somebody.

### Destinations are wider than the articles and guides

Sixteen reflections carry principle vocabulary — *Proportionality, Democracy,
Authority, Unity, Charity, Tolerance* — with no plausible article home. The
destination list therefore includes the 12 Step pages and `/traditions/` and
`/concepts/` as well. A theme may point at any of them. `/traditions/` and
`/concepts/` do not exist yet (section 5), so a destination naming one is inert
until they are built.

### Three requirements for the Reading Room screens

The theme field should become a **dropdown** fed by the table, and the table needs
a maintenance screen. Three behaviours are not optional:

1. **Creating a theme requires choosing its destination in the same step.** One
   extra dropdown, and an orphaned theme becomes impossible. Skipping this is how
   162 reflections ended up with no destination under the inherited groups.
2. **Renaming a theme must update every reading using it.** If readings reference
   themes by text, a rename without a cascade silently detaches every reflection
   that used the old spelling. This is the one behaviour that is easy to get
   wrong.
3. **Merging two themes must be possible.** Needed immediately for
   `Self-care` → `Self-Care` and `Self-acceptance` → `Self-Acceptance`. Same
   mechanism as the cascade in (2).

A dropdown also ends the two failure modes already in the data: 85 themes used
exactly once, and November 1–30 entered with a step number in the theme column
(`scripts/out/november-themes.sql` proposes the 30 replacements).

### Who does what

Creating the table, seeding it, and building the two screens sits with the
editorial side — **the structural work does not write to Supabase** (`AGENTS.md`).
The build will read the table, cache it under `data/` the way
`data/story-room-cache.json` caches the Story Room feed, and wire both
directions. Tell the structural side the table and column names once they exist.

---

## 7. Division of labour

Structure — URLs, redirects, sitemap, build tooling, generated state — is being
handled outside the editorial work. Content, titles, and copy are not.

If a structural change looks necessary to do a piece of content work, say so
rather than making it: the pieces above interlock, and the redirect loop that
started this was caused by two well-intentioned hand-written entries.

---

## 8. Story Room pages carry the footer they were saved with

Story Room pages the site has no template for (Learning to Trust, Your First Al-Anon
Meeting, Finding Help, and in the preview server also The Line I Kept Moving) are
published as complete saved pages. Their footer, scripts and style-sheet version are
whatever the site looked like when they were saved — which, at launch time, was an older
footer whose e-mail field and button were **disabled** ("Email signup is coming soon"),
so sign-up silently did not work on them.

`helpers/site-chrome.mjs` (`syncNewsletter`) now copies the current sign-up block, its
script and the `site-system.css` version label from the freshly built homepage into every
Story Room page, both in the build (`applyPublished` in `helpers/story-room.mjs`) and in
the preview server (`createCmsWorker`, passed in by `scripts/package-cms-preview.mjs`).
The function is embedded in the preview server as text, so keep it self-contained.

If the sign-up block's markup changes again, nothing needs doing for these pages. If a new
shared part of the footer must stay current on saved pages, extend `syncNewsletter`.

## Story Room images are copied into the site — October 3, 2026

`helpers/localize-media.mjs` runs at the end of `build.mjs`. It finds Story Room image addresses
(`…/api/room/media/<id>`) in the built pages, saves each as `assets/story-room/<id>.webp` (generated, but commit it so
builds do not depend on the Story Room), and rewrites the pages. Do not hand-edit those files. The Story Room's
`insert-view.js` is now `js/story-insert-view.js`. The preview Worker still composes Story Room pages at request time
and is unchanged.

## October 3 — Story Room publication routes

The public Story Room feed now carries `routes` and `route_managed` metadata. New
publications use their approved canonical address; old aliases are redirects.
Do not remap route-managed publications through the older linkedStories policy.
The preview Worker consults routes before serving pages and updates the hubs and
sitemap at request time. Existing Step URLs are CMS-capable while their essays
remain in the Twelve Steps collection rather than flooding the Articles hub.

The static build caches the same route metadata and applies redirects, link rewrites,
listing changes and sitemap removals. No production deployment was performed.
`check-cms-routing.mjs` uses the Story Room checkout's Worker test runtime via
CMS_TEST_ROOT and exercises actual HTML rewriting, redirects and sitemap updates.
When packaging, sitemap and individual articles/guides/topics/steps/themes belong
to the Worker; their built pages are retained in its fallback map. For static
sitemap checks, reconstruct the fallback pages into a temporary check directory.
