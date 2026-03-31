import {
  createClient,
  type SupabaseClient,
  type SupabaseClientOptions,
} from "@supabase/supabase-js";

import type { Database } from "./databaseTypes";

export type ApiSupabaseClient = SupabaseClient<Database>;

export function createApiClient(
  supabaseUrl: string,
  supabasePublishableKey: string,
  options?: SupabaseClientOptions<"public">,
): ApiSupabaseClient {
  return createClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    options,
  );
}
