// The Supabase project URL and its public (anon) key. Both are already shipped in the live site's JavaScript
// (js/admin.js) and are safe to publish: what the key can do is limited by the database's access rules.
// Used only when the environment does not provide its own values, so a fresh session or machine can build
// without any setup. An environment variable or .env file always wins.
process.env.SUPABASE_URL ||= 'https://ofmqgqaoubsiwujgvcil.supabase.co';
process.env.SUPABASE_ANON_KEY ||= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbXFncWFvdWJzaXd1amd2Y2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDI1NzEsImV4cCI6MjA3OTQ3ODU3MX0.85ile88Honj3SdXzxGEPFA04LG0B4OjRsbChZ8oUnmE';
