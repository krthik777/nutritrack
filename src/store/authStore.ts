import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  setError: (error) => set({ error }),
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      set({ 
        session,
        user: session?.user ?? null,
        loading: false 
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session,
          user: session?.user ?? null,
          loading: false
        });
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize auth'
      });
    }
  },
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ 
        user: data.user,
        session: data.session,
        loading: false
      });
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      });
      throw error;
    }
  },
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ 
        user: data.user,
        session: data.session,
        loading: false
      });
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign up'
      });
      throw error;
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ 
        user: null, 
        session: null,
        loading: false
      });
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out'
      });
      throw error;
    }
  },
}));