# The four leftovers — drafts to create in the Story Room

Four pages inherited from the old site have never been in the Story Room, so they
are the only content on the site that can only be edited by changing code. Putting
a draft of each into the Story Room hands them over, and makes the editing queue
complete: every article and guide in one place.

**These four are not stubs.** `HANDOFF.md` §5 calls them that; they are 545 to
1,285 words of real prose each. What they have not had is a rewrite or a review.

| Page | Now at | Words | Reflections pointing at it |
|---|---|---|---|
| Trusting a Higher Power | `/topics/higher-power/` | 1,285 | 35 |
| Focus on Yourself | `/topics/focus-on-yourself/` | 638 | 11 |
| Community & Fellowship | `/topics/fellowship/` | 587 | 19 |
| Understanding the Disease | `/topics/the-disease/` | 545 | 10 |

One `.md` file here per page, holding that page's current copy verbatim plus the
metadata a Story Room entry needs — address, content type, card summary, hero and
its alt text. Paste the body in as a **private draft**. A draft changes nothing on
the site; only a Publish replaces the page.

## Why these were not created for you

Creating them means writing to Supabase, which `AGENTS.md` rules out for this
work: the structural side does not write to the database. So the drafts are
prepared here and creating the entries is a few minutes in the Story Room.

## Already in the Story Room

One Day at a Time (`cms-one-day-at-a-time`) and Gratitude & Hope
(`cms-gratitude-and-hope`) are both there already, published, and marked deferred
on the site pending their rewrites. Nothing to create for those two.

That leaves one other page outside the Story Room: the static About Al-Anon guide
at `/guides/about-alanon/`. It is deliberately excluded here, because a second
version of it is already published in the Story Room and the choice between them
is open — see `editorial/about-alanon-comparison.md`.

## Two things to keep in mind

**Keep the `/topics/` address for now.** Publish the draft at the address the page
already has. When a rewrite settles a title, moving it is one line in
`helpers/theme-pages.mjs`, which writes the redirect at the same time
(`HANDOFF.md` §1). Moving first and titling later is what strands an address.

**Assigning themes is the last step, not the first** (`HANDOFF.md` §6). Between
them these four are the destination of 75 reflections, so retiring one without
repointing its themes drops the onward link from that many readings. Nothing needs
deciding about that to create a draft.

## Regenerating

`npm run drafts:leftovers` rebuilds these from the current built pages.
They are a starting point captured once, not a live mirror — once a draft exists
in the Story Room, that draft is the copy that matters and these are history.
