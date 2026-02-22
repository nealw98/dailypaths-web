import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_SUPABASE_URL = 'https://ofmqgqaoubsiwujgvcil.supabase.co';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceRoleKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      console.error('EXTERNAL_SUPABASE_SERVICE_ROLE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'External database not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // External Supabase for ALL data (readings AND ratings)
    const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, serviceRoleKey);
    
    const { action, data } = await req.json();

    console.log('External readings action:', action);

    switch (action) {
      case 'fetch': {
        const { data: readings, error } = await externalSupabase
          .from('readings')
          .select('id, title, opening, body, application, quote, thought_for_day, display_date, day_of_year, last_reviewed_at, admin_flagged_at')
          .order('day_of_year');

        if (error) {
          console.error('Error fetching readings:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ readings }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required for updates' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          console.error('Auth error:', authError);
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check admin role
        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          console.log('Admin access denied for user:', user.id);
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { id, updateData } = data;
        if (!id || !updateData) {
          return new Response(
            JSON.stringify({ error: 'Missing id or updateData' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const allowedFields = ['title', 'opening', 'body', 'application', 'quote', 'thought_for_day', 'updated_at', 'last_reviewed_at', 'admin_flagged_at', 'admin_notes'];
        const sanitizedData: Record<string, string | null> = {};
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            sanitizedData[field] = updateData[field];
          }
        }

        const { error } = await externalSupabase
          .from('readings')
          .update(sanitizedData)
          .eq('id', id);

        if (error) {
          console.error('Error updating reading:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetch-rating': {
        const { readingId, sessionId } = data;
        if (!readingId || !sessionId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId or sessionId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Fetching rating for reading:', readingId, 'session:', sessionId);

        const { data: rating, error } = await externalSupabase
          .from('reading_ratings')
          .select('id, rating, feedback')
          .eq('reading_id', readingId)
          .eq('session_id', sessionId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching rating:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Found rating:', rating);

        return new Response(
          JSON.stringify({ rating }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'upsert-rating': {
        const { readingId, sessionId, dayOfYear, rating, feedback } = data;
        if (!readingId || !sessionId || !rating) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId, sessionId, or rating' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Upserting rating:', { readingId, sessionId, dayOfYear, rating });

        // Check if rating exists for this session+reading combo
        const { data: existing, error: fetchError } = await externalSupabase
          .from('reading_ratings')
          .select('id')
          .eq('reading_id', readingId)
          .eq('session_id', sessionId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error checking existing rating:', fetchError);
          return new Response(
            JSON.stringify({ error: fetchError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Existing rating found:', existing);

        let resultId: string;
        if (existing) {
          // Update existing rating
          console.log('Updating existing rating:', existing.id);
          const { error: updateError } = await externalSupabase
            .from('reading_ratings')
            .update({ rating, feedback: feedback || null })
            .eq('id', existing.id);

          if (updateError) {
            console.error('Error updating rating:', updateError);
            return new Response(
              JSON.stringify({ error: updateError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          resultId = existing.id;
          console.log('Rating updated successfully');
        } else {
          // Create new rating with all fields
          console.log('Creating new rating');
          const { data: newRating, error: insertError } = await externalSupabase
            .from('reading_ratings')
            .insert({
              reading_id: readingId,
              session_id: sessionId,
              day_of_year: dayOfYear,
              rating,
              feedback: feedback || null
            })
            .select('id')
            .single();

          if (insertError) {
            console.error('Error creating rating:', insertError);
            return new Response(
              JSON.stringify({ error: insertError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          resultId = newRating.id;
          console.log('Rating created with id:', resultId);
        }

        return new Response(
          JSON.stringify({ id: resultId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'remove-rating': {
        const { readingId, sessionId } = data;
        if (!readingId || !sessionId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId or sessionId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Removing rating for reading:', readingId, 'session:', sessionId);

        const { error } = await externalSupabase
          .from('reading_ratings')
          .delete()
          .eq('reading_id', readingId)
          .eq('session_id', sessionId);

        if (error) {
          console.error('Error removing rating:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Rating removed successfully');

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ========== WEB RATINGS (unified with app) ==========
      case 'submit-web-rating': {
        const { 
          readingId, 
          readingTitle, 
          dayOfYear, 
          rating, 
          deviceId,
          reasonUnclear,
          reasonTooLong,
          reasonNotApplicable,
          reasonLanguage,
          reasonOtherText
        } = data;
        
        if (!readingId || !rating || !deviceId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId, rating, or deviceId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Submitting web rating:', { readingId, dayOfYear, rating, deviceId });

        // First, ensure device exists in app_devices (upsert)
        const { error: deviceError } = await externalSupabase
          .from('app_devices')
          .upsert({
            device_id: deviceId,
            platform: 'web',
            app_version: '1.0'
          }, {
            onConflict: 'device_id'
          });

        if (deviceError) {
          console.error('Error registering web device:', deviceError);
          return new Response(
            JSON.stringify({ error: deviceError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Build insert data with source='web'
        const insertData: Record<string, unknown> = {
          reading_id: readingId,
          reading_title: readingTitle || null,
          day_of_year: dayOfYear || null,
          rating,
          device_id: deviceId,
          source: 'web'
        };

        // Add negative reasons if provided
        if (rating === 'negative') {
          insertData.reason_unclear = reasonUnclear || false;
          insertData.reason_too_long = reasonTooLong || false;
          insertData.reason_not_applicable = reasonNotApplicable || false;
          insertData.reason_language = reasonLanguage || false;
          if (reasonOtherText) {
            insertData.reason_other_text = reasonOtherText;
          }
        }

        // Use upsert with onConflict to allow changing ratings (one record per device per reading)
        const { data: newRating, error: insertError } = await externalSupabase
          .from('app_reading_feedback')
          .upsert(insertData, {
            onConflict: 'reading_id,device_id'
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error submitting web rating:', insertError);
          return new Response(
            JSON.stringify({ error: insertError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Web rating created with id:', newRating.id);

        return new Response(
          JSON.stringify({ id: newRating.id, success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ========== APP FEEDBACK ANALYTICS ==========
      case 'fetch-app-feedback-analytics': {
        console.log('Fetching app feedback analytics');

        // Get rating distribution
        const { data: feedbackData, error: feedbackError } = await externalSupabase
          .from('app_reading_feedback')
          .select('rating');

        if (feedbackError) {
          console.error('Error fetching feedback distribution:', feedbackError);
          return new Response(
            JSON.stringify({ error: feedbackError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const distribution = {
          positive: feedbackData?.filter(f => f.rating === 'positive').length || 0,
          neutral: feedbackData?.filter(f => f.rating === 'neutral').length || 0,
          negative: feedbackData?.filter(f => f.rating === 'negative').length || 0,
          total: feedbackData?.length || 0
        };

        // Get readings with aggregated feedback (3+ ratings)
        const { data: allFeedback, error: allError } = await externalSupabase
          .from('app_reading_feedback')
          .select('reading_id, reading_title, day_of_year, rating');

        if (allError) {
          console.error('Error fetching all feedback:', allError);
          return new Response(
            JSON.stringify({ error: allError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Aggregate by reading
        const readingsMap = new Map<string, {
          reading_id: string;
          reading_title: string;
          day_of_year: number;
          positive_count: number;
          neutral_count: number;
          negative_count: number;
          total_ratings: number;
        }>();

        allFeedback?.forEach(f => {
          if (!readingsMap.has(f.reading_id)) {
            readingsMap.set(f.reading_id, {
              reading_id: f.reading_id,
              reading_title: f.reading_title || 'Untitled',
              day_of_year: f.day_of_year || 0,
              positive_count: 0,
              neutral_count: 0,
              negative_count: 0,
              total_ratings: 0
            });
          }
          const entry = readingsMap.get(f.reading_id)!;
          entry.total_ratings++;
          if (f.rating === 'positive') entry.positive_count++;
          else if (f.rating === 'neutral') entry.neutral_count++;
          else if (f.rating === 'negative') entry.negative_count++;
        });

        // Filter to 3+ ratings and calculate negative_pct
        const readingsSummary = Array.from(readingsMap.values())
          .filter(r => r.total_ratings >= 3)
          .map(r => ({
            ...r,
            negative_pct: r.total_ratings > 0 ? (r.negative_count / r.total_ratings) * 100 : 0
          }))
          .sort((a, b) => b.negative_pct - a.negative_pct || b.total_ratings - a.total_ratings);

        // Get negative reason counts
        const { data: negativeData, error: negativeError } = await externalSupabase
          .from('app_reading_feedback')
          .select('reason_unclear, reason_too_long, reason_not_applicable, reason_language, reason_other_text')
          .eq('rating', 'negative');

        if (negativeError) {
          console.error('Error fetching negative reasons:', negativeError);
          return new Response(
            JSON.stringify({ error: negativeError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const negativeReasons = {
          unclear_count: negativeData?.filter(n => n.reason_unclear).length || 0,
          too_long_count: negativeData?.filter(n => n.reason_too_long).length || 0,
          not_applicable_count: negativeData?.filter(n => n.reason_not_applicable).length || 0,
          language_count: negativeData?.filter(n => n.reason_language).length || 0,
          other_specified_count: negativeData?.filter(n => n.reason_other_text && n.reason_other_text.trim()).length || 0,
          total_negative_ratings: negativeData?.length || 0
        };

        return new Response(
          JSON.stringify({ distribution, readingsSummary, negativeReasons }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetch-app-feedback-details': {
        const { readingId, source } = data;
        if (!readingId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Fetching feedback details for reading:', readingId, 'source:', source || 'all');

        let query = externalSupabase
          .from('app_reading_feedback')
          .select('id, rating, reason_unclear, reason_too_long, reason_not_applicable, reason_language, reason_other_text, created_at, source, addressed')
          .eq('reading_id', readingId);
        
        // Filter by source if specified (not 'all')
        if (source && source !== 'all') {
          query = query.eq('source', source);
        }
        
        const { data: details, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching feedback details:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ details }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset-reading-ratings': {
        // Requires authentication and admin role
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required to reset ratings' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          console.error('Auth error:', authError);
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check admin role
        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          console.log('Admin access denied for user:', user.id);
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { readingId } = data;
        if (!readingId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Resetting all ratings for reading:', readingId);

        const { error, count } = await externalSupabase
          .from('app_reading_feedback')
          .delete()
          .eq('reading_id', readingId);

        if (error) {
          console.error('Error resetting ratings:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Reset ratings successfully, deleted count:', count);

        return new Response(
          JSON.stringify({ success: true, deleted: count }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetch-app-readings-with-feedback': {
        const { source } = data || {};
        console.log('Fetching readings with feedback, source:', source || 'all');

        // Get all readings
        const { data: readingsData, error: readingsError } = await externalSupabase
          .from('readings')
          .select('id, title, opening, body, application, quote, thought_for_day, display_date, day_of_year, last_reviewed_at, admin_flagged_at')
          .order('day_of_year');

        if (readingsError) {
          console.error('Error fetching readings:', readingsError);
          return new Response(
            JSON.stringify({ error: readingsError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get feedback with optional source filter - include addressed field
        let feedbackQuery = externalSupabase
          .from('app_reading_feedback')
          .select('reading_id, rating, created_at, source, addressed');
        
        // Filter by source if specified (not 'all')
        if (source && source !== 'all') {
          feedbackQuery = feedbackQuery.eq('source', source);
        }
        
        const { data: feedbackData, error: feedbackError } = await feedbackQuery;

        if (feedbackError) {
          console.error('Error fetching feedback:', feedbackError);
          return new Response(
            JSON.stringify({ error: feedbackError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get favorites count per reading
        const { data: favoritesData, error: favoritesError } = await externalSupabase
          .from('app_favorites')
          .select('reading_id');

        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
          // Don't fail the request, just log and continue with empty favorites
        }

        // Get daily active users data
        const { data: dauData, error: dauError } = await externalSupabase
          .from('daily_active_users')
          .select('day_of_year, active_devices');

        if (dauError) {
          console.error('Error fetching daily active users:', dauError);
          // Don't fail the request, just log and continue
        }

        // Create a map of day_of_year -> active_devices
        const dauMap = new Map<number, number>();
        dauData?.forEach(d => {
          dauMap.set(d.day_of_year, d.active_devices);
        });

        // Aggregate favorites by reading
        const favoritesMap = new Map<string, number>();
        favoritesData?.forEach(f => {
          favoritesMap.set(f.reading_id, (favoritesMap.get(f.reading_id) || 0) + 1);
        });

        // Aggregate feedback by reading - now including unaddressed_negative_count
        const feedbackMap = new Map<string, {
          total_ratings: number;
          positive_count: number;
          neutral_count: number;
          negative_count: number;
          unaddressed_negative_count: number;
          most_recent_feedback: string | null;
        }>();

        feedbackData?.forEach(f => {
          if (!feedbackMap.has(f.reading_id)) {
            feedbackMap.set(f.reading_id, {
              total_ratings: 0,
              positive_count: 0,
              neutral_count: 0,
              negative_count: 0,
              unaddressed_negative_count: 0,
              most_recent_feedback: null
            });
          }
          const entry = feedbackMap.get(f.reading_id)!;
          entry.total_ratings++;
          if (f.rating === 'positive') entry.positive_count++;
          else if (f.rating === 'neutral') entry.neutral_count++;
          else if (f.rating === 'negative') {
            entry.negative_count++;
            // Count unaddressed negative feedback
            if (!f.addressed) {
              entry.unaddressed_negative_count++;
            }
          }
          
          if (!entry.most_recent_feedback || f.created_at > entry.most_recent_feedback) {
            entry.most_recent_feedback = f.created_at;
          }
        });

        // Combine readings with feedback, favorites, and DAU data
        const readingsWithFeedback = readingsData?.map(r => {
          const feedback = feedbackMap.get(r.id) || {
            total_ratings: 0,
            positive_count: 0,
            neutral_count: 0,
            negative_count: 0,
            unaddressed_negative_count: 0,
            most_recent_feedback: null
          };
          return {
            ...r,
            ...feedback,
            favorites_count: favoritesMap.get(r.id) || 0,
            daily_active_users: dauMap.get(r.day_of_year) || 0,
            negative_pct: feedback.total_ratings > 0 
              ? (feedback.negative_count / feedback.total_ratings) * 100 
              : 0
          };
        }) || [];

        console.log(`Returning ${readingsWithFeedback.length} readings with feedback data`);

        return new Response(
          JSON.stringify({ readings: readingsWithFeedback }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ========== A/B COMPARISON ==========
      case 'fetch-comparison': {
        const { dayOfYear } = data;
        if (!dayOfYear) {
          return new Response(
            JSON.stringify({ error: 'Missing dayOfYear' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Fetching comparison for day:', dayOfYear);

        // Fetch from production table (readings)
        const { data: originalReading, error: originalError } = await externalSupabase
          .from('readings')
          .select('id, title, opening, body, application, quote, thought_for_day, display_date, day_of_year')
          .eq('day_of_year', dayOfYear)
          .maybeSingle();

        if (originalError) {
          console.error('Error fetching original reading:', originalError);
          return new Response(
            JSON.stringify({ error: originalError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Fetch from prior table (readings_prior)
        const { data: priorReading, error: priorError } = await externalSupabase
          .from('readings_prior')
          .select('id, title, opening, body, application, quote, thought_for_day, display_date, day_of_year')
          .eq('day_of_year', dayOfYear)
          .maybeSingle();

        if (priorError) {
          console.error('Error fetching prior reading:', priorError);
          return new Response(
            JSON.stringify({ error: priorError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Current found:', !!originalReading, 'Prior found:', !!priorReading);

        return new Response(
          JSON.stringify({ current: originalReading, prior: priorReading }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ========== ADMIN TRACKING ==========
      case 'mark-feedback-addressed': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check admin role
        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          console.log('Admin access denied for user:', user.id);
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { feedbackId, addressed } = data;
        if (!feedbackId) {
          return new Response(
            JSON.stringify({ error: 'Missing feedbackId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Marking feedback as addressed:', feedbackId, addressed);

        const { error } = await externalSupabase
          .from('app_reading_feedback')
          .update({ addressed: addressed !== false })
          .eq('id', feedbackId);

        if (error) {
          console.error('Error marking feedback addressed:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'mark-reading-reviewed': {
        // Simplified: reviewed=true sets last_reviewed_at=now, reviewed=false sets admin_flagged_at=now
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check admin role
        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          console.log('Admin access denied for user:', user.id);
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { readingId, reviewed } = data;
        if (!readingId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const now = new Date().toISOString();
        let updateData: Record<string, string | null>;
        
        if (reviewed) {
          // Mark as reviewed: set last_reviewed_at = now
          updateData = { last_reviewed_at: now };
          console.log('Marking reading as reviewed:', readingId);
        } else {
          // Mark as needs review: set admin_flagged_at = now (like admin feedback)
          updateData = { admin_flagged_at: now };
          console.log('Flagging reading for review:', readingId);
        }

        const { error } = await externalSupabase
          .from('readings')
          .update(updateData)
          .eq('id', readingId);

        if (error) {
          console.error('Error updating reading review status:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, ...updateData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'address-all-and-review': {
        // Address all negative feedback for a reading and mark it as reviewed
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check admin role
        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          console.log('Admin access denied for user:', user.id);
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { readingId } = data;
        if (!readingId) {
          return new Response(
            JSON.stringify({ error: 'Missing readingId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Addressing all feedback and marking reviewed for reading:', readingId);

        // 1. Mark all negative feedback as addressed
        const { error: feedbackError, count: addressedCount } = await externalSupabase
          .from('app_reading_feedback')
          .update({ addressed: true })
          .eq('reading_id', readingId)
          .eq('rating', 'negative')
          .eq('addressed', false);

        if (feedbackError) {
          console.error('Error addressing feedback:', feedbackError);
          return new Response(
            JSON.stringify({ error: feedbackError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // 2. Mark reading as reviewed
        const newReviewedAt = new Date().toISOString();
        const { error: readingError } = await externalSupabase
          .from('readings')
          .update({ last_reviewed_at: newReviewedAt })
          .eq('id', readingId);

        if (readingError) {
          console.error('Error marking reading reviewed:', readingError);
          return new Response(
            JSON.stringify({ error: readingError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Addressed', addressedCount, 'feedback items and marked reading as reviewed');

        return new Response(
          JSON.stringify({ success: true, addressedCount, last_reviewed_at: newReviewedAt }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetch-app-feedback-count': {
        const { count, error } = await externalSupabase
          .from('app_feedback')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching app_feedback count:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Also get count of unreviewed (no reviewed_at or similar - for now count all)
        const { data: latestFeedback, error: latestError } = await externalSupabase
          .from('app_feedback')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return new Response(
          JSON.stringify({ 
            total: count || 0,
            latest_created_at: latestFeedback?.created_at || null
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetch-app-feedback-list': {
        const { data: feedbackList, error } = await externalSupabase
          .from('app_feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching app_feedback list:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ feedback: feedbackList || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete-app-feedback': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { feedbackId } = data;
        if (!feedbackId) {
          return new Response(
            JSON.stringify({ error: 'Missing feedbackId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await externalSupabase
          .from('app_feedback')
          .delete()
          .eq('id', feedbackId);

        if (deleteError) {
          console.error('Error deleting app feedback:', deleteError);
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ========== STEPS & THEMES ADMIN ==========
      case 'fetch-steps': {
        const { data: steps, error } = await externalSupabase
          .from('steps')
          .select('*')
          .order('number');

        if (error) {
          console.error('Error fetching steps:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ steps }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update-step': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { stepNumber, updateData: stepUpdateData } = data;
        if (!stepNumber || !stepUpdateData) {
          return new Response(
            JSON.stringify({ error: 'Missing stepNumber or updateData' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const allowedStepFields = ['description', 'questions', 'hook', 'tagline', 'pull_quote', 'tools', 'updated_at'];
        const sanitizedStepData: Record<string, unknown> = {};
        for (const field of allowedStepFields) {
          if (stepUpdateData[field] !== undefined) {
            sanitizedStepData[field] = stepUpdateData[field];
          }
        }
        sanitizedStepData['updated_at'] = new Date().toISOString();

        console.log('Updating step:', stepNumber, Object.keys(sanitizedStepData));

        const { error } = await externalSupabase
          .from('steps')
          .update(sanitizedStepData)
          .eq('number', stepNumber);

        if (error) {
          console.error('Error updating step:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetch-themes': {
        const { data: themes, error } = await externalSupabase
          .from('themes')
          .select('*')
          .order('id');

        if (error) {
          console.error('Error fetching themes:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ themes }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update-theme': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const mainSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: { user }, error: authError } = await mainSupabase.auth.getUser();
        if (authError || !user) {
          return new Response(
            JSON.stringify({ error: 'Invalid authentication' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: roleData } = await adminSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { themeSlug, updateData: themeUpdateData } = data;
        if (!themeSlug || !themeUpdateData) {
          return new Response(
            JSON.stringify({ error: 'Missing themeSlug or updateData' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const allowedThemeFields = ['body', 'short_description', 'meta_description', 'pull_quote', 'theme_tags', 'tools', 'featured_days', 'updated_at'];
        const sanitizedThemeData: Record<string, unknown> = {};
        for (const field of allowedThemeFields) {
          if (themeUpdateData[field] !== undefined) {
            sanitizedThemeData[field] = themeUpdateData[field];
          }
        }
        sanitizedThemeData['updated_at'] = new Date().toISOString();

        console.log('Updating theme:', themeSlug, Object.keys(sanitizedThemeData));

        const { error } = await externalSupabase
          .from('themes')
          .update(sanitizedThemeData)
          .eq('slug', themeSlug);

        if (error) {
          console.error('Error updating theme:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in external-readings function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
