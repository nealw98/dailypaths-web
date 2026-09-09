# Active Daily Paths website work

Read `FOUNDATION.md` first. It records the current Soft Daylight design, content structure, reused work, and remaining launch tasks. Older handoff documents are reference material and do not override the user's September 9 decisions.

Continue the existing `2.0` work; do not start another competing website or replace this static generator with a framework. Preserve the live GitHub `main` branch and public deployment until launch is explicitly requested.

This project has `.openai/hosting.json`. Use the Sites building/hosting skills and reuse its project ID. Build into `dist/` for the private Site. Do not enable the production admin interface, writes to Supabase, or production analytics in this private preview.

Keep content URLs stable while allowing article/guide classification to evolve. Use `dailypaths-content` for requested editorial work and `dailypaths-web-design` for substantial visual changes. Do not treat inherited text as newly approved launch copy.
