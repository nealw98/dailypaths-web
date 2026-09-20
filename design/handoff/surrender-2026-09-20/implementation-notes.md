# Implementation notes

## Scope and source of truth

This package prepares a development-preview implementation, not a production launch or URL migration. Repository: `nealw98/dailypaths-web`; development branch: `2.0`. Production `main` and its intentional automated daily rebuilds must remain untouched.

Read current repository instructions and preserve unrelated work. Previously inspected starting points were `helpers/theme-data.mjs`, `templates/theme-guides/boundaries.md`, `templates/topics.mjs`, and `FOUNDATION.md`. Recheck current architecture before choosing files. Do not edit only generated output. Store chosen assets and implementation source in the repository.

`surrender-guide.md` contains the exact publishable guide text from Neal's latest attachment, `Pasted markdown(1).md`. Its prose has not been rewritten. `source-notes.md` records provenance and subsequent design choices. `insert-copy.md` controls exact additional insert text and transcribes the supplied images. Insert placement is specified below; the supplied manuscript does not contain placement comments. Render existing manuscript insert copy once, applying these visual instructions. Its Markdown bullets and rules are content delimiters, not a requirement to show bullets in the final editorial inserts. The outdated Editorial Notes from the attachment are superseded by this file.

## Page identity and structure

- Guide label: **Surrender**.
- H1: **Surrendering the Unwinnable Battle**.
- Subtitle: **A practical guide to accepting powerlessness, reclaiming your own life, and returning to surrender when the urge to control comes back.**
- Route: `/topics/powerlessness/`; do not rename or redirect it.
- Preserve the current Surrender hero: the existing shore/figure/gulls photograph. No replacement is supplied. Preserve brightness; do not add a heavy dark overlay.
- Use the six-item “In this guide” navigation near the top, matching Boundaries. Section headings are not numbered; the five practical steps are numbered.
- Maintain readable article width, connected prose, generous section spacing, and current site typography. Keep the distinction between the guide label, page title, and subtitle.
- Optional page description for existing metadata fields: “A practical guide to surrender: understand powerlessness, recognize unmanageability, and choose how to respond when fear pulls you back toward control.” Do not turn this task into a sitewide SEO migration.

## Insert map

| Insert | Location | Treatment and status |
| --- | --- | --- |
| Spiritual Principles of Surrender | Understanding Surrender, after the first pull quote | Live text, three editorial rows with large italic principle names and full definitions. `spiritual-principles-reference.png` is a visual direction, not a finished text asset. Remove its doubled final period and omit the optional brand kicker. |
| Three Cs | Putting Responsibility Where It Belongs | Three simple emphasized text lines plus the existing prose. No standalone image in this preview. Neal questioned its need; this is an editorial default, not a separately approved final removal. |
| When Life Revolves Around Theirs | After the second paragraph of Recognizing Unmanageability | Use the supplied simplified orbit image. Neal said he would try this version. His later rejection of literal hand/rope imagery referred to the rope insert; do not infer a blanket rejection of this image. |
| Dropping the Rope | End of Step 3 | Typography-led comparison with four paired rows, both column headings, behavior labels, explanations, subtitle, and closing question. Neal liked this version and clarified its focus on conflict and trying to win. |
| Before You Pick Up the Rope Again | After Step 5, before When You Want to Take Control Back | Typography-led five-question insert. Preserve title. Desktop title at left and questions at right, fine separators. Latest shown design supplied for implementation review; no further redesign requested. |
| Surrender and Safety | Within When the Situation Gets Worse, before When Guilt Pulls You Back In | Reuse the exact current Boundaries light teal safety callout component/tokens, dimensions, typography, and spacing. No new artwork. No enlargement interaction. |

## Visual direction and responsive behavior

The inserts' character comes from useful copy, italic serif emphasis, open compositions, fine rules, and aligned comparisons. Avoid literal rope illustrations, hands, icons, rounded cards, slide-style panels, and decorative imagery. No visible bullets for the spiritual principles or five questions. Do not reduce behaviors or definitions to slogans.

The image concepts use warm ivory around `#F4F1EA`, dark teal around `#214743`, and dark ink around `#1C2524`. Use current site tokens for actual implementation, especially the safety callout. Use current loaded fonts and the Boundaries/Letting Go roles. Do not introduce or remove sitewide fonts merely to copy a generated raster font.

