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

Updated September 28 after Neal confirmed the Story Room publications. A1 and A5
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
The policy mentions neither, and mentions no cookies.

It also contradicts itself. "Information We Do Not Collect" opens with *"Your
name, email address, or contact information"*, three paragraphs after "Email
Updates" explains that signups store your email address in Supabase.

This is the most serious item on the list. The audience is people whose lives are
affected by someone else's drinking; recording their full sessions without
disclosure is a trust problem before it is a legal one, and it will also fail
AdSense review. Needed:

- Disclose GA4 and Mixpanel by name, what each collects, and the session recording
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

### A4. About Al-Anon — two versions, one decision

Neal has two versions of this guide and is choosing between them:

- the static page at `/guides/about-alanon/`, carrying inherited copy
- the Story Room's `cms-about-alanon`, titled "The Al-Anon Program" with the card
  "Finding Support", published at the old root `/about-alanon/` path

The root path stopped being a valid publish target when the guide moved
(`helpers/story-room.mjs`, `validPath`), so that second version is filtered out of
every build and cannot currently reach the site. **Publishing the chosen version
in the Story Room at `/guides/about-alanon/` is what makes it live** — the CMS
then owns the page.

Whichever wins still needs reading for launch. The review notes flag that the old
Al-Anon introduction made **absolute privacy and payment claims** and a narrow
Alateen age assertion; confirm the correction carried into this page and not only
into Finding Help. See also B5 — this guide and Finding Support overlap.

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
**not** from a production build. At launch, three pieces Neal explicitly deferred
come back into the Articles and Guides listings:

- `/topics/one-day-at-a-time/` — inherited, awaiting rewrite
- `/topics/gratitude-and-hope/` — inherited, awaiting rewrite
- `/articles/the-stories-we-tell-ourselves/` — inherited

Verified by running the catalog sync against the cached feed in both modes. Either
these ship, or the filter has to apply to production too. It is an editorial call,
not a bug to fix silently — but it has to be made before the production build, or
it gets made by default.

### A7. Learning to Trust is published but suppressed

`retiredPaths` drops `/articles/learning-to-trust/` from the feed entirely,
because it once published with an empty summary and was asked to be dropped as a
placeholder. It is now a **2,716-word article by Celina R**, published
September 28 — the longest piece in the feed. Removing one line restores it.
Left alone pending Neal's decision, since republishing a contributor's article is
not a call to make on inference.

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

- Title: `Al-Anon Daily Reflections — A Reading for Every Day | Daily Paths`
- Keep the reflection title as a prominent `<h2>`; add a true `<h1>` naming what
  the site is. The design can keep the reflection visually dominant.
- Call `homepageStructuredData()`, and add `Organization` alongside `WebSite`.

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

### B5. About Al-Anon and Finding Support compete for the same searches

```
/guides/about-alanon/   "What Al-Anon is, how the program works, and whether it might be for you."
/guides/finding-help/   "An introduction to Al-Anon and finding people who understand."
```

Two guides, both introducing Al-Anon, both in the sitemap. They will split links
and compete for the same queries. Either differentiate sharply — *About* explains
the program, *Finding Support* is purely how to find and attend a meeting — or
merge them. This should be settled as part of A4, since About Al-Anon needs
reading anyway.

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

### B8. Keyword targeting has never been done deliberately

There is no keyword map. Titles were written editorially, one page at a time.
Before optimizing individual pages, produce one table — page, primary phrase,
secondary phrases — so two pages never chase the same phrase (which is how B5
happened).

I have no search-volume data available in this environment, so treat the
groupings below as a starting structure to validate against Search Console and a
keyword tool, not as researched numbers:

| Cluster | Natural home | Currently targeted? |
|---|---|---|
| al-anon daily reflections / daily reader / reading for today | `/` and `/reflections/` | Weakly — `/` not at all |
| detachment with love / how to detach from an alcoholic | `/guides/detachment-with-love/` | Blocked — page is a placeholder |
| setting boundaries with an alcoholic / addict | `/guides/boundaries/` | Partly — title omits the phrase |
| powerlessness / step one / unmanageability | `/guides/surrender/` | Partly |
| what is al-anon / is al-anon for me | `/guides/about-alanon/`, `/start/` | Yes, but split across two pages |
| what to expect at your first al-anon meeting | `/articles/your-first-al-anon-meeting/` | Blocked — placeholder |
| living with an alcoholic husband / wife / parent | **no page** | No |
| adult children of alcoholics | **no page** | No |
| letting go / codependency | `/articles/letting-go/` | Partly |
| al-anon steps / step N | `/steps/…`, `/months/…` | Yes |

The two gaps are worth noting: *"living with an alcoholic [spouse/parent]"* and
*"adult children of alcoholics"* are the phrases people actually type when they
first go looking, and the site has no page for either. Both would be natural
additions to the article programme rather than launch blockers.

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
- **Deferred pages still in the catalog**: `/topics/one-day-at-a-time/`,
  `/topics/gratitude-and-hope/`, `/articles/the-stories-we-tell-ourselves/`,
  `/articles/learning-to-trust/` are hidden from listings but their routes remain.
  Decide whether they are `noindex`, rewritten, or promoted.
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
4. **A6 / A7** decide whether the three deferred pieces and Learning to Trust ship
5. **B6** verify Search Console and baseline rankings **before** the URL moves go live
6. **A3** fresh production build, run all three checks
7. **A8** launch
8. **B4, B7, B9** structured data, hero dimensions, theme destinations — after launch
9. **B5, B8, B10, C** — as the article programme continues

Items 1–7 are the launch. Everything after is improvement.

A1 and A5 are closed. The blocker count is down from six to four: the privacy
policy, the About Al-Anon decision, the deferred-content decisions, and the
build-and-launch mechanics.
