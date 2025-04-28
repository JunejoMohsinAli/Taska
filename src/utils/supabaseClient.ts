import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvkhjcslpzqenigcqqkc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2a2hqY3NscHpxZW5pZ2NxcWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODAyMDEsImV4cCI6MjA2MTE1NjIwMX0.uzG7ndaBGRFGjRkChgzcH-8TS9vngO2cOgDsO8H3i6U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
