# 2.0 launch readiness — outstanding items

Reviewed September 28, 2026, against the `2.0` branch at `1286a8c`, the committed
production build in `docs/`, and the live sitemap on `origin/main`.

Page-level counts come from the last committed production build, which predates
the September 28 address moves and the removal of the literature pages. They are
dominated by the 366 reflections, so a fresh build moves them very little — but
re-measure before acting on any single number.

`FOUNDATION.md` records the design and editorial decisions. `HANDOFF.md` records
the URL and build structure. This file is only the list of what is still open.

**Nothing here is a reason to delay indefinitely.** Four items are genuine
blockers; the rest are improvements that can follow launch. They are marked.

Updated October 2 (A7 closed, address fix, email and database items added). Earlier: September 28 after Neal confirmed the Story Room publications. A1 and A5
are closed — A1 was my error, corrected in place rather than removed.

---

## Where 2.0 actually stands

| | |
|---|---|
| Live site | `main` → `docs/` → dailypaths.org, rebuilt nightly at 05:00 UTC |
| Development | `2.0`, not deployed publicly; preview site is `noindex` and `Disallow: /` |
| Pages in the last production build | 425 real pages + 410 redirects |
| Reflections | 366, complete, with heroes, structured data and per-page OG images |
| Guides in the catalog | 5 — Surrender, Detachment, Boundaries, About Al-Anon, Finding Support |
| Articles in the catalog | 7 (+1 preview-only) |

The reflection library, the visual system, the URL freezing, the sitemap
verification and the redirect handling are done and hold together. What is
outstanding is concentrated in four places: **unwritten copy**, **the privacy
policy**, **the launch mechanics**, and **SEO**.

---

## A. Blockers — 2.0 cannot ship until these are done

### A1. ~~Three pages are placeholders~~ — resolved September 28

**This item was wrong, and is now closed.** All three are published in the Story
Room with full content, and were when the review was written:

| Page | Story Room id | Words | Published |
|---|---|---|---|
| `/guides/detachment-with-love/` | `051e6f44…` | 1,768 | Sept 25 |
| `/guides/finding-help/` | `012aaa8a…` | 2,442 | Sept 25 |
| `/articles/your-first-al-anon-meeting/` | `de45655f…` | 1,325 | Sept 26 |

The "placeholder" and "coming soon" strings found on the built first-meeting page
were the newsletter block's `placeholder=` attribute and its "Email updates are
coming soon" note — the shared footer on every page, not the article. I read a
grep result as page content without checking where it landed.

The code had not caught up with the publications, and that part was real:
`drafts` still labelled two of them Placeholder, the review manuscripts could
still stand in for approved pages, local overrides outranked the Story Room's own
card text, and the first-meeting article was in the catalog only in the preview.
All fixed — see the September 28 entry in `FOUNDATION.md`.

### A2. The privacy policy does not describe what the website does

`templates/privacy.mjs` is written for the app. Every production page loads
Google Analytics 4 (`G-HSDBJDBVCS`) and Mixpanel with `autocapture: true` and
**`record_sessions_percent: 100`** — full session recording of every visitor.
The policy mentioned neither, and no cookies. (Since fixed — see below.)

The app section's "we do not collect your email" is accurate for the app and sits
under the App heading; the website section says it stores an email only if someone
joins the list. Not a contradiction.

**Updated October 2 (Neal approved):** policy now names Resend as the sender, says a
confirmation email is sent and every message carries an unsubscribe link, states
retention (until unsubscribe or removal request), drops the "development" signup
detail and the "marketing" wording, and mentions the host's server logs. It
assumes email sending is live at launch — **do not ship it before that is true.**
The confirmation-email sentence assumes double opt-in is built.

This is the most serious item on the list. The audience is people whose lives are
affected by someone else's drinking; recording their full sessions without
disclosure is a trust problem before it is a legal one, and it will also fail
AdSense review. Needed:

