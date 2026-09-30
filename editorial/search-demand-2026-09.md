# What people actually search for

From the Bing Webmaster keyword report for dailypaths.org, 30 September 2026 —
the 1.0 site in production. 657 queries, 3,662 impressions, 444 clicks, 12.1% CTR.

This is the first real demand data in the project. Several earlier recommendations
in `LAUNCH-READINESS.md` were written without it and are corrected below.

## Where the demand is

| Intent | Impressions | Share | Clicks | CTR |
|---|---|---|---|---|
| Brand / navigational (`alanon`, `al-anon`, `al-anon.org`) | 1,608 | 44% | 12 | **0.7%** |
| **Steps, Traditions, Concepts** | **912** | **25%** | **174** | **19.1%** |
| Daily readings | 605 | 17% | 140 | 23.1% |
| Other | 235 | 6% | 49 | 20.9% |
| Al-Anon literature (the books) | 186 | 5% | 34 | 18.3% |
| Topics (boundaries, detachment, higher power…) | 116 | 3% | 35 | **30.2%** |

## The correction that matters

**Do not optimise for bare "al-anon".** It is 44% of impressions and converts at
0.7% — `alanon` alone is 783 impressions and 2 clicks, `al-anon` is 590 and zero.
These are navigational searches for al-anon.org, at position 6–8. The traffic is
not winnable and would not be the right visitor if it were.

An earlier note framed the homepage as "invisible for its own subject" and
proposed optimising it for that term. The subject was right; the term was not.
The homepage should be built for **daily readings** (23.1% CTR) and the Steps,
not for the bare brand word.

## Steps are the largest winnable demand, and they already convert

912 impressions at 19.1% CTR, average position 3–5. Split roughly in half:

**440 impressions name a specific Step.** The distribution is lopsided:

| Step | Impr | Step | Impr | Step | Impr |
|---|---|---|---|---|---|
| 1 Acceptance | 40 | 5 Honesty | 26 | **9 Brotherly Love** | **67** |
| 2 Hope | 35 | 6 Patience | 21 | 10 Integrity | 13 |
| 3 Faith | 26 | **7 Humility** | **75** | 11 Spiritual Awareness | 7 |
| 4 Courage | 38 | **8 Willingness** | **79** | 12 Service | 13 |

Steps 7, 8 and 9 are half of it — humility, willingness, amends. The work of
making amends is what people search for most.

**435 impressions are generic** — "al anon 12 steps", "12 steps of al-anon",
"al anon steps" — and these convert at only 8%, against 19% for the whole group.

### The page that should catch them does not exist

`/steps/` redirects to `/reflections/`, which is titled *"Daily Reflections by
Step"*. So the obvious address for "the 12 steps of Al-Anon" forwards to a daily
readings page. Someone searching the generic phrase is shown a reading collection
and does not click, which is exactly what the 8% says.

The twelve individual Step articles are fine — they carry "Al-Anon 12 Steps" in
their titles and rank at 3–5. What is missing is the hub above them.

## Two smaller findings

**Topics convert best of anything — 30.2%** — on small volume. Boundaries,
detachment, higher power, honesty, gratitude. The guides answering these are
strong; almost nothing points at them (see B9). This is the cheapest available
improvement.

**Literature demand survived the pages.** 186 impressions and 34 clicks on
queries naming Al-Anon's own books — Courage to Change, One Day at a Time, Hope
for Today, Paths to Recovery. Those five pages were retired on 28 September as
thin and a copyright exposure, which was the right call on both counts, and they
now forward to Finding Help. The report has no landing-page column, so it cannot
say how many of those clicks were on the literature pages themselves rather than
on reflections. Worth watching after launch rather than reversing now.

## What this changes

1. **Build the Twelve Steps hub** at `/steps/`, instead of redirecting it away.
   435 impressions at 8% is the clearest gap in the data.
2. **Point the homepage at readings and Steps**, not at the brand word.
3. **Give Steps 7, 8 and 9 the first look** in any Step-page improvement.
4. **Assign the topic themes** (B9). Highest CTR, lowest coverage.
5. **Leave bare "al-anon" alone.** It will keep producing impressions and almost
   no clicks, and it will drag the site-wide CTR down. Judge changes on the other
   groups.

Re-pull this report after launch. Every number here describes 1.0, before the
2.0 URL moves, the new guides, or any title change.