Prefer responsive live HTML text for all typography-only inserts. Treat supplied PNGs as visual references and retain them in the repository as appropriate. This preserves editable text, sharp type, mobile readability, and searchable content. Do not embed an image and repeat its entire visible text underneath it. Use the exact text in `insert-copy.md` for live versions.

Desktop layouts:
- Principles: italic names at left; definitions at right; restrained rules between rows.
- Rope: two equal columns with four aligned pairs. Keep explanations adjacent to their labels and the footer smaller than body text.
- Before You Pick Up the Rope Again: title at left; questions at right. Give each question breathing room, without allowing the title to overwhelm the content.

Mobile layouts:
- Principles: each principle name followed immediately by its definition.
- Rope: preserve each opposing pair together in reading order. Stack the two sides within each pair and repeat concise column labels where needed so readers retain the comparison.
- Five questions: title above questions, single column, readable type and restrained rules.
- Orbit image: keep the complete composition available without cropping labels. Provide enlargement and an accessible transcript. If text is too small at narrow widths, provide a reader-controlled text alternative; do not require enlargement just to access the information.

Informational inserts should be fully readable inline. Reuse Boundaries' enlargement pattern for those inserts: pointer and keyboard activation, meaningful accessible name, visible keyboard focus, close button, Escape, contained dialog focus, and restoration of focus and reading position. No visible “Expand” button or business-style control label. Keep normal text selection possible. Keep safety telephone/text links outside any enlargement trigger.

## Pull quotes

Use the current Boundaries/Letting Go treatment: italic serif, quotation marks, fine rules, shared width/alignment/spacing. These are original editorial lines, not attributed Al-Anon quotations.

1. Surrender begins when you stop fighting what you can't control and put down the weight of trying to fix it.
2. Their recovery cannot be the condition you place on attending to your own life.
3. Surrender means taking your hands off the alcoholic's life and putting your attention back on your own.

Each appears once as a pull quote. Do not reinsert the middle line into the immediately adjacent paragraph.

## Links and ongoing reading

Resolve same-site links through existing route/data helpers rather than hard-coding the preview hostname. Preserve the route `/topics/boundaries/` and use the dedicated Detachment guide at `/topics/detachment/`, subject to checking the current project routes.

Selected Daily Reflections:

| Title | Existing reference URL |
| --- | --- |
| The Terror of Surrender | https://dailypaths.org/november-10-the-terror-of-surrender/ |
| The Silence After Surrender | https://dailypaths.org/june-14-the-silence-after-surrender/ |
| Powerlessness over Others | https://dailypaths.org/october-24-powerlessness-over-others/ |

The earlier editorial work read all three in repository content; June 14 and November 10 were also checked on production. October 24 was not successfully re-fetched on production. Verify the current database-backed readings and their development routes before shipping the preview; do not silently invent substitute URLs or readings. Preserve the wider existing related-reading collection behind a “More reflections on surrender” disclosure or established collection pattern. Do not invent a new collection URL. Keep the shared app/email invitation components and avoid duplicates.

Source links retained in the manuscript:
- Step One: https://al-anon.org/for-members/the-legacies/the-twelve-steps/
- Three Cs: https://al-anon.org/blog/al-anons-three-cs/
- Safety: https://www.thehotline.org/plan-for-safety/create-your-personal-safety-plan/

These sources were checked during the editorial work, not freshly reverified while assembling this ZIP. Confirm functioning links during implementation. Preserve independent Daily Paths attribution; do not imply Al-Anon endorsement or invent an author byline.

## Completion checks

Build using the current repository's documented workflow. Inspect the rendered Surrender guide at desktop and narrow mobile widths. Verify all six contents anchors, section/step order, full insert wording, no clipping or duplicate insert content, keyboard enlargement and return, safety links, related readings, and existing shared modules. Confirm page label/title and unchanged URL. Review the scoped diff for unrelated changes. Compare rendered article wording against `surrender-guide.md`; formatting changes must not change the prose.

Commit and push the scoped implementation to `2.0` using the user's existing workflow, then update the existing development preview. Use the existing Sites project and Sites skills if that project manages the preview. Do not create a replacement site, deploy production, or merge into `main`. Report actual outcomes, preview URL, commit, and any unresolved verification or access issue.
