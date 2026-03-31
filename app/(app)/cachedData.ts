import { getFish as getFishReferenceData } from "@jogwa-log/data-access/api/referenceData/fish";
import { createApiClient } from "@jogwa-log/data-access/supabase/client";
import { getSupabaseConfig } from "@jogwa-log/data-access/supabase/config";
import { cacheLife, cacheTag } from "next/cache";

export async function getFish() {
  "use cache";

  cacheLife("hours");
  cacheTag("reference-data");
  cacheTag("fish");

  const { supabasePublishableKey, supabaseUrl } = getSupabaseConfig();
  const client = createApiClient(supabaseUrl, supabasePublishableKey);

  return getFishReferenceData(client);
}