- Disclose GA4 and Mixpanel by name, what each collects, and the session recording
  — **Done October 1:** session recording is switched off (`record_sessions_percent: 0`
  in `templates/base.mjs`) and the website section of the policy names both services.
  The live `main` site keeps recording until `2.0` replaces it.
- Reconsider whether 100% session recording is appropriate for this audience at all
- Fix the email contradiction
- Add a cookie statement
- Review Terms for the same app-versus-website gap

### A3. The pre-launch URL check has not been run against a current build

`npm run check:launch-urls` compares the live sitemap against the build in hand.
Run today it reports clean — **but against the stale `docs/` build from September
27**, which predates the September 28 address moves. Since that build:

- Six themes moved (`/topics/boundaries/` → `/guides/boundaries/`, powerlessness
  → surrender, letting-go, honesty, self-worth, detachment)
- `/essentials/` was dropped and `/prayers/` redirected
- `/traditions/` and `/concepts/` were added
- `/literature/` and its four book pages were removed and redirected
- `/themes/<slug>/` now resolves in one hop instead of two

Build fresh with `SITE_ENV=production`, then run **both**:

```bash
npm run check:sitemap
npm run check:launch-urls
node scripts/check-launch-review.mjs   # needs dist/server/index.js
```

`check-launch-review.mjs` was never run after the About Al-Anon change
(`HANDOFF.md` §4 asks for it).

### A3a. One live address would have 404'd — fixed

`check:launch-urls` against a fresh production build (October 2) found one live
address with no redirect: `/february-27-i-cant-do-everything/`. The frozen slug
file held `…i-cannot-do-everything` for day 58, probably seeded while the title read
"Cannot" and not updated when it became "I Can't Do Everything". Corrected in
`data/reading-slugs.json` to match the live address; the "cannot" form was never
public, so it gets no redirect. After the fix, re-run `check:launch-urls`.

### A3b. Email sending is not connected — open launch item

The sign-up form works and addresses are saved as `pending`. Nothing sends. Still
needed: a sending service and sender address, a verified sending domain, a
confirmation message that moves `pending` → `subscribed`, and unsubscribe handling.
Then replace the footer line "Email updates are coming soon." See
`editorial/email/setup.md`.

### A3c. Four database tables were writable by anyone — partly fixed, October 2

`stories`, `steps`, `themes` and `journal_quotes` had row-level security off and
anon insert/update/delete grants. Same Supabase project as the live site, so this
predates 2.0.

- **`stories` — locked (done).** Read by everyone, written by signed-in admins only.
  Neal does not use it. Migration: `supabase/migrations/20261002170000_lock_stories.sql`.
- **`steps`, `themes` — prepared, not applied.** `js/admin.js` now sends the admin's
  signed-in token when saving, but the live admin page on `main` still uses the
  public key, so locking these before 2.0 is live would stop it saving. Apply
  `editorial/database-lockdown-pending.sql` (steps/themes parts) after launch.
- **`journal_quotes` — not applied.** Something writes to it (154 inserts, 52 deletes
  to date) and it is not in this repo. Confirm the app does not write it with the
  public key before locking.
- Service-role access (Reading Room, edge functions, Supabase MCP / AI tools)
  bypasses these rules and is unaffected. Other admin saves (`member_shares`) still
  use the public key and are a separate table not covered here.

### A4. ~~About Al-Anon~~ — resolved September 29

Neal consolidated About Al-Anon, About the Al-Anon Program and Finding Help into
a single guide: **Finding Help**, 2,309 words, at `/guides/finding-help/`. The
other two are retired, both addresses forward straight there, and the guide is out
of the catalog, the Guides listing and the sitemap. This also closes **B5**, which
was about those two competing for the same searches. See `HANDOFF.md` §3.

Still worth doing: read the consolidated guide once for launch. The review notes
flagged that the old Al-Anon introduction carried **absolute privacy and payment
claims** and a narrow Alateen age assertion. Confirm those did not survive the
merge.

### A5. Attribution — mostly resolved September 28

