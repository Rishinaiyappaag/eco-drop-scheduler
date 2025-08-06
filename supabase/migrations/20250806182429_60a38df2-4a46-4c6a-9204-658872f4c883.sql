-- Enable RLS on admins table and create proper policies
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admin table access
-- Only authenticated users can view admins (for admin verification)
CREATE POLICY "Authenticated users can view admins for verification" 
  ON public.admins 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Only existing admins can manage admin records
CREATE POLICY "Admins can manage admin records" 
  ON public.admins 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid()
    )
  );

-- Fix the search path security issue for the existing function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$function$;