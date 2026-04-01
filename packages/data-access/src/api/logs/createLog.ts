import type { ApiSupabaseClient } from "../../supabase/client";
import type { Database } from "../../supabase/databaseTypes";

export type CreateLogInput =
  Database["public"]["Functions"]["create_fishing_log_from_form"]["Args"];

export async function createLog(
  client: ApiSupabaseClient,
  input: CreateLogInput,
): Promise<number> {
  const { data, error } = await client.rpc("create_fishing_log_from_form", input);

  if (error) {
    throw error;
  }

  if (data === null) {
    throw new Error("CREATE_LOG_FAILED");
  }

  return data;
}