- **Voices from the Grave** — settled. Published, reviewed, credited to Lance W.
  The card read "Finding your voice · Lance W" already; the earlier
  "byline unconfirmed" note in `FOUNDATION.md` is superseded.
- **The Line I Kept Moving** — also Lance W's. Its catalog card still read
  "Personal story · Jeff J." in production builds, which is corrected. Confirm
  the contributor is content with the published version if that is still open.

### A6. Deferring a piece only defers it in the preview

`launchItems(items, preview)` returns everything unfiltered when `preview` is
false. So `LAUNCH_REVIEW.deferred` hides a page from the preview's listings and
**not** from a production build. At launch, the pieces still deferred come back
into the Articles and Guides listings:

- `/topics/one-day-at-a-time/` — inherited, awaiting rewrite
- `/topics/gratitude-and-hope/` — inherited, awaiting rewrite

(The Stories We Tell Ourselves was rewritten and is no longer deferred.)

Verified by running the catalog sync against the cached feed in both modes. Either
these two ship as they are, or the filter has to apply to production too. It is an
editorial call, not a bug to fix silently — but it has to be made before the
production build, or it gets made by default.

### A7. ~~Learning to Trust is published but suppressed~~ — resolved

Restored September 28 at Neal's request. Celina R's 2,716-word article is published
on 2.0, builds, lists in Articles and is in the sitemap. `retiredPaths` is empty.
Nothing left to do. (Note: it still has no reflection theme pointing at it — see B9.)

### A8. The launch itself is not wired

Nothing in the repository merges 2.0 into `main` or repoints hosting. The nightly
workflow runs on the default branch (`main`) and pushes to whatever branch it ran
on. Before launch, decide and document:

- How 2.0 reaches `main` (merge, or fast-forward)
- That the production build must succeed against the Story Room CMS — the build
  fails deliberately if the feed cannot be read, so a CMS outage blocks the
  nightly rebuild
- That `SUPABASE_URL` / `SUPABASE_ANON_KEY` secrets are set for the production run
- Whether `NEWSLETTER_ACTION` stays unset (the site then truthfully says email is
  coming soon, while still collecting addresses into Supabase)
- Confirm the App Store and Play Store destinations resolve

---

## B. SEO — the substantial opportunity

The technical foundation is in better shape than most sites this size: canonicals
on every page (1 missing), no duplicate titles or descriptions, correct
`lastmod` fingerprinting, working sitemap and redirect verification, per-reflection
OG images, and image `alt` handled properly. What is weak is **targeting** — the
pages most able to rank are the ones least optimized.

### B1. The homepage is invisible for its own subject — *highest value*

| | Current | Problem |
|---|---|---|
| `<title>` | `Daily Paths — A little space for yourself` | No "Al-Anon". No "daily reflections". 40 characters of unused space on the site's strongest page. |
| `<h1>` | *the daily reflection's title*, e.g. "The Many Forms of Amends" | Changes every day, describes a reading, not the site. |
| JSON-LD | **none** | `homepageStructuredData()` exists in `helpers/seo.mjs` and is never called. Dead code. |

Suggested:

- Title: `Al-Anon Daily Reflections & Recovery Guides | Daily Paths` (57 characters,
  so nothing is truncated). **Read B8 first** — the search data says this earns its
  keep from *daily readings*, not from the bare word "Al-Anon", which is 44% of
  impressions and converts at 0.7%.
- Keep the reflection title as a prominent `<h2>`; add a true `<h1>` naming what
  the site is. The design can keep the reflection visually dominant. The hero's
  existing "Today's reflection" label is the natural place — it already sits in
  the right position at the right size and says nothing the date and the button
  below it do not already say.
- Call `homepageStructuredData()`, and add `Organization` alongside `WebSite`.

Mockup of all three: https://claude.ai/artifact/6AZTieZEBwDH3tS3M7NN2j

#### Indexing — verified clean, September 29

Measured on a real production build. `robots.txt` says `Allow: /`, the homepage
carries no `noindex`, its canonical is self-referencing, and it is in the sitemap.
Production output is static, with no `server/`, so nothing adds an `X-Robots-Tag`
header.

