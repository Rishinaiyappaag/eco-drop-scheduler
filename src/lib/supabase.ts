
import { createClient } from '@supabase/supabase-js'
import { toast } from '@/hooks/use-toast'

// Use environment variables with fallback to hardcoded values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fgmboyzcapekhvpvsdlm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbWJveXpjYXBla2h2cHZzZGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTI5MzAsImV4cCI6MjA1OTE4ODkzMH0.j0_IBTtVpvKYQ0kSZr_YbPYnbIxphaN_n2sYFiYXaoM'

// Check if the URL is an actual URL and not just a placeholder
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return !url.includes('your-supabase-project-url')
  } catch (e) {
    return false
  }
}

if (!supabaseUrl || !isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey === 'your-public-anon-key') {
  console.error('Invalid Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

// Create a Supabase client
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Helper function to check Supabase connectivity
export const checkSupabaseConnection = async () => {
  try {
    // Simple test query to see if Supabase is working
    await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return true;
  } catch (error) {
    console.error('Supabase configuration error:', error);
    return false;
  }
}

// User-related types
export type Profile = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
  reward_points: number
}
