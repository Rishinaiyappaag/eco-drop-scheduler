
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface SupabaseContextType {
  isSupabaseConfigured: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isSupabaseConfigured: false,
  user: null,
  session: null,
  isLoading: true,
  refreshProfile: async () => {}
});

export const useSupabase = () => useContext(SupabaseContext);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      console.log("Refreshing profile for user:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Changed from single() to maybeSingle()
      
      console.log("Refreshed profile data:", { data, error });
      
      if (error) {
        console.error("Error refreshing profile:", error);
      }
      
      // If profile doesn't exist, create one
      if (!data && !error) {
        console.log("No profile found, creating new profile");
        await createUserProfile(user);
      }
    } catch (err) {
      console.error("Exception when refreshing profile:", err);
    }
  };
  
  // Function to create user profile
  const createUserProfile = async (currentUser: User) => {
    try {
      const firstName = currentUser.user_metadata?.first_name || '';
      const lastName = currentUser.user_metadata?.last_name || '';
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          first_name: firstName,
          last_name: lastName,
          email: currentUser.email || '',
          reward_points: 0
        })
        .select()
        .maybeSingle();
      
      console.log("Profile creation result:", { newProfile, createError });
      
      if (createError) {
        console.error("Failed to create profile:", createError);
      }
      
      return newProfile;
    } catch (err) {
      console.error("Exception when creating profile:", err);
      return null;
    }
  };

  useEffect(() => {
    console.log("SupabaseProvider initializing");
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.id);
      
      if (currentSession?.user) {
        console.log('User metadata:', currentSession.user.user_metadata);
        console.log('User email:', currentSession.user.email);
      }
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
        // Check if profile exists or was created
        const checkProfile = async () => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .maybeSingle(); // Changed from single() to maybeSingle()
            
            console.log('Profile check result:', { data, error });
            
            // If no profile data and no error, create a profile
            if (!data && !error) {
              console.log('No profile exists, creating profile...');
              await createUserProfile(currentSession.user);
            } else if (error) {
              console.error('Error checking profile:', error);
            }
          } catch (err) {
            console.error('Error checking profile existence:', err);
          }
        };
        
        // Use setTimeout to prevent Supabase deadlocks
        setTimeout(() => {
          checkProfile();
        }, 0);
        
        toast({
          title: "Signed in successfully",
          description: `Welcome${currentSession.user.user_metadata?.first_name ? ', ' + currentSession.user.user_metadata.first_name : ''}!`,
        });
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession?.user?.id);
        
        if (currentSession?.user) {
          console.log('Session user metadata:', currentSession.user.user_metadata);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Test connection to verify Supabase is configured
        const { error, count } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        console.log('Profiles table check:', { error, count });
        
        if (error) {
          console.warn('Supabase connection issue:', error);
          // We'll still consider Supabase configured, just log the warning
        }
      } catch (error) {
        console.error('Error checking Supabase session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <SupabaseContext.Provider value={{ isSupabaseConfigured, user, session, isLoading, refreshProfile }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
