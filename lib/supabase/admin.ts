import { createClient } from "@supabase/supabase-js";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl || !serviceRoleKey) {
  // Only throw error if we're actually running (not during build)
  // Vercel will have these set during build, but we check at runtime
  if (typeof window === "undefined" && process.env.NODE_ENV !== "test") {
    console.warn("Missing Supabase environment variables for admin client");
  }
}

export const adminClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
    },
  }
);



