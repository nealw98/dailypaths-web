import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to get date from day of year
function getDateFromDayOfYear(dayOfYear: number, year: number = new Date().getFullYear()): Date {
  const date = new Date(year, 0);
  date.setDate(dayOfYear);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dayOfYear = parseInt(url.searchParams.get("day") || "");
    
    if (!dayOfYear || isNaN(dayOfYear)) {
      return new Response("Missing or invalid day parameter", { status: 400 });
    }

    // Fetch the reading from external API
    const response = await fetch(
      `https://lvgwgbtzlbdzsxphzbgu.supabase.co/functions/v1/readings?day_of_year=${dayOfYear}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reading");
    }

    const reading = await response.json();
    const readingDate = getDateFromDayOfYear(dayOfYear);
    const formattedDate = formatDate(readingDate);
    
    // Truncate description for OG
    const description = reading.opening 
      ? reading.opening.substring(0, 155) + (reading.opening.length > 155 ? "..." : "")
      : "Daily reflection for your Al-Anon recovery journey.";

    // Base URL for the site
    const siteUrl = "https://dailypaths.org";
    const reviewUrl = `${siteUrl}/review`;

    // Return HTML with proper OG tags that redirects to the actual page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reading.title} - Daily Reading for ${formattedDate}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="📖 ${reading.title}">
  <meta property="og:description" content="Daily Reading for ${formattedDate} — ${description}">
  <meta property="og:site_name" content="Al-Anon Daily Paths">
  <meta property="og:url" content="${reviewUrl}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="📖 ${reading.title}">
  <meta name="twitter:description" content="Daily Reading for ${formattedDate} — ${description}">
  <meta name="twitter:site" content="@DailyPaths">
  
  <!-- Redirect to actual reading page -->
  <meta http-equiv="refresh" content="0;url=${reviewUrl}">
  <link rel="canonical" href="${reviewUrl}">
</head>
<body>
  <p>Redirecting to <a href="${reviewUrl}">${reading.title}</a>...</p>
  <script>window.location.href = "${reviewUrl}";</script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error generating share page", { status: 500 });
  }
});
