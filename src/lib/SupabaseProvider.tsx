
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
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setIsLoading(true);
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseConfigured(isConnected);
        
        if (isConnected) {
          console.log('Supabase connection successful');
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          console.log('Current user from auth.getUser():', user);
          setUser(user);
        } else {
          console.error('Supabase connection failed - API query test unsuccessful');
          toast({
            title: "Supabase Connection Failed",
            description: "Could not connect to Supabase database. Please check your configuration.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error checking Supabase:', error);
        setIsSupabaseConfigured(false);
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
