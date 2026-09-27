# Structural work on `2.0` — what changed, and what to leave alone

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

## 3. About Al-Anon is a guide again

`/guides/about-alanon/` is a published guide alongside Finding Support
(`/guides/finding-help/`). It was previously retired and folded into Finding
Support; that retirement was enforced in six places and has been undone in all
six.

- `/about-alanon/` (the original root path) forwards to the new address.
- It is **not** a valid CMS publish target any more — content for this guide
  belongs at `/guides/about-alanon/`.

**Its copy is inherited and has not been reviewed for launch.** It now appears in
the Guides listing and the sitemap, so it needs reading before 2.0 ships.

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
- **Moving the remaining seven `/topics/…` pages.** Five have moved — see
  `helpers/theme-pages.mjs`. Three await final titles from the rewrites
  (`one-day-at-a-time`, `self-worth`, `gratitude-and-hope`); four are stubs
  (`higher-power`, `the-disease`, `focus-on-yourself`, `fellowship`).
  `/topics/` retires once all twelve have moved.

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