One trap worth knowing about. The preview Worker sets
`X-Robots-Tag: noindex, nofollow` on **every** response, unconditionally — correct
for a private preview. It is only ever built for the preview
(`scripts/build-site.mjs` packages it when `SITE_ENV !== 'production'`), so it
cannot reach the live site as things stand. But `.openai/hosting.json` selects
Worker output for the Sites project, so if production were ever served from Sites
rather than GitHub Pages, **the entire site would go noindex silently**. Check the
header, not just the meta tag, the first time production serves from anywhere new.

#### Content — 224 words, and almost none of it prose

| Page | Words in `<main>` |
|---|---|
| **`/` (homepage)** | **224** |
| `/guides/` | 162 |
| `/reflections/` | 215 |
| `/articles/` | 262 |
| `/start/` | 414 |
| a daily reflection | 432 |
| `/guides/finding-help/` | 2,191 |
| `/guides/surrender/` | 2,502 |

There is no word-count threshold to clear, and a short homepage is not a fault by
itself. The problem is what the 224 words are: card summaries, button labels, a
byline, and the day's excerpt. **Not one sentence on the homepage says what Daily
Paths is or who it is for.** So the page Google most wants to use to classify the
site gives it almost nothing, which compounds the keyword-free title above.

The fix is already half-built. The "Start here" band carries the best heading on
the site — *"Is someone else's drinking affecting your life?"*, phrased the way
people actually search — and 29 words beneath it. Taking that to 120–150 words of
genuine copy nearly doubles the homepage, puts real prose under a query-shaped
heading, and changes no layout: it is a longer paragraph in a section that exists.

**What not to do:** add a block of explanatory text at the foot of the page. It is
the standard move, it reads as exactly what it is, and it would sit below the app
band where no reader goes.

### B2. 24 pages omit the core keyword from the title

Every one of them is a 2.0-era page. The legacy pages inherited "Al-Anon"; the
new ones did not.

| Page | Current title |
|---|---|
| `/` | Daily Paths — A little space for yourself |
| `/articles/` | Articles — Daily Paths |
| `/guides/` | Guides — Daily Paths |
| `/guides/boundaries/` | Boundaries: Reclaiming Your Life \| Daily Paths |
| `/guides/surrender/` | Surrendering the Unwinnable Battle \| Daily Paths |
| `/guides/detachment-with-love/` | Detachment with Love \| Daily Paths |
| `/articles/the-stories-we-tell-ourselves/` | The Stories We Tell Ourselves \| Daily Paths |
| `/articles/letting-go/` | Letting Go \| Daily Paths |
| `/articles/voices-from-the-grave/` | Voices from the Grave \| Daily Paths |
| `/articles/the-line-i-kept-moving/` | The Line I Kept Moving \| Daily Paths |
| 12 × `/months/…` | Step N: Principle — Month Daily Reflections \| Daily Paths |
| `/reflections/favorites/` | Favorite Daily Reflections — Daily Paths |

The `<h1>` on the two hub pages was fixed on September 28 — they now read
"Articles" and "Guides" rather than "Thoughtful insights…" and "A place to
begin." The `<title>` tags were not changed with them, and still carry neither
"Al-Anon" nor anything a reader would search for.

The guide and article titles are good *editorial* titles and bad *search* titles —
nobody searches "Surrendering the Unwinnable Battle". The fix is to let the
`<title>` differ from the on-page `<h1>`, which is normal and costs nothing
editorially:

| Page | Suggested title |
|---|---|
| `/guides/boundaries/` | Setting Boundaries in Al-Anon: Reclaiming Your Life \| Daily Paths |
| `/guides/surrender/` | Powerlessness and Surrender in Al-Anon — Step One \| Daily Paths |
| `/guides/detachment-with-love/` | Detachment with Love: An Al-Anon Guide \| Daily Paths |
| `/articles/letting-go/` | Letting Go in Al-Anon: Caring Without Carrying \| Daily Paths |
| `/guides/` | Al-Anon Guides — Detachment, Boundaries, Surrender \| Daily Paths |
| `/articles/` | Al-Anon Articles & Personal Stories \| Daily Paths |

