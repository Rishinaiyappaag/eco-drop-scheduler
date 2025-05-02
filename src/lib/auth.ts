
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
    console.log("Signing up with:", { email, first_name, last_name });
    
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
    });

    console.log("Sign up response:", data, error);

    // Check if we need to manually create a profile (in case the trigger didn't work)
    if (data.user && !error) {
      try {
        // Check if profile already exists
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        console.log("Profile check:", { existingProfile, profileCheckError });
          
        // If profile doesn't exist, create it manually
        if (profileCheckError && profileCheckError.code === 'PGRST116') {
          console.log("Creating profile manually...");
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              first_name,
              last_name,
              email,
              reward_points: 0
            })
            .select()
            .single();
            
          console.log("Manual profile creation:", { newProfile, createError });
        }
      } catch (profileError) {
        console.error("Error handling profile:", profileError);
      }
    }

    if (error) {
      throw error;
    }

    if (data.user) {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
      
      return { success: true, user: data.user };
    }
    
    return { success: false };
    
  } catch (error: any) {
    console.error('Signup error:', error);
    toast({
      title: 'Registration failed',
      description: error.message || 'Failed to create account. Please try again.',
      variant: 'destructive'
    });
    return { success: false, error };
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
