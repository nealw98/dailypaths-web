-- Drop existing restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can delete ratings" ON public.reading_ratings;
DROP POLICY IF EXISTS "Anyone can insert ratings" ON public.reading_ratings;
DROP POLICY IF EXISTS "Anyone can read ratings" ON public.reading_ratings;

-- Recreate as permissive policies (default)
CREATE POLICY "Anyone can delete ratings" 
ON public.reading_ratings 
FOR DELETE 
TO public
USING (true);

CREATE POLICY "Anyone can insert ratings" 
ON public.reading_ratings 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read ratings" 
ON public.reading_ratings 
FOR SELECT 
TO public
USING (true);