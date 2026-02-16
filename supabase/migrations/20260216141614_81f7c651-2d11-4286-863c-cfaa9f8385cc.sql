
-- Add request_type column to e_waste_requests
ALTER TABLE public.e_waste_requests 
ADD COLUMN request_type text NOT NULL DEFAULT 'pickup';

-- Add drop_off_location column for the selected hotspot name
ALTER TABLE public.e_waste_requests 
ADD COLUMN drop_off_location text;
