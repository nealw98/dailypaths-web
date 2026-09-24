# Website email collection

The website posts opt-ins to the `newsletter-signup` Supabase Edge Function. It validates input and consent, rejects an invisible bot field, limits attempts by a short-lived salted IP hash, and inserts one normalized email address. Duplicate requests do not reveal an address's membership or reactivate unsubscribed addresses. Subscriber and rate-limit tables have RLS enabled and no anon/authenticated grants. Only server-side service-role access is permitted. The browser uses the existing public anon JWT, never a secret key.

New contacts are `pending`. No confirmation or newsletter messages are sent by this implementation. Development and production sources are recorded separately. Do not import test/development addresses into production campaigns. Only send broadcasts to confirmed `subscribed` contacts. Respect `unsubscribed` and `suppressed` states. There is no automatic provider sync yet.

## Delivery setup still needed

Choose an email service and sender address, verify the sending domain, and connect opt-in confirmation plus unsubscribe/bounce events before activating campaigns. Mailchimp is a suitable managed option for newsletter templates, confirmations, unsubscribes, and RSS campaigns. This is separate from Supabase Auth email, which is for account access.

The build now generates `/reflections.xml`: seven recent daily items, each with a title, a short teaser, and a **Read today’s reflection** link. It never includes the full reading. Configure an RSS campaign to send new daily items once the production domain and daily build are active. Use the production feed after launch, not the development feed. New article announcements can be separate occasional campaigns.

Suggested email: subject = reflection title; body = date, 1–2 introductory sentences, one prominent reading link, and the provider's unsubscribe footer. Daily Paths is the destination for the full piece.

## Verified

Synthetic reserved-domain signup, invalid email, missing consent, honeypot, case normalization, duplicate behavior, public-read denial, and persisted pending status. No real recipient was emailed. The synthetic records are removed after verification.

## Existing database launch blocker

Four unrelated content tables (`stories`, `steps`, `themes`, `journal_quotes`) have RLS disabled and broad anon/authenticated write grants. Review and restrict their write permissions before launch while preserving required public reading access. They were not changed as part of subscriber collection.
