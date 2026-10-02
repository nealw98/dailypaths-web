-- SUPERSEDED by 20261003010000_newsletter_daily_schedule_5am_eastern.sql (5:00 AM Eastern). Originally ran at 11:00 UTC. Nothing is sent until
-- public.newsletter_config 'send_enabled' is set to 'true'; until then each run is refused.
-- To change the time, re-run cron.schedule with the same job name and a new cron expression.
select cron.schedule(
  'newsletter-daily',
  '0 11 * * *',
  $job$select net.http_post(
    url := 'https://ofmqgqaoubsiwujgvcil.supabase.co/functions/v1/newsletter-daily',
    headers := jsonb_build_object('Content-Type','application/json','x-send-secret',(select value from public.newsletter_config where key='send_secret')),
    body := '{"mode":"send"}'::jsonb
  )$job$
);
