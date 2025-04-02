
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

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
