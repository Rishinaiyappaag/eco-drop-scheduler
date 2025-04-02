
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, checkSupabaseConnection } from './supabase';
import { toast } from '@/hooks/use-toast';

interface SupabaseContextType {
  isSupabaseConfigured: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isSupabaseConfigured: false
});

export const useSupabase = () => useContext(SupabaseContext);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setChecking(true);
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseConfigured(isConnected);
        
        if (isConnected) {
          console.log('Supabase connection successful');
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
        setChecking(false);
      }
    };

    checkSupabase();
  }, []);

  return (
    <SupabaseContext.Provider value={{ isSupabaseConfigured }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
