-- Add session_id and day_of_year columns to reading_ratings
ALTER TABLE public.reading_ratings 
ADD COLUMN session_id text,
ADD COLUMN day_of_year integer;

-- Create index for efficient lookups by session and reading
CREATE INDEX idx_reading_ratings_session_reading ON public.reading_ratings(session_id, reading_id);

-- Create index for day_of_year lookups (for admin review)
CREATE INDEX idx_reading_ratings_day_of_year ON public.reading_ratings(day_of_year);