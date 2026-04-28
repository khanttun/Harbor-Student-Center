import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️ Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file"
    );
    return false;
  }
  if (supabaseUrl.includes("your-project") || supabaseUrl === "https://") {
    console.warn(
      "⚠️ Supabase URL appears to be a placeholder. Please update .env.local with your real Supabase project URL from https://supabase.com/dashboard"
    );
    return false;
  }
  return true;
}

export function createClient() {
  validateSupabaseConfig();
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );
}