Settle one house pattern while doing this. The site currently mixes
`| Al-Anon Daily Paths`, `| Daily Paths` and `— Daily Paths`.

### B3. Titles and descriptions are too long to display

Measured across the 425 real pages in the last production build:

- **314 titles exceed 70 characters** (Google shows roughly 55–60)
- **378 descriptions exceed 160 characters**; 279 exceed 170

Two causes, both one-line fixes:

1. **Reflections.** `templates/reading.mjs:290` produces
   `{title} – Al-Anon Daily Reflection for {date} | Daily Paths` — up to 95
   characters, so the date and brand are always cut. Shorten to
   `{title} — Al-Anon Daily Reflection | {date}` or drop the brand suffix on
   reflection pages.
2. **Descriptions.** `reading.mjs:73` is `` `${reading.title}: ${stripForMeta(...)}` `` —
   `stripForMeta` caps the excerpt at 155 characters *before* the title is
   prepended, so the result always overruns. Either cap the whole string or pass
   `155 - title.length`. The description also repeats the title, which the title
   tag already carries.

   Separately, `templates/topics.mjs:444` appends *"Reflections and curated daily
   readings from Al-Anon Daily Paths."* to every topic description, producing
   199–208 character descriptions whose visible half is boilerplate.

**Status, October 1: deferred, to do later.** Re-measured after the heading work.
365 of 366 reflection titles and all 12 Step essay titles (avg 83 characters) are
still over 60; article and guide titles are fine, though some are too short to say
what the page is (e.g. "Letting Go"). The brand ending also varies between
`| Daily Paths`, `| Al-Anon Daily Paths` and `— Daily Paths`. Two decisions are
needed first: keep or drop the `| Daily Paths` ending on the shorter titles, and
whether to shorten the Step essay titles mechanically or leave them for Neal to
rewrite (they come from `templates/step-*-essay.mjs`). Article and guide titles
belong to the Story Room, so those are editorial.

### B4. Structured data is missing where it would help most

| Page type | Has JSON-LD |
|---|---|
| Reflections | ✅ Article + BreadcrumbList |
| Legacy `/topics/…` | ✅ Article + BreadcrumbList |
| Voices / The Line I Kept Moving | ✅ Article |
| **Guides** (Boundaries, Surrender, Detachment, Finding Help, About Al-Anon) | ❌ none |
| **Homepage** | ❌ none |
| `/articles/`, `/guides/`, `/reflections/` | ❌ none |

The guides are the longest, most substantial pages on the site and the ones most
likely to earn a rich result. Add `Article` and `BreadcrumbList` to each, and
`ItemList` to the three index pages. `templates/theme-guides/boundaries.mjs:80`
and `surrender.mjs:91` pass no `structuredData` at all.

### B5. ~~About Al-Anon and Finding Support compete~~ — resolved September 29

The two were merged into Finding Help and retired. Nothing competes for these
queries now, and the redirects consolidate whatever the old addresses had earned
onto one page.

### B6. Nothing is verified in Search Console

No `google-site-verification` tag exists anywhere in the repository. Before or
immediately at launch:

- Verify dailypaths.org in Google Search Console and Bing Webmaster Tools
- Submit `https://dailypaths.org/sitemap.xml`
- Confirm the preview origin stays out of the index (it is `noindex` +
  `Disallow: /`, which is correct, but belt and braces)
- Baseline current rankings **before** the 2.0 URL moves so the effect is legible

Without this there is no way to know which keywords the site already ranks for,
which makes every other decision on this list guesswork.

### B7. Core Web Vitals — heroes and one oversized screenshot

