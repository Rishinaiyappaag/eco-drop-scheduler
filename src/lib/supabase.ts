
import { createClient } from '@supabase/supabase-js'

// Use environment variables or fallback to empty strings for development
// In production, these should be properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key'

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
