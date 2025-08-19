// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Environment variables (must be set in Netlify dashboard too)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pvznspfghyrzukzotedp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2em5zcGZnaHlyenVrem90ZWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1OTEzOTMsImV4cCI6MjA3MTE2NzM5M30.uJ-Jh9MSnCSq_4N8g-FhLPBayyB4jL4vS2a50Eymoyo";

// ✅ Fail-safe check
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
