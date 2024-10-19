// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pydjfnkjbfkikiyzqdxz.supabase.co'; // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZGpmbmtqYmZraWtpeXpxZHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzNTA3MzcsImV4cCI6MjA0NDkyNjczN30.qSzxRTk67qd9TToLP29mNKn2YAbACS3wfNqWk8m7r_o'; // Replace with your Supabase anon key
//process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
