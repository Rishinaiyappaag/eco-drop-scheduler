-- Drop existing problematic policies on admins table
DROP POLICY IF EXISTS "Only admins can view admins" ON public.admins;
DROP POLICY IF EXISTS "Only admins can manage admins" ON public.admins;

-- Create a simple, non-recursive policy for admins table
-- Allow users to read admin records only if their user_id is in the admins table
CREATE POLICY "Users can view admin records if they are admin"
ON public.admins
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.id = auth.uid()
  )
);

-- Allow insert/update/delete only for existing admins
CREATE POLICY "Admins can manage admin records"
ON public.admins
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.id = auth.uid()
  )
);