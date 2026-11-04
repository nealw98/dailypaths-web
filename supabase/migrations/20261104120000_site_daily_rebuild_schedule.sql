-- Starts the site's nightly rebuild at midnight Eastern, all year. GitHub's own schedule runs the
-- workflow 4-8 hours late, so the homepage showed yesterday's reflection until mid-morning.
-- The job fires at BOTH 04:01 and 05:01 UTC and calls GitHub only when it is the midnight hour in
-- New York (04:01 UTC in summer, 05:01 UTC in winter), so there is one rebuild a night.
-- Needs a Vault secret 'github_dispatch_token': a fine-grained GitHub token limited to
-- nealw98/dailypaths-web with Actions: Read and write. Without it GitHub refuses the call and the
-- workflow's own late schedule still rebuilds the site.
select cron.schedule(
  'site-daily-rebuild',
  '1 4,5 * * *',
  $job$select net.http_post(
    url := 'https://api.github.com/repos/nealw98/dailypaths-web/actions/workflows/build-and-deploy.yml/dispatches',
    headers := jsonb_build_object(
      'Accept','application/vnd.github+json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='github_dispatch_token'),
      'X-GitHub-Api-Version','2022-11-28',
      'User-Agent','dailypaths-site-daily-rebuild',
      'Content-Type','application/json'),
    body := '{"ref":"2.0"}'::jsonb
  )
  where extract(hour from now() at time zone 'America/New_York') = 0$job$
);