- **Reflection heroes are the LCP element on 366 pages** and carry no `width`,
  `height`, `srcset` or `fetchpriority`:
  `<img class="photo-hero-img" src="/assets/reflections/soft-daylight-boundaries.jpg" alt="" />`
  Missing dimensions cause layout shift on the largest element on the page.
  The homepage hero has `fetchpriority="high"` but also no dimensions.
- Those heroes are **320–390 KB JPEGs**, served at full size to phones. WebP plus
  a `srcset` would cut that by roughly 70%.
- `/assets/Screenshots/today-actual.png` is **1.1 MB** and appears in the closing
  app invitation on *every* page. It is `loading="lazy"`, so it does not hurt LCP,
  but anyone reaching the bottom of any page downloads it. As WebP it would be
  around 120 KB.
- 19 images referenced by the build exceed 250 KB; the referenced set totals 12 MB.

Add `width`/`height` to the hero templates first — it is the smallest change with
the clearest ranking effect.

### B8. Keyword targeting — now has data, and it corrects B1

The Bing Webmaster keyword report for 30 September 2026 is analysed in
`editorial/search-demand-2026-09.md`: 657 queries, 3,662 impressions, 444 clicks,
12.1% CTR on the 1.0 site.

**The correction:** B1 proposed building the homepage around "Al-Anon". Bare
`alanon` and `al-anon` are 1,373 impressions and 2 clicks between them — 0.7%
CTR, navigational searches for al-anon.org. Not winnable, and not the right
visitor. The title change in B1 still stands, but it earns its keep from *daily
readings* (605 impressions, 23.1% CTR), not from the brand word.

| Intent | Impressions | CTR | Where it lands |
|---|---|---|---|
| Brand / navigational | 1,608 | 0.7% | leave alone |
| **Steps / Traditions / Concepts** | **912** | **19.1%** | 12 Step articles — **no hub** |
| Daily readings | 605 | 23.1% | the 366, working |
| Al-Anon literature | 186 | 18.3% | pages retired 28 Sep |
| Topics | 116 | **30.2%** | the guides — barely linked |

**The clearest gap:** 435 impressions for generic "12 steps of al-anon" phrasing,
converting at 8% against 19% for the group. `/steps/` — the obvious address —
redirects to `/reflections/`, titled "Daily Reflections by Step". The generic
searcher is shown a reading collection. A real Twelve Steps hub at `/steps/`
is the single best-evidenced page the site does not have.

**Steps 7, 8 and 9** (humility, willingness, amends) are 221 of the 440
Step-specific impressions — half the demand across three Steps.

**Topics convert best of anything at 30.2%**, on the smallest volume, and are the
least linked-to part of the site. That makes B9 a ranking argument as well as a
reader one.

### B9. Internal linking — 112 reflections still lead nowhere onward

From `editorial/theme-destinations.csv`: 135 themes are in use, **71 have no
destination**, covering **112 of 366 reflections (31%)**. Those pages still group
by their Step, so they are not dead ends, but they offer no link to an article or
guide — which is both a reader problem and a lost internal-link signal to exactly
the pages that need authority.

Twelve themes are used three or more times and between them cover 45 reflections:
Balance (5), Fear (5), Accountability (4), Choice (4), Discernment (4),
Empowerment (4), Growth (4), Forgiveness (3), Perspective (3), Practice (3),
Progress (3), Responsibility (3). Assigning just those twelve takes coverage from
69% to 82%. The remaining 51 themes are used once each and are not worth a
decision yet.

`HANDOFF.md` §6 makes assigning themes the last step of publishing a piece, which
is the right habit. The backlog above is what accumulated before that rule existed.

**Read the other way round, the same gap says something sharper.** Five published
pieces have no theme pointing at them at all, so none of the 366 reflections ever
sends a reader to them — Learning to Trust, The Line I Kept Moving, Voices from
the Grave, Your First Al-Anon Meeting, and Finding Help. Every one is new to 2.0.
The theme table was inherited from the old site, where each theme was mapped to a
`/topics/` page, so the new work has nothing pointing at it simply because that
last step has not been taken yet.

