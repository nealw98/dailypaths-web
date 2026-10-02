# Website email collection

The website posts opt-ins to the `newsletter-signup` Supabase Edge Function. It validates input and consent, rejects an invisible bot field, limits attempts by a short-lived salted IP hash, and inserts one normalized email address. Duplicate requests do not reveal an address's membership or reactivate unsubscribed addresses. Subscriber and rate-limit tables have RLS enabled and no anon/authenticated grants. Only server-side service-role access is permitted. The browser uses the existing public anon JWT, never a secret key.

New contacts are `pending`. No confirmation or newsletter messages are sent by this implementation. Development and production sources are recorded separately. Do not import test/development addresses into production campaigns. Only send broadcasts to confirmed `subscribed` contacts. Respect `unsubscribed` and `suppressed` states. There is no automatic provider sync yet.

## Resend wiring (built and deployed October 2, 2026; sending not yet switched on)

Sign-up now uses double opt-in:

1. Someone submits the form. The address is saved as `pending` (as before).
2. If `RESEND_API_KEY` and `NEWSLETTER_FROM` are set on the `newsletter-signup` function, a confirmation email goes out with a link to `/email/confirm/?token=…` on the website. If either is missing, nothing is sent and the form keeps its old message — so deploying the code first is safe.
3. The page asks the person to press a button (so mail scanners that merely open links cannot confirm anyone). That calls the `newsletter-manage` function, which sets `subscribed`.
4. Unsubscribe works the same way from `/email/unsubscribe/?token=…`, and the function also accepts mail clients' one-click unsubscribe (POST to `newsletter-manage?action=unsubscribe&token=…`, no login).
5. Someone who has unsubscribed can rejoin by signing up again: the address goes back to `pending` with a **new** confirmation token (old links stop working) and they must confirm the new email. Nothing is sent to them until they do. A `suppressed` address (bounce or complaint) never rejoins. A still-`pending` address that signs up again gets a fresh link at most once an hour. An old confirm link cannot re-subscribe an unsubscribed address.

Status meanings: `pending` signed up, not confirmed, never emailed beyond the confirmation; `subscribed` confirmed, may receive daily emails; `unsubscribed` opted out; `suppressed` blocked (bounces/complaints), never mailed.

Done October 2: migration `20261002180000_newsletter_tokens.sql` applied; `newsletter-signup` (v3) and `newsletter-manage` (v1, `verify_jwt` false) deployed; `dailypaths.org` is verified for sending in Resend. Replies to the confirmation go to `support@dailypaths.org` (override with the optional secret `NEWSLETTER_REPLY_TO`). The live site (`main`) has no signup form, so secrets can be added before launch without sending anything public. **Remaining to switch on:** add Resend secrets `RESEND_API_KEY` and `NEWSLETTER_FROM` (for example `Daily Paths <hello@dailypaths.org>`) in Supabase → Edge Functions → Secrets; verify the sending domain in Resend (DNS records). Confirmation links point at dailypaths.org, so enable sending only once the new site is live there.

## Daily send (built and deployed October 2, 2026; switched OFF)

`newsletter-daily` sends each day's reflection to `subscribed` addresses only. Email order: date, title, "Thought for the day", an excerpt, a "Read today's reflection" button, then an optional "New on Daily Paths" block, then the unsubscribe footer.

