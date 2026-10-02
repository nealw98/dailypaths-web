-- Daily email at 5:00 AM Eastern, all year. The job fires at BOTH 09:00 and 10:00 UTC and marks its call "scheduled";
-- the function sends only when it is 5 AM in New York (09:00 UTC in summer, 10:00 UTC in winter) and skips the other.
-- Still nothing is sent until public.newsletter_config 'send_enabled' is 'true'.
select cron.schedule(
  'newsletter-daily',
  '0 9,10 * * *',
  $job$select net.http_post(
    url := 'https://ofmqgqaoubsiwujgvcil.supabase.co/functions/v1/newsletter-daily',
    headers := jsonb_build_object('Content-Type','application/json','x-send-secret',(select value from public.newsletter_config where key='send_secret')),
    body := '{"mode":"send","scheduled":true}'::jsonb
  )$job$
);
