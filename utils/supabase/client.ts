import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "./config";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getSupabaseConfig();

  browserClient ??= createBrowserClient(supabaseUrl, supabasePublishableKey);

  return browserClient;
}
