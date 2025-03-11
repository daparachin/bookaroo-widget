
import { createClient } from '@supabase/supabase-js';

// Access the environment variables
const supabaseUrl = 'https://nizbbjmvvdddcsdkamkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pemJiam12dmRkZGNzZGthbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDU3ODAsImV4cCI6MjA1NTk4MTc4MH0.PG8VckEWLDNc3z0fXAzdqjdEZS7bWbcru7QAIvR5LIw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
