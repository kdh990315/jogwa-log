import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./databaseTypes";
import { getSupabaseConfig } from "./config";

let browserClient: SupabaseClient<Database> | undefined;

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getSupabaseConfig();

  browserClient ??= createBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
  );

  return browserClient;
}
