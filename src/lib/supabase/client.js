import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://toqcichgylvlzxzyhled.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_3ZEw-XUy7Y1-ewEx9x7qow_lNsG0b7d";

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes("placeholder-project") &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey.includes("placeholder-anon-key")
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

