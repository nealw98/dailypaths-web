# Prompt for Claude Code — Letting Go topic page

Implement the Letting Go topic-page update from
`design/handoff/topics/letting-go/`.

Read, in order:

1. `design/handoff/topics/letting-go/README.md`
2. `design/handoff/topics/letting-go/STORYBOARD.md`
3. `design/handoff/topics/letting-go/ARTICLE.md`
4. `design/handoff/topics/letting-go/IMPLEMENTATION.md`

Scope the change to `/topics/letting-go/` and reusable code/styles strictly
needed by that page. Use the four PNGs in `reference-images/` as temporary
placeholders. Keep their integration easy to replace with responsive live-text
components later.

Important precedence: the topic-specific structure in this folder supersedes
the fixed four-chapter rule in `design/handoff/theme-page/README.md` for this
page. Continue using the established Daily Paths design tokens and shared
site chrome.

Do not rewrite approved article copy, migrate the remaining taxonomy, create
duplicate topic rows, publish, or commit unless explicitly asked. Resolve
canonical internal-link routes from the current project. Build locally, check
desktop and mobile, verify links, and return a concise change summary plus the
local preview URL for review.
