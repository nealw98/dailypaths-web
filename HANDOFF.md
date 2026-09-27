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
| `seo-lastmod.json` (repo root) | the build | every build |

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
- **Theme tags on articles and guides**, and the article/guide cards on
  reflection pages.
- **Moving the eight `/topics/…` articles and guides** to `/articles/…` and
  `/guides/…` addresses.

### One live defect this leaves

63 reflections are tagged `Tradition N` or `Concept N` in `step_theme`. Their
category pill renders as plain text with no link, because
`templates/reading.mjs:80` matches only `/^Step (\d+)$/`. Those pills gain
destinations when `/traditions/` and `/concepts/` are built. Until then, roughly
17% of reflections offer no onward link.

---

## 6. Division of labour

Structure — URLs, redirects, sitemap, build tooling, generated state — is being
handled outside the editorial work. Content, titles, and copy are not.

If a structural change looks necessary to do a piece of content work, say so
rather than making it: the pieces above interlock, and the redirect loop that
started this was caused by two well-intentioned hand-written entries.
