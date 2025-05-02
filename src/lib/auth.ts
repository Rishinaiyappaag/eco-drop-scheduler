
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

export type SignUpCredentials = {
  email: string
  password: string
  first_name: string
  last_name: string
}

export const signUp = async ({
  email,
  password,
  first_name,
  last_name
}: SignUpCredentials) => {
  try {
    // Create the user in Supabase Auth with email/password only (no magic links)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name
        },
        emailRedirectTo: window.location.origin // Redirect back to the app after email verification
      }
    })

    if (error) {
      throw error
    }

    if (data.user) {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      })
      
      return { success: true, user: data.user }
    }
    
    return { success: false }
    
  } catch (error: any) {
    console.error('Signup error:', error)
    toast({
      title: 'Registration failed',
      description: error.message || 'Failed to create account. Please try again.',
      variant: 'destructive'
    })
    return { success: false, error }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    // Explicitly use signInWithPassword to avoid magic links
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    return { success: true, user: data.user }
  } catch (error: any) {
    console.error('Login error:', error)
    toast({
      title: 'Login failed',
      description: error.message || 'Incorrect email or password',
      variant: 'destructive'
    })
    return { success: false, error }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error)
    toast({
      title: 'Logout failed',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    })
    return false
  }
  return true
}
