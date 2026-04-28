import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createClient() {
  validateSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware handles session refresh
          }
        },
      },
    },
  );
}
