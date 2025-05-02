
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface SupabaseContextType {
  isSupabaseConfigured: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isSupabaseConfigured: false,
  user: null,
  session: null,
  isLoading: true
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

  useEffect(() => {
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
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
        console.log('Current session:', currentSession);
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Test connection to verify Supabase is configured
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
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
    <SupabaseContext.Provider value={{ isSupabaseConfigured, user, session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
