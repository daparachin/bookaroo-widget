import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

// Define proper types for the auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

// Create the auth context with a defined undefined state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add types for the provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error.message);
        // If refresh fails, sign the user out to prevent security issues
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        toast.error('Your session has expired. Please sign in again.');
      } else {
        setSession(data.session);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Unexpected error during session refresh:", error);
    }
  };

  useEffect(() => {
    // Check for an existing session on mount
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Set up a timer to refresh the session every 55 minutes (assuming a 1-hour token lifetime)
        if (currentSession) {
          const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes
          const refreshTimer = setInterval(refreshSession, REFRESH_INTERVAL);
          
          // Clean up the timer when the component unmounts
          return () => clearInterval(refreshTimer);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        toast.success('Signed in successfully');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Signed out');
      } else if (event === 'USER_UPDATED') {
        toast.info('Your profile has been updated');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Password recovery email sent');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Log auth error for monitoring but provide generic message to user
        console.error("Auth error:", error.message);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email before signing in');
        } else {
          throw new Error('Authentication failed');
        }
      }
      
      setUser(data.user);
      setSession(data.session);
    } catch (error) {
      // Re-throw to let component handle UI feedback
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback` // For email confirmation
        }
      });
      
      if (error) {
        console.error("Signup error:", error.message);
        throw error;
      }
      
      // Check if user is already registered
      if (data.user?.identities?.length === 0) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.info('Please check your email for a confirmation link');
      } else {
        setUser(data.user);
        setSession(data.session);
      }
    } catch (error) {
      // Re-throw to let component handle UI feedback
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      
      // Clear any sensitive data from localStorage
      localStorage.removeItem('authInfo');
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signIn, 
      signUp, 
      signOut, 
      loading,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
