# Website email collection

The website posts opt-ins to the `newsletter-signup` Supabase Edge Function. It validates input and consent, rejects an invisible bot field, limits attempts by a short-lived salted IP hash, and inserts one normalized email address. Duplicate requests do not reveal an address's membership or reactivate unsubscribed addresses. Subscriber and rate-limit tables have RLS enabled and no anon/authenticated grants. Only server-side service-role access is permitted. The browser uses the existing public anon JWT, never a secret key.

New contacts are `pending`. No confirmation or newsletter messages are sent by this implementation. Development and production sources are recorded separately. Do not import test/development addresses into production campaigns. Only send broadcasts to confirmed `subscribed` contacts. Respect `unsubscribed` and `suppressed` states. There is no automatic provider sync yet.

## Resend wiring (built and deployed October 2, 2026; sending not yet switched on)

Sign-up now uses double opt-in:

1. Someone submits the form. The address is saved as `pending` (as before).
2. If `RESEND_API_KEY` and `NEWSLETTER_FROM` are set on the `newsletter-signup` function, a confirmation email goes out with a link to `/email/confirm/?token=…` on the website. If either is missing, nothing is sent and the form keeps its old message — so deploying the code first is safe.
3. The page asks the person to press a button (so mail scanners that merely open links cannot confirm anyone). That calls the `newsletter-manage` function, which sets `subscribed`.
4. Unsubscribe works the same way from `/email/unsubscribe/?token=…`, and the function also accepts mail clients' one-click unsubscribe (POST to `newsletter-manage?action=unsubscribe&token=…`, no login).
5. An `unsubscribed` address is never reactivated by signing up again or by an old confirm link. A still-`pending` address that signs up again gets a fresh link at most once an hour.

Status meanings: `pending` signed up, not confirmed, never emailed beyond the confirmation; `subscribed` confirmed, may receive daily emails; `unsubscribed` opted out; `suppressed` blocked (bounces/complaints), never mailed.

Done October 2: migration `20261002180000_newsletter_tokens.sql` applied; `newsletter-signup` (v3) and `newsletter-manage` (v1, `verify_jwt` false) deployed; `dailypaths.org` is verified for sending in Resend. **Remaining to switch on:** add Resend secrets `RESEND_API_KEY` and `NEWSLETTER_FROM` (for example `Daily Paths <hello@dailypaths.org>`) in Supabase → Edge Functions → Secrets; verify the sending domain in Resend (DNS records). Confirmation links point at dailypaths.org, so enable sending only once the new site is live there.

**Still to build:** the daily send itself. Resend has no RSS-to-email feature, so a scheduled function must send the day's reflection teaser to `subscribed` addresses, with the unsubscribe link and `List-Unsubscribe` headers.

## Delivery setup (original notes)

Choose an email service and sender address, verify the sending domain, and connect opt-in confirmation plus unsubscribe/bounce events before activating campaigns. Mailchimp is a suitable managed option for newsletter templates, confirmations, unsubscribes, and RSS campaigns. This is separate from Supabase Auth email, which is for account access.

The build now generates `/reflections.xml`: seven recent daily items, each with a title, a short teaser, and a **Read today’s reflection** link. It never includes the full reading. Configure an RSS campaign to send new daily items once the production domain and daily build are active. Use the production feed after launch, not the development feed. New article announcements can be separate occasional campaigns.

Suggested email: subject = reflection title; body = date, 1–2 introductory sentences, one prominent reading link, and the provider's unsubscribe footer. Daily Paths is the destination for the full piece.

## Verified

Synthetic reserved-domain signup, invalid email, missing consent, honeypot, case normalization, duplicate behavior, public-read denial, and persisted pending status. No real recipient was emailed. The synthetic records are removed after verification.

## Existing database launch blocker

Four unrelated content tables (`stories`, `steps`, `themes`, `journal_quotes`) have RLS disabled and broad anon/authenticated write grants. Review and restrict their write permissions before launch while preserving required public reading access. They were not changed as part of subscriber collection.
