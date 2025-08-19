import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ✅ Add safety + debug logs (only show in browser console)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env vars are missing!");
  console.log("VITE_SUPABASE_URL:", supabaseUrl);
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "loaded" : "missing");
} else {
  console.log("✅ Supabase client initialized with URL:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
