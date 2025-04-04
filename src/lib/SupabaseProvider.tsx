import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, checkSupabaseConnection } from './supabase';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface SupabaseContextType {
  isSupabaseConfigured: boolean;
  user: User | null;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isSupabaseConfigured: false,
  user: null,
  isLoading: true
});

export const useSupabase = () => useContext(SupabaseContext);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  // We set isSupabaseConfigured to true initially to avoid the error screen
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setIsLoading(true);
        // We'll still try to test the connection but won't show the error screen
        const isConnected = await checkSupabaseConnection();
        
        if (isConnected) {
          console.log('Supabase connection successful');
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          console.log('Current user from auth.getUser():', user);
          setUser(user);
        } else {
          console.error('Supabase connection failed - API query test unsuccessful');
          // Don't need the toast as we're not showing the error screen
        }
      } catch (error) {
        console.error('Error checking Supabase:', error);
        // We keep the isSupabaseConfigured state as true to bypass the error screen
      } finally {
        setIsLoading(false);
      }
    };

    checkSupabase();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ isSupabaseConfigured, user, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
