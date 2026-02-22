-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can delete ratings" ON public.reading_ratings;
DROP POLICY IF EXISTS "Anyone can insert ratings" ON public.reading_ratings;
DROP POLICY IF EXISTS "Anyone can read ratings" ON public.reading_ratings;
DROP POLICY IF EXISTS "Anyone can update ratings" ON public.reading_ratings;

-- Recreate as permissive policies (default behavior)
CREATE POLICY "Anyone can read ratings" 
ON public.reading_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert ratings" 
ON public.reading_ratings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update ratings" 
ON public.reading_ratings 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete ratings" 
ON public.reading_ratings 
FOR DELETE 
USING (true);