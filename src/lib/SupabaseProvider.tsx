
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

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

  useEffect(() => {
    // Check if Supabase is configured properly by making a simple test query
    const checkSupabaseConfig = async () => {
      try {
        // Simple test query to see if Supabase is working
        await supabase.from('profiles').select('count', { count: 'exact', head: true });
        setIsSupabaseConfigured(true);
      } catch (error) {
        console.error('Supabase configuration error:', error);
        setIsSupabaseConfigured(false);
      }
    };

    checkSupabaseConfig();
  }, []);

  return (
    <SupabaseContext.Provider value={{ isSupabaseConfigured }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
