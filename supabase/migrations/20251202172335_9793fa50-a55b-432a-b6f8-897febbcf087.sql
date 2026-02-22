-- Allow anyone to delete ratings
CREATE POLICY "Anyone can delete ratings" 
ON public.reading_ratings 
FOR DELETE 
USING (true);