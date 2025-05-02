
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      console.log("Refreshing profile for user:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log("Refreshed profile data:", { data, error });
      
      if (error) {
        console.error("Error refreshing profile:", error);
      }
    } catch (err) {
      console.error("Exception when refreshing profile:", err);
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
              .single();
            
            console.log('Profile check result:', { data, error });
            
            // If there's an error, the profile might not exist
            if (error) {
              console.warn('Profile might not exist:', error);
              
              // Try to create profile if it doesn't exist
              if (error.code === 'PGRST116') {
                console.log('Creating profile manually...');
                const firstName = currentSession.user.user_metadata.first_name || '';
                const lastName = currentSession.user.user_metadata.last_name || '';
                
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: currentSession.user.id,
                    first_name: firstName,
                    last_name: lastName,
                    email: currentSession.user.email,
                    reward_points: 0
                  })
                  .select()
                  .single();
                
                console.log("Manual profile creation:", { newProfile, createError });
                
                if (createError) {
                  console.error("Failed to create profile:", createError);
                }
              }
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
  }, []);

  return (
    <SupabaseContext.Provider value={{ isSupabaseConfigured, user, session, isLoading, refreshProfile }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
