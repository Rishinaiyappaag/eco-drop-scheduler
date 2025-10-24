-- Add 'picked_up' status to the order_status enum
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'picked_up';

-- Add a status_history column to track order progress
ALTER TABLE e_waste_requests 
ADD COLUMN IF NOT EXISTS status_history jsonb DEFAULT '[]'::jsonb;

-- Create a function to update status history
CREATE OR REPLACE FUNCTION update_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    NEW.status_history = OLD.status_history || jsonb_build_object(
      'status', NEW.status,
      'timestamp', now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update status history
DROP TRIGGER IF EXISTS track_status_changes ON e_waste_requests;
CREATE TRIGGER track_status_changes
  BEFORE UPDATE ON e_waste_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_status_history();