- **Excerpt:** built from the reading's text in the `readings` table — whole sentences, about 200–330 characters, cut at a word only if the first sentence is very long. (The site's own `readings-manifest.json` excerpt is a hard 205-character cut, so it is not used.)
- **"Worth reading" rotates.** Each email has one piece below the reflection button, under the label "Worth reading": its name, a brief description and a link ("Read the article" or "Read the guide"). The pool is every article and guide published in the Story Room plus the 12 Step essays under `/steps/al-anon-step-N-…/` (Step essays are called articles, titled "Step 11: Connection" and described by the Step's `hook` text in the `steps` table). The pool is sorted by address and the email shows one per day (day number modulo pool size), so nothing repeats until every piece has been shown. Adding a piece to the site adds it to the pool automatically; there are no dates and nothing to flag, so fixing a typo changes nothing.
  - **Unfinished pieces are left out** with a list in `public.newsletter_config`, key `feature_exclude` (comma-separated fragments of the address). It currently holds `one-day-at-a-time,gratitude-and-hope`. When those two are finished, delete those words (or the whole row): `update public.newsletter_config set value='' where key='feature_exclude';`
  - A piece is only shown if its page answers on the live site, so no email carries a dead link; if today's pick has no live page the next piece is used, and if none qualifies the section is left out.
  - **Marking something "new" by hand (not needed for launch):** a row in `public.newsletter_featured` (`kind` = `article` or `guide`, `title`, `description`, `path`, `show_from`, `show_until`) replaces the rotation while its dates cover today. Example: `insert into public.newsletter_featured(kind,title,description,path,show_from,show_until) values ('guide','Finding Help','Recognizing the effects of someone else''s drinking, finding a meeting, and what the program asks of you.','/guides/finding-help/','2026-10-10','2026-10-17');`
- **Preview what tomorrow's email looks like** without sending: call the function with `{"mode":"preview"}`. It reads today's reading by New York date from `https://dailypaths.org/readings-manifest.json`, so it follows the live site.

- **Unsubscribe:** every email has an Unsubscribe link in the footer (to `/email/unsubscribe/?token=…`) and the one-click `List-Unsubscribe` headers that Gmail and Apple Mail turn into their own Unsubscribe button.
- **Schedule:** a database job (`cron` job `newsletter-daily`) calls the function at 11:00 UTC every day (7:00 AM EDT / 6:00 AM EST).
- **Switch:** nothing is sent until `public.newsletter_config` row `send_enabled` is `true` (it is `false`). To go live: `update public.newsletter_config set value='true' where key='send_enabled';` To stop: set it back to `false`.
- **Once per day:** a row in `public.newsletter_sends` is claimed before sending, so the same day can never be sent twice. If every batch fails the row is released so it can be retried.
- **Secret:** the function is called with a random secret kept only in `public.newsletter_config` (`send_secret`) — nobody has to create or paste one. Calls without it are refused.
- **Modes:** `{"mode":"preview"}` returns the email without sending; `{"mode":"test","to":"you@example.com"}` sends one copy marked [Test].
- **Postal address — decided October 2:** the footer deliberately has **no** postal address, because the only address available is Neal's home. US commercial-email law (CAN-SPAM) expects a physical or PO box address; Neal accepted that until a business PO box exists. When one does, add it as one line in the footer of `buildEmail` in `supabase/functions/newsletter-daily/index.ts` (and the confirmation email in `newsletter-signup` if wanted).
- **Scale:** sends in batches of 100 about every 0.6 seconds; fine for several thousand subscribers per day.

## Delivery setup (original notes)

Choose an email service and sender address, verify the sending domain, and connect opt-in confirmation plus unsubscribe/bounce events before activating campaigns. Mailchimp is a suitable managed option for newsletter templates, confirmations, unsubscribes, and RSS campaigns. This is separate from Supabase Auth email, which is for account access.

The build now generates `/reflections.xml`: seven recent daily items, each with a title, a short teaser, and a **Read today’s reflection** link. It never includes the full reading. Configure an RSS campaign to send new daily items once the production domain and daily build are active. Use the production feed after launch, not the development feed. New article announcements can be separate occasional campaigns.

Suggested email: subject = reflection title; body = date, 1–2 introductory sentences, one prominent reading link, and the provider's unsubscribe footer. Daily Paths is the destination for the full piece.

## Verified

Synthetic reserved-domain signup, invalid email, missing consent, honeypot, case normalization, duplicate behavior, public-read denial, and persisted pending status. No real recipient was emailed. The synthetic records are removed after verification.

## Existing database launch blocker

Four unrelated content tables (`stories`, `steps`, `themes`, `journal_quotes`) have RLS disabled and broad anon/authenticated write grants. Review and restrict their write permissions before launch while preserving required public reading access. They were not changed as part of subscriber collection.
