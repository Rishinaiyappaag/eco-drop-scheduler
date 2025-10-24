-- Fix security warning: Set search_path for the function
DROP TRIGGER IF EXISTS track_status_changes ON e_waste_requests;
DROP FUNCTION IF EXISTS update_status_history();

CREATE OR REPLACE FUNCTION update_status_history()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    NEW.status_history = OLD.status_history || jsonb_build_object(
      'status', NEW.status,
      'timestamp', now()
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER track_status_changes
  BEFORE UPDATE ON e_waste_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_status_history();