The supply is already there: 71 unassigned themes covering 112 reflections, plus
the option of re-pointing themes that are crowded onto one destination.
`/topics/higher-power/` carries seven themes and 35 reflections, including Trust
(19) and Faith (14) — Learning to Trust is an obvious candidate home for some of
those. `npm run inventory` lists the five under "Linked from their index, but from
no reflection".

One judgement to make first: whether a personal story should be a theme
destination at all, or whether destinations stay educational — guides, Steps and
explanatory articles — with the stories reached from the Articles index and from
within other pieces. Three of the five are personal stories.

### B10. `/topics/` is a hub for pages that have left

Six of the twelve themes have moved to `/guides/…` or `/articles/…`. `/topics/`
and its index remain in the sitemap alongside the new `/articles/` and `/guides/`
hubs, listing a mixture of moved and unmoved pages. `HANDOFF.md` §5 retires
`/topics/` once all twelve have moved; three await final titles from the rewrites
and four are stubs. Until then it is a third hub competing with the two real ones.
Low priority, but decide whether `/topics/` should be `noindex` in the meantime.

---

## C. Worth doing, not blocking

- **`HANDOFF.md` §5 is out of date.** It says `/traditions/` and `/concepts/` "do
  not exist" and that 63 reflections have unlinked category pills. Both were built
  on September 28 (`helpers/collection-pages.mjs`, `templates/reading.mjs:104`).
  Correct it before it misleads the next person.
- **Two dead helpers in `helpers/seo.mjs`.** `homepageStructuredData()` is never
  called — either call it (B1/B4) or delete it. `bookStructuredData()` became dead
  on September 28 when the literature pages were removed.
- **The literature redirects point somewhere unrelated.** `/literature/` and its
  four book pages now forward to `/guides/about-alanon/`. Nothing 404s, which is
  what `check:launch-urls` tests for — but Google treats a redirect to a page that
  does not answer the original query as a soft 404 and drops the link equity.
  Those five addresses had ~250–280 words each and are in the live sitemap today.
  Worth deciding whether a short literature page is better than the redirect.
- **Deferred pages still in the catalog**: `/topics/one-day-at-a-time/` and
  `/topics/gratitude-and-hope/` are hidden from the preview's listings but their
  routes remain and they still build. Decide whether they are `noindex`,
  rewritten, or promoted. See A6 — the hiding does not apply to production.
- **Reflections hub redesign** (`HANDOFF.md` §5): the agreed three-section design
  — Steps, Traditions, Concepts — is still 12 month cards.
- **Step pages do not list their reflections.** The 12 Step pages carry only their
  essays.
- **Theme table in the Reading Room** (`HANDOFF.md` §6): the dropdown, the rename
  cascade and the merge behaviour. Seed from `data/theme-destinations.json`, never
  the CSV. Two merges are waiting: `Self-care` → `Self-Care`,
  `Self-acceptance` → `Self-Acceptance`.
- **AdSense** is deferred pending approval; no placeholder reserves space. Note
  that A2 (privacy policy) is a prerequisite for approval.
- **Final device pass** on desktop and phone with real launch content, per
  `FOUNDATION.md`.

---

## Suggested order

1. **A2** privacy policy — largest exposure, independent of everything else
2. **A4** choose the About Al-Anon version, publish it, read it for launch
3. **B1 / B2 / B3** homepage and title/description pass — a day's work, sitewide effect
4. **A6** decide whether the deferred pieces ship (One Day at a Time is being written; Gratitude & Hope undecided)
5. **B6** verify Search Console and baseline rankings **before** the URL moves go live
6. **A3** fresh production build, run all three checks
7. **A8** launch
8. **B4, B7, B9** structured data, hero dimensions, theme destinations — after launch
9. **B5, B8, B10, C** — as the article programme continues

Items 1–7 are the launch. Everything after is improvement.

A1 and A5 are closed. The blocker count is down from six to four: the privacy
policy, the About Al-Anon decision, the deferred-content decisions, and the
build-and-launch mechanics.
