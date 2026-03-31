import type { ApiSupabaseClient } from "../../supabase/client";
import type { Database } from "../../supabase/databaseTypes";

export type FishRow = Database["public"]["Tables"]["fish"]["Row"];

export async function getFish(client: ApiSupabaseClient): Promise<FishRow[]> {
  const { data, error } = await client
    .from("fish")
    .select("id, name, field_type_id")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
