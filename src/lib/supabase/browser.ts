import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (browser-side).
 * Call inside a component or hook — not at module level — to avoid
 * creating a new client on every render.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
