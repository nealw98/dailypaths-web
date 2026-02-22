-- Create reading_ratings table to store user feedback
CREATE TABLE public.reading_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_id TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('up', 'down')),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reading_ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert ratings (public feedback)
CREATE POLICY "Anyone can insert ratings" 
ON public.reading_ratings 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read ratings
CREATE POLICY "Anyone can read ratings" 
ON public.reading_ratings 
FOR SELECT 
USING (true);

-- Create index for faster lookups by reading_id
CREATE INDEX idx_reading_ratings_reading_id ON public.reading_ratings(reading_id);