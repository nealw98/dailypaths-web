-- Add UPDATE policy for reading_ratings
CREATE POLICY "Anyone can update ratings" 
ON public.reading_ratings 
FOR UPDATE 
USING (true)
WITH CHECK (true);