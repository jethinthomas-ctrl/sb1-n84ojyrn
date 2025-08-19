// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Environment variables (must be set in Netlify dashboard too)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pvznspfghyrzukzotedp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// ✅ Fail-safe check
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
